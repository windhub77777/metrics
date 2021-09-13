//Setup
export default async function({login, data, graphql, q, imports, queries, account}, {enabled = false} = {}) {
  //Plugin execution
  try {
    //Check if plugin is enabled and requirements are met
    if ((!enabled) || (!q.isocalendar))
      return null

    //Load inputs
    let {duration} = imports.metadata.plugins.isocalendar.inputs({data, account, q})

    //Compute start day
    const now = new Date()
    const start = new Date(now)
    if (duration === "full-year")
      start.setFullYear(now.getFullYear() - 1)
    else
      start.setHours(-24 * 180)

    //Compute padding to ensure last row is complete
    const padding = new Date(start)
    padding.setHours(-14 * 24)

    //Retrieve contribution calendar from graphql api
    console.debug(`metrics/compute/${login}/plugins > isocalendar > querying api`)
    const calendar = {}
    for (const [name, from, to] of [["padding", padding, start], ["weeks", start, now]]) {
      console.debug(`metrics/compute/${login}/plugins > isocalendar > loading ${name} from "${from.toISOString()}" to "${to.toISOString()}"`)
      const {user:{calendar:{contributionCalendar:{weeks}}}} = await graphql(queries.isocalendar.calendar({login, from:from.toISOString(), to:to.toISOString()}))
      calendar[name] = weeks
    }

    //Apply padding
    console.debug(`metrics/compute/${login}/plugins > isocalendar > applying padding`)
    const firstweek = calendar.weeks[0].contributionDays
    const padded = calendar.padding.flatMap(({contributionDays}) => contributionDays).filter(({date}) => !firstweek.map(({date}) => date).includes(date))
    while (firstweek.length < 7)
      firstweek.unshift(padded.pop())

    //Compute the highest contributions in a day, streaks and average commits per day
    console.debug(`metrics/compute/${login}/plugins > isocalendar > computing stats`)
    const {streak, max, average} = await statistics({login, data, graphql, queries})
    const reference = Math.max(...calendar.weeks.flatMap(({contributionDays}) => contributionDays.map(({contributionCount}) => contributionCount)))

    //Compute SVG
    console.debug(`metrics/compute/${login}/plugins > isocalendar > computing svg render`)
    const size = 6
    let i = 0, j = 0
    let svg = `
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" style="margin-top: -130px;" viewBox="0,0 480,${duration === "full-year" ? 270 : 170}">
              ${
      [1, 2].map(k => `
                <filter id="brightness${k}">
                  <feComponentTransfer>
                    ${[..."RGB"].map(channel => `<feFunc${channel} type="linear" slope="${1 - k * 0.4}" />`).join("")}
                  </feComponentTransfer>
                </filter>`
      )
        .join("")
    }
              <g transform="scale(4) translate(12, 0)">`
    //Iterate through weeks
    for (const week of calendar.weeks) {
      svg += `<g transform="translate(${i * 1.7}, ${i})">`
      j = 0
      //Iterate through days
      for (const day of week.contributionDays) {
        const ratio = day.contributionCount / reference
        svg += `
                    <g transform="translate(${j * -1.7}, ${j + (1 - ratio) * size})">
                      <path fill="${day.color}" d="M1.7,2 0,1 1.7,0 3.4,1 z" />
                      <path fill="${day.color}" filter="url(#brightness1)" d="M0,1 1.7,2 1.7,${2 + ratio * size} 0,${1 + ratio * size} z" />
                      <path fill="${day.color}" filter="url(#brightness2)" d="M1.7,2 3.4,1 3.4,${1 + ratio * size} 1.7,${2 + ratio * size} z" />
                    </g>`
        j++
      }
      svg += "</g>"
      i++
    }
    svg += "</g></svg>"

    //Results
    return {streak, max, average, svg, duration}
  }
  //Handle errors
  catch (error) {
    if (error.error?.message)
      throw error
    throw {error:{message:"An error occured", instance:error}}
  }
}

/**Compute max and current streaks */
async function statistics({login, data, graphql, queries}) {
  let average = 0, max = 0, streak = {max:0, current:0}, values = []
  const now = new Date()
  for (let from = new Date(data.user.createdAt); from < now;) {
    //Load contribution calendar
    let to = new Date(from)
    to.setFullYear(to.getFullYear() + 1)
    if (to > now)
      to = now
    console.debug(`metrics/compute/${login}/plugins > isocalendar > loading calendar from "${from.toISOString()}" to "${to.toISOString()}"`)
    const {user:{calendar:{contributionCalendar:{weeks}}}} = await graphql(queries.isocalendar.calendar({login, from:from.toISOString(), to:to.toISOString()}))
    from = to
    //Compute streaks
    for (const week of weeks) {
      for (const day of week.contributionDays) {
        values.push(day.contributionCount)
        max = Math.max(max, day.contributionCount)
        streak.current = day.contributionCount ? streak.current + 1 : 0
        streak.max = Math.max(streak.max, streak.current)
      }
    }
  }
  average = (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2).replace(/[.]0+$/, "")
  return {streak, max, average}
}