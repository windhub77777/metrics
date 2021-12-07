//Imports
import fs from "fs/promises"
import prism_lang from "prismjs/components/index.js"
import axios from "axios"
import processes from "child_process"
import fss from "fs"
import GIFEncoder from "gifencoder"
import jimp from "jimp"
import {marked} from "marked"
import nodechartist from "node-chartist"
import opengraph from "open-graph-scraper"
import os from "os"
import paths from "path"
import PNG from "png-js"
import prism from "prismjs"
import _puppeteer from "puppeteer"
import rss from "rss-parser"
import htmlsanitize from "sanitize-html"
import git from "simple-git"
import twemojis from "twemoji-parser"
import url from "url"
import util from "util"
import fetch from "node-fetch"
import readline from "readline"
import emoji from "emoji-name-map"
import minimatch from "minimatch"
import crypto from "crypto"
import linguist from "linguist-js"
import purgecss from "purgecss"
import {minify as csso} from "csso"
import SVGO from "svgo"
import xmlformat from "xml-formatter"

prism_lang()

//Exports
export {axios, fs, git, jimp, opengraph, os, paths, processes, rss, url, fetch, util, emoji, minimatch}

/**Returns module __dirname */
export function __module(module) {
  return paths.join(paths.dirname(url.fileURLToPath(module)))
}

/**Puppeteer instantier */
export const puppeteer = {
  async launch() {
    return _puppeteer.launch({
      headless:this.headless,
      executablePath:process.env.PUPPETEER_BROWSER_PATH,
      args:this.headless ? ["--no-sandbox", "--disable-extensions", "--disable-setuid-sandbox", "--disable-dev-shm-usage"] : [],
      ignoreDefaultArgs:["--disable-extensions"],
    })
  },
  headless:true,
}

/**Plural formatter */
export function s(value, end = "") {
  return value !== 1 ? {y:"ies", "":"s"}[end] : end
}

/**Formatters */
export function formatters({timeZone} = {}) {
  //Check options
  try {
    new Date().toLocaleString("fr", {timeZoneName:"short", timeZone})
  }
  catch {
    timeZone = undefined
  }

  /**Formatter */
  const format = function(n, {sign = false, unit = true, fixed} = {}) {
    if (unit) {
      for (const {u, v} of [{u:"b", v:10 ** 9}, {u:"m", v:10 ** 6}, {u:"k", v:10 ** 3}]) {
        if (n / v >= 1)
          return `${(sign) && (n > 0) ? "+" : ""}${(n / v).toFixed(fixed ?? 2).substr(0, 4).replace(/[.]0*$/, "")}${u}`
      }
    }
    return `${(sign) && (n > 0) ? "+" : ""}${fixed ? n.toFixed(fixed) : n}`
  }

  /**Bytes formatter */
  format.bytes = function (n) {
    for (const {u, v} of [{u:"E", v:10 ** 18}, {u:"P", v:10 ** 15}, {u:"T", v:10 ** 12}, {u:"G", v:10 ** 9}, {u:"M", v:10 ** 6}, {u:"k", v:10 ** 3}]) {
      if (n / v >= 1)
        return `${(n / v).toFixed(2).substr(0, 4).replace(/[.]0*$/, "")} ${u}B`
    }
    return `${n} byte${n > 1 ? "s" : ""}`
  }

  /**Percentage formatter */
  format.percentage = function (n, {rescale = true} = {}) {
    return `${
      (n * (rescale ? 100 : 1)).toFixed(2)
        .replace(/(?<=[.])(?<decimal>[1-9]*)0+$/, "$<decimal>")
        .replace(/[.]$/, "")
    }%`
  }

  /**Text ellipsis formatter */
  format.ellipsis = function(text, {length = 20} = {}) {
    text = `${text}`
    if (text.length < length)
      return text
    return `${text.substring(0, length)}…`
  }

  /**Date formatter */
  format.date = function(string, options) {
    if (options.date) {
      delete options.date
      Object.assign(options, {day:"numeric", month:"short", year:"numeric"})
    }
    if (options.time) {
      delete options.time
      Object.assign(options, {hour:"2-digit", minute:"2-digit", second:"2-digit"})
    }
    return new Intl.DateTimeFormat("en-GB", {timeZone, ...options}).format(new Date(string))
  }

  /**License formatter */
  format.license = function(license) {
    if (license.spdxId === "NOASSERTION")
      return license.name
    return license.nickname ?? license.spdxId ?? license.name
  }

  return {format}
}

