//Supported providers
  const providers = {
    apple:{
      name:"Apple Music",
      embed:/^https:..embed.music.apple.com.\w+.playlist/,
    },
    spotify:{
      name:"Spotify",
      embed:/^https:..open.spotify.com.embed.playlist/,
    },
    lastfm:{
      name:"Last.fm",
      embed:/^\b$/,
    },
  }
//Supported modes
  const modes = {
    playlist:"Suggested tracks",
    recent:"Recently played",
  }

//Setup
  export default async function({login, imports, data, q, account}, {enabled = false, token = ""} = {}) {
    //Plugin execution
      try {
        //Check if plugin is enabled and requirements are met
          if ((!enabled)||(!q.music))
            return null

        //Initialization
          const raw = {
            get provider() {
              return providers[provider]?.name ?? ""
            },
            get mode() {
              return modes[mode] ?? "Unconfigured music plugin"
            },
          }
          let tracks = null

        //Load inputs
          let {provider, mode, playlist, limit, user, "played.at":played_at} = imports.metadata.plugins.music.inputs({data, account, q})
          //Auto-guess parameters
            if ((playlist)&&(!mode))
              mode = "playlist"
            if ((playlist)&&(!provider)) {
              for (const [name, {embed}] of Object.entries(providers)) {
                if (embed.test(playlist))
                  provider = name
              }
            }
            if (!mode)
              mode = "recent"
          //Provider
            if (!(provider in providers))
              throw {error:{message:provider ? `Unsupported provider "${provider}"` : "Missing provider"}, ...raw}
          //Mode
            if (!(mode in modes))
              throw {error:{message:`Unsupported mode "${mode}"`}, ...raw}
          //Playlist mode
            if (mode === "playlist") {
              if (!playlist)
                throw {error:{message:"Missing playlist url"}, ...raw}
              if (!providers[provider].embed.test(playlist))
                throw {error:{message:"Unsupported playlist url format"}, ...raw}
            }
          //Limit
            limit = Math.max(1, Math.min(100, Number(limit)))

        //Handle mode
          console.debug(`metrics/compute/${login}/plugins > music > processing mode ${mode} with provider ${provider}`)
          switch (mode) {
            //Playlist mode
              case "playlist":{
                //Start puppeteer and navigate to playlist
                  console.debug(`metrics/compute/${login}/plugins > music > starting browser`)
                  const browser = await imports.puppeteer.launch()
                  console.debug(`metrics/compute/${login}/plugins > music > started ${await browser.version()}`)
                  const page = await browser.newPage()
                  console.debug(`metrics/compute/${login}/plugins > music > loading page`)
                  await page.goto(playlist)
                  const frame = page.mainFrame()
                //Handle provider
                  switch (provider) {
                    //Apple music
                      case "apple":{
                        //Parse tracklist
                          await frame.waitForSelector(".tracklist.playlist")
                          tracks = [...await frame.evaluate(() => [...document.querySelectorAll(".tracklist li")].map(li => ({
                            name:li.querySelector(".tracklist__track__name").innerText,
                            artist:li.querySelector(".tracklist__track__sub").innerText,
                            artwork:li.querySelector(".tracklist__track__artwork img").src,
                          })))]
                        break
                      }
                    //Spotify
                      case "spotify":{
                        //Parse tracklist
                          await frame.waitForSelector("table")
                          tracks = [...await frame.evaluate(() => [...document.querySelectorAll("table tr")].map(tr => ({
                            name:tr.querySelector("td:nth-child(2) div div:nth-child(1)").innerText,
                            artist:tr.querySelector("td:nth-child(2) div div:nth-child(2)").innerText,
                            //Spotify doesn't provide artworks so we fallback on playlist artwork instead
                            artwork:window.getComputedStyle(document.querySelector("button[title=Play]").parentNode, null).backgroundImage.match(/^url\("(?<url>https:...+)"\)$/)?.groups?.url ?? null,
                          })))]
                        break
                      }
                    //Unsupported
                      default:
                        throw {error:{message:`Unsupported mode "${mode}" for provider "${provider}"`}, ...raw}
                  }
                //Close browser
                  console.debug(`metrics/compute/${login}/plugins > music > closing browser`)
                  await browser.close()
                //Format tracks
                  if (Array.isArray(tracks)) {
                    //Tracks
                      console.debug(`metrics/compute/${login}/plugins > music > found ${tracks.length} tracks`)
                      console.debug(imports.util.inspect(tracks, {depth:Infinity, maxStringLength:256}))
                    //Shuffle tracks
                      tracks = imports.shuffle(tracks)
                  }
                break
              }
            //Recently played
              case "recent":{
                //Handle provider
                  switch (provider) {
                    //Spotify
                      case "spotify":{
                        //Prepare credentials
                          const [client_id, client_secret, refresh_token] = token.split(",").map(part => part.trim())
                          if ((!client_id)||(!client_secret)||(!refresh_token))
                            throw {error:{message:"Spotify token must contain client id/secret and refresh token"}}
                        //API call and parse tracklist
                          try {
                            //Request access token
                              console.debug(`metrics/compute/${login}/plugins > music > requesting access token with spotify refresh token`)
                              const {data:{access_token:access}} = await imports.axios.post("https://accounts.spotify.com/api/token", `${new imports.url.URLSearchParams({grant_type:"refresh_token", refresh_token, client_id, client_secret})}`, {headers:{
                                "Content-Type":"application/x-www-form-urlencoded",
                              }})
                              console.debug(`metrics/compute/${login}/plugins > music > got access token`)
                            //Retrieve tracks
                              console.debug(`metrics/compute/${login}/plugins > music > querying spotify api`)
                              tracks = []
                              for (let hours = .5; hours <= 24; hours++) {
                                //Load track half-hour by half-hour
                                  const timestamp = Date.now()-hours*60*60*1000
                                  const loaded = (await imports.axios.get(`https://api.spotify.com/v1/me/player/recently-played?after=${timestamp}`, {headers:{
                                    "Content-Type":"application/json",
                                    Accept:"application/json",
                                    Authorization:`Bearer ${access}`,
                                  }})).data.items.map(({track, played_at}) => ({
                                    name:track.name,
                                    artist:track.artists[0].name,
                                    artwork:track.album.images[0].url,
                                    played_at:played_at ? `${imports.date(played_at, {timeStyle:"short", timeZone:data.config.timezone?.name})} on ${imports.date(played_at, {dateStyle:"short", timeZone:data.config.timezone?.name})}` : null,
                                  }))
                                //Ensure no duplicate are added
                                  for (const track of loaded) {
                                    if (!tracks.map(({name}) => name).includes(track.name))
                                      tracks.push(track)
                                  }
                                //Early break
                                  if (tracks.length >= limit)
                                    break
                              }
                          }
                        //Handle errors
                          catch (error) {
                            if (error.isAxiosError) {
                              const status = error.response?.status
                              const description = error.response.data?.error_description ?? null
                              const message = `API returned ${status}${description ? ` (${description})` : ""}`
                              error = error.response?.data ?? null
                              throw {error:{message, instance:error}, ...raw}
                            }
                            throw error
                          }
                        break
                      }
                    //Last.fm
                      case "lastfm":{
                        //API call and parse tracklist
                          try {
                            console.debug(`metrics/compute/${login}/plugins > music > querying lastfm api`)
                            tracks = (await imports.axios.get(`https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${user}&api_key=${token}&limit=${limit}&format=json`, {headers:{
                              "User-Agent":"lowlighter/metrics",
                              Accept:"application/json",
                            }})).data.recenttracks.track.map(track => ({
                              name:track.name,
                              artist:track.artist["#text"],
                              artwork:track.image.reverse()[0]["#text"],
                            }))
                          }
                        //Handle errors
                          catch (error) {
                            if (error.isAxiosError) {
                              const status = error.response?.status
                              const description = error.response.data?.message ?? null
                              const message = `API returned ${status}${description ? ` (${description})` : ""}`
                              error = error.response?.data ?? null
                              throw {error:{message, instance:error}, ...raw}
                            }
                            throw error
                          }
                        break
                      }
                    //Unsupported
                      default:
                        throw {error:{message:`Unsupported mode "${mode}" for provider "${provider}"`}, ...raw}
                  }
                break
              }
            //Unsupported
              default:
                throw {error:{message:`Unsupported mode "${mode}"`}, ...raw}
          }

        //Format tracks
          if (Array.isArray(tracks)) {
            //Limit tracklist
              if (limit > 0) {
                console.debug(`metrics/compute/${login}/plugins > music > keeping only ${limit} tracks`)
                tracks.splice(limit)
              }
            //Convert artworks to base64
              console.debug(`metrics/compute/${login}/plugins > music > loading artworks`)
              for (const track of tracks) {
                console.debug(`metrics/compute/${login}/plugins > music > processing ${track.name}`)
                track.artwork = await imports.imgb64(track.artwork)
              }
            //Save results
              return {...raw, tracks, played_at}
          }

        //Unhandled error
          throw {error:{message:"An error occured (could not retrieve tracks)"}}
      }
    //Handle errors
      catch (error) {
        if (error.error?.message)
          throw error
        throw {error:{message:"An error occured", instance:error}}
      }
  }
