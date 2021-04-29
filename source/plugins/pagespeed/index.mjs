//Setup
export default async function({login, imports, data, q, account}, {enabled = false, token = null} = {}) {
  //Plugin execution
  try {
    //Check if plugin is enabled and requirements are met
    if ((!enabled) || (!q.pagespeed) || ((!data.user.websiteUrl) && (!q["pagespeed.url"])))
      return null

    //Load inputs
    let {detailed, screenshot, url} = imports.metadata.plugins.pagespeed.inputs({data, account, q})
    //Format url if needed
    if (!/^https?:[/][/]/.test(url))
      url = `https://${url}`
    const {protocol, host} = imports.url.parse(url)
    const result = {url:`${protocol}//${host}`, detailed, scores:[], metrics:{}}
    //Load scores from API
    console.debug(`metrics/compute/${login}/plugins > pagespeed > querying api for ${result.url}`)
    const scores = new Map()
    await Promise.all(["performance", "accessibility", "best-practices", "seo"].map(async category => {
      //Perform audit
      console.debug(`metrics/compute/${login}/plugins > pagespeed > performing audit ${category}`)
      const request = await imports.axios.get(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?category=${category}&url=${url}${token ? `&key=${token}` : ""}`)
      const {score, title} = request.data.lighthouseResult.categories[category]
      scores.set(category, {score, title})
      console.debug(`metrics/compute/${login}/plugins > pagespeed > performed audit ${category} (status code ${request.status})`)
      //Store screenshot
      if ((screenshot) && (category === "performance")) {
        result.screenshot = request.data.lighthouseResult.audits["final-screenshot"].details.data
        console.debug(`metrics/compute/${login}/plugins > pagespeed > performed audit ${category} (status code ${request.status})`)
      }
    }))
    result.scores = [scores.get("performance"), scores.get("accessibility"), scores.get("best-practices"), scores.get("seo")]

    //Detailed metrics
    if (detailed) {
      console.debug(`metrics/compute/${login}/plugins > pagespeed > performing detailed audit`)
      const request = await imports.axios.get(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?&url=${url}${token ? `&key=${token}` : ""}`)
      Object.assign(result.metrics, ...request.data.lighthouseResult.audits.metrics.details.items)
      console.debug(`metrics/compute/${login}/plugins > pagespeed > performed detailed audit (status code ${request.status})`)
    }

    //Results
    return result
  }
  //Handle errors
  catch (error) {
    let message = "An error occured"
    if (error.isAxiosError) {
      const status = error.response?.status
      const description = error.response?.data?.error?.message?.match(/Lighthouse returned error: (?<description>[A-Z_]+)/)?.groups?.description ?? null
      message = `API returned ${status}${description ? ` (${description})` : ""}`
      error = error.response?.data ?? null
    }
    throw {error:{message, instance:error}}
  }
}