/**Array shuffler */
export function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

/**Escape html */
export function htmlescape(string, u = {"&":true, "<":true, ">":true, '"':true, "'":true}) {
  return string
    .replace(/&(?!(?:amp|lt|gt|quot|apos);)/g, u["&"] ? "&amp;" : "&")
    .replace(/</g, u["<"] ? "&lt;" : "<")
    .replace(/>/g, u[">"] ? "&gt;" : ">")
    .replace(/"/g, u['"'] ? "&quot;" : '"')
    .replace(/'/g, u["'"] ? "&apos;" : "'")
}

/**Unescape html */
export function htmlunescape(string, u = {"&":true, "<":true, ">":true, '"':true, "'":true}) {
  return string
    .replace(/&lt;/g, u["<"] ? "<" : "&lt;")
    .replace(/&gt;/g, u[">"] ? ">" : "&gt;")
    .replace(/&quot;/g, u['"'] ? '"' : "&quot;")
    .replace(/&(?:apos|#39);/g, u["'"] ? "'" : "&apos;")
    .replace(/&amp;/g, u["&"] ? "&" : "&amp;")
}

/**Chartist */
export async function chartist() {
  const css = `<style data-optimizable="true">${await fs.readFile(paths.join(__module(import.meta.url), "../../../node_modules", "node-chartist/dist/main.css")).catch(_ => "")}</style>`
  return (await nodechartist(...arguments))
    .replace(/class="ct-chart-line">/, `class="ct-chart-line">${css}`)
}

/**Language analyzer (single file) */
export async function language({filename, patch, prefix = "", timeout = 20*1000}) {
  const path = paths.join(os.tmpdir(), `${prefix}-${Math.random()}`.replace(/[^\w-]/g, ""))
  return new Promise(async (solve, reject) => {
    setTimeout(() => {
      console.debug(`metrics/language > ${filename} > timeout`)
      reject("timeout")
    }, timeout)
    try {
      //Create temp dir
      console.debug(`metrics/language > ${filename} > creating temp dir at ${path}`)
      await fs.mkdir(path, {recursive:true})

      //Create file and remove diff syntax
      await fs.writeFile(paths.join(path, paths.basename(filename)), patch.replace(/^@@ -\d+,\d+ \+\d+,\d+ @@/gm, "").replace(/^[+-]/gm, ""))

      //Call linguist
      console.debug(`metrics/language > ${filename} > calling linguist`)
      const {languages:{results}} = await linguist(path)
      const result = (Object.keys(results).shift() ?? "unknown").toLocaleLowerCase()
      console.debug(`metrics/language > ${filename} > result: ${result}`)
      solve(result)
    }
    catch (error) {
      console.debug(`metrics/language > ${filename} > ${error}`)
      reject(error)
    }
    finally {
      //Clean temp dir
      console.debug(`metrics/language > ${filename} > cleaning temp dir at ${path}`)
      fs.rm(path, {recursive:true, force:true}).catch(error => console.debug(`metrics/language > ${filename} > failed to clean temp dir at ${path} > ${error}`))
    }
  })
}

/**Run command (use this to execute commands and process whole output at once, may not be suitable for large outputs) */
export async function run(command, options, {prefixed = true, log = true} = {}) {
  const prefix = {win32:"wsl"}[process.platform] ?? ""
  command = `${prefixed ? prefix : ""} ${command}`.trim()
  return new Promise((solve, reject) => {
    console.debug(`metrics/command/run > ${command}`)
    const child = processes.exec(command, options)
    let [stdout, stderr] = ["", ""]
    child.stdout.on("data", data => stdout += data)
    child.stderr.on("data", data => stderr += data)
    child.on("close", code => {
      console.debug(`metrics/command/run > ${command} > exited with code ${code}`)
      if (log) {
        console.debug(stdout)
        console.debug(stderr)
      }
      return code === 0 ? solve(stdout) : reject(stderr)
    })
  })
}

/**Spawn command (use this to execute commands and process output on the fly) */
export async function spawn(command, args = [], options = {}, {prefixed = true, timeout = 300*1000, stdout} = {}) { //eslint-disable-line max-params
  const prefix = {win32:"wsl"}[process.platform] ?? ""
  if ((prefixed)&&(prefix)) {
    args.unshift(command)
    command = prefix
  }
  if (!stdout)
    throw new Error("`stdout` argument was not provided, use run() instead of spawn() if processing output is not needed")
  return new Promise((solve, reject) => {
    console.debug(`metrics/command/spawn > ${command} with ${args.join(" ")}`)
    const child = processes.spawn(command, args, {...options, shell:true, timeout})
    const reader = readline.createInterface({input:child.stdout})
    reader.on("line", stdout)
    const closed = new Promise(close => reader.on("close", close))
    child.on("close", async code => {
      console.debug(`metrics/command/spawn > ${command} with ${args.join(" ")} > exited with code ${code}`)
      await closed
      console.debug(`metrics/command/spawn > ${command} with ${args.join(" ")} > reader closed`)
      return code === 0 ? solve() : reject()
    })
  })
}

/**Check command existance */
export async function which(command) {
  try {
    console.debug(`metrics/command > checking existence of ${command}`)
    await run(`which ${command}`)
    return true
  }
  catch {
    console.debug(`metrics/command > checking existence of ${command} > failed`)
  }
  return false
}

/**Code hightlighter */
export function highlight(code, lang) {
  return lang in prism.languages ? prism.highlight(code, prism.languages[lang]) : code
}

/**Markdown-html sanitizer-interpreter */
export async function markdown(text, {mode = "inline", codelines = Infinity} = {}) {
  //Sanitize user input once to prevent injections and parse into markdown
  let rendered = await marked.parse(htmlunescape(htmlsanitize(text)), {highlight, silent:true, xhtml:true})
  //Markdown mode
  switch (mode) {
    case "inline": {
      rendered = htmlsanitize(
        htmlsanitize(rendered, {
          allowedTags:["h1", "h2", "h3", "h4", "h5", "h6", "br", "blockquote", "code", "span"],
          allowedAttributes:{code:["class"], span:["class"]},
        }),
        {
          allowedAttributes:{code:["class"], span:["class"]},
          transformTags:{h1:"b", h2:"b", h3:"b", h4:"b", h5:"b", h6:"b", blockquote:"i"},
        },
      )
      break
    }
    default:
      break
  }
  //Trim code snippets
  rendered = rendered.replace(/(?<open><code[\s\S]*?>)(?<code>[\s\S]*?)(?<close><\/code>)/g, (m, open, code, close) => { //eslint-disable-line max-params
    const lines = code.trim().split("\n")
    if ((lines.length > 1) && (!/class="[\s\S]*"/.test(open)))
      open = open.replace(/>/g, ' class="language-multiline" xml:space="preserve">')
    return `${open}${lines.slice(0, codelines).join("\n")}${lines.length > codelines ? `\n<span class="token trimmed">(${lines.length - codelines} more ${lines.length - codelines === 1 ? "line was" : "lines were"} trimmed)</span>` : ""}${close}`
  })
  return rendered
}

/**Check GitHub filter against object */
export function ghfilter(text, object) {
  console.debug(`metrics/svg/ghquery > checking ${text} against ${JSON.stringify(object)}`)
  const result = text.split(/(?<!NOT) /).map(x => x.trim()).filter(x => x).map(criteria => {
    const [key, filters] = criteria.split(":")
    const value = object[/^NOT /.test(key) ? key.substring(3).trim() : key.trim()]
    console.debug(`metrics/svg/ghquery > checking ${criteria} against ${value}`)
    return filters?.split(",").map(x => x.trim()).filter(x => x).map(filter => {
      if (!Number.isFinite(Number(value))) {
        if (/^NOT /.test(filter))
          return value !== filter.substring(3).trim()
        return value === filter.trim()
      }
      switch (true) {
        case /^>\d+$/.test(filter):
          return value > Number(filter.substring(1))
        case /^>=\d+$/.test(filter):
          return value >= Number(filter.substring(2))
        case /^<\d+$/.test(filter):
          return value < Number(filter.substring(1))
        case /^<=\d+$/.test(filter):
          return value <= Number(filter.substring(2))
        case /^\d+$/.test(filter):
          return value === Number(filter)
        case /^\d+..\d+$/.test(filter): {
          const [a, b] = filter.split("..").map(Number)
          return (value >= a) && (value <= b)
        }
        default:
          return false
      }
    }).reduce((a, b) => a || b, false) ?? false
  }).reduce((a, b) => a && b, true)
  console.debug(`metrics/svg/ghquery > ${result ? "matching" : "not matching"}`)
  return result
}

/**Image to base64 */
export async function imgb64(image, {width, height, fallback = true} = {}) {
  //Undefined image
  if (!image)
    return fallback ? "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mOcOnfpfwAGfgLYttYINwAAAABJRU5ErkJggg==" : null
  //Load image
  image = await jimp.read(image)
  //Resize image
  if ((width) && (height))
    image = image.resize(width, height)
  return image.getBase64Async(jimp.AUTO)
}

/**SVG utils */
export const svg = {
  /**Render as pdf */
  async pdf(rendered, {paddings = "", style = "", twemojis = false, gemojis = false, rest = null} = {}) {
    //Instantiate browser if needed
    if (!svg.resize.browser) {
      svg.resize.browser = await puppeteer.launch()
      console.debug(`metrics/svg/pdf > started ${await svg.resize.browser.version()}`)
    }
    //Additional transformations
    if (twemojis)
      rendered = await svg.twemojis(rendered, {custom:false})
    if ((gemojis) && (rest))
      rendered = await svg.gemojis(rendered, {rest})
    rendered = marked.parse(rendered)
    //Render through browser and print pdf
    console.debug("metrics/svg/pdf > loading svg")
    const page = await svg.resize.browser.newPage()
    page.on("console", ({_text:text}) => console.debug(`metrics/svg/pdf > puppeteer > ${text}`))
    await page.setContent(`<main class="markdown-body">${rendered}</main>`, {waitUntil:["load", "domcontentloaded", "networkidle2"]})
    console.debug("metrics/svg/pdf > loaded svg successfully")
    const margins = (Array.isArray(paddings) ? paddings : paddings.split(",")).join(" ")
    console.debug(`metrics/svg/pdf > margins set to ${margins}`)
    await page.addStyleTag({
      content:`
        main { margin: ${margins}; }
        main svg { height: 1em; width: 1em; }
        ${await fs.readFile(paths.join(__module(import.meta.url), "../../../node_modules", "@primer/css/dist/markdown.css")).catch(_ => "")}${style}
      `,
    })
    rendered = await page.pdf()
    //Result
    await page.close()
    console.debug("metrics/svg/pdf > rendering complete")
    return {rendered, mime:"application/pdf"}
  },
  /**Render and resize svg */
  async resize(rendered, {paddings, convert}) {
    //Instantiate browser if needed
    if (!svg.resize.browser) {
      svg.resize.browser = await puppeteer.launch()
      console.debug(`metrics/svg/resize > started ${await svg.resize.browser.version()}`)
    }
    //Format padding
    const padding = {width:1, height:1, absolute:{width:0, height:0}}
    paddings = Array.isArray(paddings) ? paddings : `${paddings}`.split(",").map(x => x.trim())
    for (const [i, dimension] of [[0, "width"], [1, "height"]]) {
      let operands = (paddings?.[i] ?? paddings[0])
      let {relative} = operands.match(/(?<relative>[+-]?[\d.]+)%$/)?.groups ?? {}
      operands = operands.replace(relative, "").trim()
      let {absolute} = operands.match(/^(?<absolute>[+-]?[\d.]+)/)?.groups ?? {}
      if (Number.isFinite(Number(absolute)))
        padding.absolute[dimension] = Number(absolute)
      if (Number.isFinite(Number(relative)))
        padding[dimension] = 1 + Number(relative/100)
    }
    console.debug(`metrics/svg/resize > padding width*${padding.width}+${padding.absolute.width}, height*${padding.height}+${padding.absolute.height}`)
    //Render through browser and resize height
    console.debug("metrics/svg/resize > loading svg")
    const page = await svg.resize.browser.newPage()
    page.setViewport({width:980, height:980})
    page.on("console", ({_text:text}) => console.debug(`metrics/svg/resize > puppeteer > ${text}`))
    await page.setContent(rendered, {waitUntil:["load", "domcontentloaded", "networkidle2"]})
    console.debug("metrics/svg/resize > loaded svg successfully")
    await page.addStyleTag({content:"body { margin: 0; padding: 0; }"})
    let mime = "image/svg+xml"
    console.debug("metrics/svg/resize > resizing svg")
    let height, resized, width
    try {
      ({resized, width, height} = await page.evaluate(async padding => {
        //Disable animations
        const animated = !document.querySelector("svg").classList.contains("no-animations")
        if (animated)
          document.querySelector("svg").classList.add("no-animations")
        console.debug(`animations are ${animated ? "enabled" : "disabled"}`)
        await new Promise(solve => setTimeout(solve, 2400))
        //Get bounds and resize
        let {y:height, width} = document.querySelector("svg #metrics-end").getBoundingClientRect()
        console.debug(`bounds width=${width}, height=${height}`)
        height = Math.ceil(height * padding.height + padding.absolute.height)
        width = Math.ceil(width * padding.width + padding.absolute.width)
        console.debug(`bounds after applying padding width=${width} (*${padding.width}+${padding.absolute.width}), height=${height} (*${padding.height}+${padding.absolute.height})`)
        //Resize svg
        if (document.querySelector("svg").getAttribute("height") === "auto")
          console.debug("skipped height resizing because it was set to \"auto\"")
        else
          document.querySelector("svg").setAttribute("height", height)
        //Enable animations
        if (animated)
          document.querySelector("svg").classList.remove("no-animations")
        //Result
        return {resized:new XMLSerializer().serializeToString(document.querySelector("svg")), height, width}
      }, padding))
    }
    catch (error) {
      console.error(error)
      console.debug(`metrics/svg/resize > an error occured: ${error}`)
      throw error
    }
    //Convert if required
    if (convert) {
      console.debug(`metrics/svg/resize > convert to ${convert}`)
      resized = await page.screenshot({type:convert, clip:{x:0, y:0, width, height}, omitBackground:true})
      mime = `image/${convert}`
    }
    //Result
    await page.close()
    console.debug("metrics/svg/resize > rendering complete")
    return {resized, mime}
  },
  /**Hash a SVG (removing its metadata first)*/
  async hash(rendered) {
    //Handle empty case
    if (!rendered)
      return null
    //Instantiate browser if needed
    if (!svg.resize.browser) {
      svg.resize.browser = await puppeteer.launch()
      console.debug(`metrics/svg/hash > started ${await svg.resize.browser.version()}`)
    }
    //Compute hash
    const page = await svg.resize.browser.newPage()
    await page.setContent(rendered, {waitUntil:["load", "domcontentloaded", "networkidle2"]})
    const data = await page.evaluate(async () => {
      document.querySelector("footer")?.remove()
      return document.querySelector("svg").outerHTML
    })
    const hash = crypto.createHash("md5").update(data).digest("hex")
    //Result
    await page.close()
    console.debug(`metrics/svg/hash > MD5=${hash}`)
    return hash
  },
  /**Render twemojis */
  async twemojis(rendered, {custom = true} = {}) {
    //Load emojis
    console.debug("metrics/svg/twemojis > rendering twemojis")
    const emojis = new Map()
    for (const {text:emoji, url} of twemojis.parse(rendered)) {
      if (!emojis.has(emoji))
        emojis.set(emoji, (await axios.get(url)).data.replace(/^<svg /, '<svg class="twemoji" '))
    }
    //Apply replacements
    for (const [emoji, twemoji] of emojis) {
      if (custom)
        rendered = rendered.replace(new RegExp(`<metrics[ ]*(?<attributes>[^>]*)>${emoji}</metrics>`, "g"), twemoji.replace(/(<svg class="twemoji" [\s\S]+?)(>)/, "$1 $<attributes> $2"))
      rendered = rendered.replace(new RegExp(emoji, "g"), twemoji)
    }
    return rendered
  },
  /**Render github emojis */
  async gemojis(rendered, {rest}) {
    //Load gemojis
    console.debug("metrics/svg/gemojis > rendering gemojis")
    const emojis = new Map()
    try {
      for (const [emoji, url] of Object.entries((await rest.emojis.get()).data).map(([key, value]) => [`:${key}:`, value])) {
        if (((!emojis.has(emoji))) && (new RegExp(emoji, "g").test(rendered)))
          emojis.set(emoji, `<img class="gemoji" src="${await imgb64(url)}" height="16" width="16" alt="">`)
      }
    }
    catch (error) {
      console.debug("metrics/svg/gemojis > could not load gemojis")
      console.debug(error)
    }
    //Apply replacements
    for (const [emoji, gemoji] of emojis)
      rendered = rendered.replace(new RegExp(emoji, "g"), gemoji)
    return rendered
  },
  /**Optimizers */
  optimize:{
    /**CSS optimizer */
    async css(rendered) {
      //Extract styles
      console.debug("metrics/svg/optimize/css > optimizing")
      const regex = /<style data-optimizable="true">(?<style>[\s\S]*?)<\/style>/
      const cleaned = "<!-- (optimized css) -->"
      const css = []
      while (regex.test(rendered)) {
        const style = htmlunescape(rendered.match(regex)?.groups?.style ?? "")
        rendered = rendered.replace(regex, cleaned)
        css.push({raw:style})
      }
      const content = [{raw:rendered, extension:"html"}]

      //Purge CSS
      const purged = await new purgecss.PurgeCSS().purge({content, css})
      const optimized = `<style>${csso(purged.map(({css}) => css).join("\n")).css}</style>`
      return rendered.replace(cleaned, optimized)
    },
    /**XML optimizer */
    async xml(rendered, {raw = false} = {}) {
      console.debug("metrics/svg/optimize/xml > optimizing")
      if (raw) {
        console.debug("metrics/svg/optimize/xml > skipped as raw option is enabled")
        return rendered
      }
      return xmlformat(rendered, {lineSeparator:"\n", collapseContent:true})
    },
    /**SVG optimizer */
    async svg(rendered, {raw = false} = {}, experimental = new Set()) {
      console.debug("metrics/svg/optimize/svg > optimizing")
      if (raw) {
        console.debug("metrics/svg/optimize/svg > skipped as raw option is enabled")
        return rendered
      }
      if (!experimental.has("--optimize")) {
        console.debug("metrics/svg/optimize/svg > this feature require experimental feature flag --optimize-svg")
        return rendered
      }
      const {error, data:optimized} = await SVGO.optimize(rendered, {
        multipass:true,
        plugins:SVGO.extendDefaultPlugins([
          //Additional cleanup
          {name:"cleanupListOfValues"},
          {name:"removeRasterImages"},
          {name:"removeScriptElement"},
          //Force CSS style consistency
          {name:"inlineStyles", active:false},
          {name:"removeViewBox", active:false},
        ]),
      })
      if (error)
        throw new Error(`Could not optimize SVG: \n${error}`)
      return optimized
    }
  }
}

/**Wait */
export async function wait(seconds) {
  await new Promise(solve => setTimeout(solve, seconds * 1000))
}

/**Create record from puppeteer browser */
export async function record({page, width, height, frames, scale = 1, quality = 80, x = 0, y = 0, delay = 150, background = true}) {
  //Register images frames
  const images = []
  for (let i = 0; i < frames; i++) {
    images.push(await page.screenshot({type:"png", clip:{width, height, x, y}, omitBackground:background}))
    await wait(delay / 1000)
    if (i % 10 === 0)
      console.debug(`metrics/record > processed ${i}/${frames} frames`)
  }
  console.debug(`metrics/record > processed ${frames}/${frames} frames`)
  //Post-processing
  console.debug("metrics/record > applying post-processing")
  return Promise.all(images.map(async buffer => (await jimp.read(buffer)).scale(scale).quality(quality).getBase64Async("image/png")))
}

/**Create gif from puppeteer browser*/
export async function gif({page, width, height, frames, x = 0, y = 0, repeat = true, delay = 150, quality = 10}) {
  //Create temporary stream
  const path = paths.join(os.tmpdir(), `${Math.round(Math.random() * 1000000000)}.gif`)
  console.debug(`metrics/puppeteergif > set write stream to "${path}"`)
  if (fss.existsSync(path))
    await fs.unlink(path)
  //Create encoder
  const encoder = new GIFEncoder(width, height)
  encoder.createWriteStream().pipe(fss.createWriteStream(path))
  encoder.start()
  encoder.setRepeat(repeat ? 0 : -1)
  encoder.setDelay(delay)
  encoder.setQuality(quality)
  //Register frames
  for (let i = 0; i < frames; i++) {
    const buffer = new PNG(await page.screenshot({clip:{width, height, x, y}}))
    encoder.addFrame(await new Promise(solve => buffer.decode(pixels => solve(pixels))))
    if (frames % 10 === 0)
      console.debug(`metrics/puppeteergif > processed ${i}/${frames} frames`)
  }
  console.debug(`metrics/puppeteergif > processed ${frames}/${frames} frames`)
  //Close encoder and convert to base64
  encoder.finish()
  const result = await fs.readFile(path, "base64")
  await fs.unlink(path)
  return `data:image/gif;base64,${result}`
}
