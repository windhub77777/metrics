//Imports
import {indepth as indepth_analyzer, recent as recent_analyzer} from "./analyzers.mjs"

//Setup
export default async function({login, data, imports, q, rest, account}, {enabled = false, extras = false} = {}) {
  //Plugin execution
  try {
    //Check if plugin is enabled and requirements are met
    if ((!enabled) || (!q.languages))
      return null

    //Context
    let context = {mode:"user"}
    if (q.repo) {
      console.debug(`metrics/compute/${login}/plugins > activity > switched to repository mode`)
      context = {...context, mode:"repository"}
    }

    //Load inputs
    let {ignored, skipped, colors, aliases, details, threshold, limit, indepth, "analysis.timeout":timeout, sections, categories, "recent.categories":_recent_categories, "recent.load":_recent_load, "recent.days":_recent_days} = imports.metadata.plugins.languages.inputs({data, account, q})
    threshold = (Number(threshold.replace(/%$/, "")) || 0) / 100
    skipped.push(...data.shared["repositories.skipped"])
    if (!limit)
      limit = Infinity
    aliases = Object.fromEntries(aliases.split(",").filter(alias => /^[\s\S]+:[\s\S]+$/.test(alias)).map(alias => alias.trim().split(":")).map(([key, value]) => [key.toLocaleLowerCase(), value]))

    //Custom colors
    const colorsets = JSON.parse(`${await imports.fs.readFile(`${imports.__module(import.meta.url)}/colorsets.json`)}`)
    if ((`${colors}` in colorsets) && (limit <= 8))
      colors = colorsets[`${colors}`]
    colors = Object.fromEntries(decodeURIComponent(colors).split(",").map(x => x.trim().toLocaleLowerCase()).filter(x => x).map(x => x.split(":").map(x => x.trim())))
    console.debug(`metrics/compute/${login}/plugins > languages > custom colors ${JSON.stringify(colors)}`)

    //Unique languages
    const repositories = [...data.user.repositories.nodes, ...data.user.repositoriesContributedTo.nodes]
    const unique = new Set(repositories.flatMap(repository => repository.languages.edges.map(({node:{name}}) => name))).size

    //Iterate through user's repositories and retrieve languages data
    console.debug(`metrics/compute/${login}/plugins > languages > processing ${data.user.repositories.nodes.length} repositories`)
    const languages = {unique, sections, details, indepth, colors:{}, total:0, stats:{}, "stats.recent":{}}
    const customColors = {}
    for (const repository of data.user.repositories.nodes) {
      //Skip repository if asked
      if ((skipped.includes(repository.name.toLocaleLowerCase())) || (skipped.includes(`${repository.owner.login}/${repository.name}`.toLocaleLowerCase()))) {
        console.debug(`metrics/compute/${login}/plugins > languages > skipped repository ${repository.owner.login}/${repository.name}`)
        continue
      }
      //Process repository languages
      for (const {size, node:{color, name}} of Object.values(repository.languages.edges)) {
        languages.stats[name] = (languages.stats[name] ?? 0) + size
        if (colors[name.toLocaleLowerCase()])
          customColors[name] = colors[name.toLocaleLowerCase()]
        if (!languages.colors[name])
          languages.colors[name] = color
        languages.total += size
      }
    }

    //Extras features
    if (extras) {
      //Recently used languages
      if ((sections.includes("recently-used"))&&(context.mode === "user")) {
        try {
          console.debug(`metrics/compute/${login}/plugins > languages > using recent analyzer`)
          languages["stats.recent"] = await recent_analyzer({login, data, imports, rest, account}, {skipped, categories:_recent_categories ?? categories, days:_recent_days, load:_recent_load, timeout})
          Object.assign(languages.colors, languages["stats.recent"].colors)
        }
        catch (error) {
          console.debug(`metrics/compute/${login}/plugins > languages > ${error}`)
        }
      }

      //Indepth mode
      if (indepth) {
        try {
          console.debug(`metrics/compute/${login}/plugins > languages > switching to indepth mode (this may take some time)`)
          const existingColors = languages.colors
          Object.assign(languages, await indepth_analyzer({login, data, imports, repositories}, {skipped, categories, timeout}))
          Object.assign(languages.colors, existingColors)
          console.debug(`metrics/compute/${login}/plugins > languages > indepth analysis missed ${languages.missed} commits`)
        }
        catch (error) {
          console.debug(`metrics/compute/${login}/plugins > languages > ${error}`)
        }
      }
    }

    //Apply aliases and group languages when needed
    for (const stats of [languages.stats, languages.lines, languages["stats.recent"].stats, languages["stats.recent"].lines]) {
      if (!stats)
        continue
      for (const [language, value] of Object.entries(stats)) {
        if (language.toLocaleLowerCase() in aliases) {
          delete stats[language]
          const alias = aliases[language.toLocaleLowerCase()]
          stats[alias] = (stats[alias] ?? 0) + value
          console.debug(`metrics/compute/${login}/plugins > languages > ${language} -> ${alias}: ${stats[alias]} (+${value})`)
        }
      }
    }

    //Compute languages stats
    for (const {section, stats = {}, lines = {}, total = 0} of [{section:"favorites", stats:languages.stats, lines:languages.lines, total:languages.total}, {section:"recent", ...languages["stats.recent"]}]) {
      console.debug(`metrics/compute/${login}/plugins > languages > computing stats ${section}`)
      languages[section] = Object.entries(stats).filter(([name]) => !ignored.includes(name.toLocaleLowerCase())).sort(([_an, a], [_bn, b]) => b - a).slice(0, limit).map(([name, value]) => ({name, value, size:value, color:languages.colors[name], x:0})).filter(({value}) => value / total > threshold)
      const visible = {total:Object.values(languages[section]).map(({size}) => size).reduce((a, b) => a + b, 0)}
      for (let i = 0; i < languages[section].length; i++) {
        const {name} = languages[section][i]
        languages[section][i].value /= visible.total
        languages[section][i].x = (languages[section][i - 1]?.x ?? 0) + (languages[section][i - 1]?.value ?? 0)
        languages[section][i].lines = lines[name] ?? 0
        if ((colors[i]) && (!colors[name.toLocaleLowerCase()]))
          languages[section][i].color = colors[i]
        else
          languages[section][i].color = customColors[name] ?? languages.colors[name] ?? "#ededed"
      }
    }

    //Results
    return languages
  }
  //Handle errors
  catch (error) {
    throw {error:{message:"An error occured", instance:error}}
  }
}
