### 🧑‍🤝‍🧑 People plugin

The *people* plugin can display people you're following or sponsoring, and also users who're following or sponsoring you.
In repository mode, it's possible to display sponsors, stargazers, watchers.

<table>
  <td align="center">
    <details open><summary>Related to an user</summary>
      <img src="https://github.com/lowlighter/lowlighter/blob/master/metrics.plugin.people.followers.svg">
    </details>
    <details><summary>Related to a repository</summary>
      <img src="https://github.com/lowlighter/lowlighter/blob/master/metrics.plugin.people.repository.svg">
    </details>
    <img width="900" height="1" alt="">
  </td>
</table>

The following types are supported:

| Type            | Alias                                | User metrics       | Repository metrics |
| --------------- | ------------------------------------ | :----------------: | :----------------: |
| `followers`     |                                      | ✔️                 | ❌                |
| `following`     | `followed`                           | ✔️                 | ❌                |
| `sponsoring`    | `sponsored`, `sponsorshipsAsSponsor` | ✔️                 | ❌                |
| `sponsors`      | `sponsorshipsAsMaintainer`           | ✔️                 | ✔️                |
| `contributors`  |                                      | ❌                 | ✔️                |
| `stargazers`    |                                      | ❌                 | ✔️                |
| `watchers`      |                                      | ❌                 | ✔️                |
| `thanks`        |                                      | ✔️                 | ✔️                |
| `members`       |                                      | ✔️ (organization)  | ❌                |


Sections will be ordered the same as specified in `plugin_people_types`.
`sponsors` for repositories will output the same as the owner's sponsors.

#### ➡️ Available options

<!--options-->
<table>
  <tr>
    <td align="center" nowrap="nowrap">Type</i></td><td align="center" nowrap="nowrap">Description</td>
  </tr>
  <tr>
    <td nowrap="nowrap"><code>plugin_people</code></td>
    <td rowspan="2">Display GitHub users from various affiliations<img width="900" height="1" alt=""></td>
  </tr>
  <tr>
    <td nowrap="nowrap"><b>type:</b> <code>boolean</code>
<br>
<b>default:</b> no<br></td>
  </tr>
  <tr>
    <td nowrap="nowrap"><code>plugin_people_limit</code></td>
    <td rowspan="2">Maximum number of user to display<img width="900" height="1" alt=""></td>
  </tr>
  <tr>
    <td nowrap="nowrap"><b>type:</b> <code>number</code>
<br>
<i>(0 ≤
𝑥)</i>
<b>default:</b> 24<br></td>
  </tr>
  <tr>
    <td nowrap="nowrap"><code>plugin_people_size</code></td>
    <td rowspan="2">Size of displayed GitHub users' avatars<img width="900" height="1" alt=""></td>
  </tr>
  <tr>
    <td nowrap="nowrap"><b>type:</b> <code>number</code>
<br>
<i>(8 ≤
𝑥
≤ 64)</i>
<b>default:</b> 28<br></td>
  </tr>
  <tr>
    <td nowrap="nowrap"><code>plugin_people_types</code></td>
    <td rowspan="2">Affiliations to display<img width="900" height="1" alt=""></td>
  </tr>
  <tr>
    <td nowrap="nowrap"><b>type:</b> <code>array</code>
<i>(comma-separated)</i>
<br>
<b>default:</b> followers, following<br>
<b>allowed values:</b><ul><li>followers</li><li>following</li><li>followed</li><li>sponsoring</li><li>members</li><li>sponsored</li><li>sponsors</li><li>contributors</li><li>stargazers</li><li>watchers</li><li>thanks</li></ul></td>
  </tr>
  <tr>
    <td nowrap="nowrap"><code>plugin_people_thanks</code></td>
    <td rowspan="2">GitHub users to personally thanks<img width="900" height="1" alt=""></td>
  </tr>
  <tr>
    <td nowrap="nowrap"><b>type:</b> <code>array</code>
<i>(comma-separated)</i>
<br></td>
  </tr>
  <tr>
    <td nowrap="nowrap"><code>plugin_people_sponsors_custom</code></td>
    <td rowspan="2">Custom GitHub sponsors<img width="900" height="1" alt=""></td>
  </tr>
  <tr>
    <td nowrap="nowrap"><b>type:</b> <code>array</code>
<i>(comma-separated)</i>
<br></td>
  </tr>
  <tr>
    <td nowrap="nowrap"><code>plugin_people_identicons</code></td>
    <td rowspan="2">Use identicons instead of avatars<img width="900" height="1" alt=""></td>
  </tr>
  <tr>
    <td nowrap="nowrap"><b>type:</b> <code>boolean</code>
<br>
<b>default:</b> no<br></td>
  </tr>
  <tr>
    <td nowrap="nowrap"><code>plugin_people_shuffle</code></td>
    <td rowspan="2">Shuffle users<img width="900" height="1" alt=""></td>
  </tr>
  <tr>
    <td nowrap="nowrap"><b>type:</b> <code>boolean</code>
<br>
<b>default:</b> no<br></td>
  </tr>
</table>
<!--/options-->

*[→ Full specification](metadata.yml)*

#### ℹ️ Examples workflows

<!--examples-->
```yaml
name: Followers
uses: lowlighter/metrics@latest
with:
  filename: metrics.plugin.people.followers.svg
  token: ${{ secrets.METRICS_TOKEN }}
  base: ''
  plugin_people: 'yes'
  plugin_people_types: followers

```
```yaml
name: Contributors and sponsors
uses: lowlighter/metrics@latest
with:
  filename: metrics.plugin.people.repository.svg
  token: ${{ secrets.METRICS_TOKEN }}
  base: ''
  template: repository
  repo: metrics
  plugin_people: 'yes'
  plugin_people_types: contributors, stargazers, watchers, sponsors
  plugin_people_sponsors_custom: >-
    iamsainikhil, yutkat, KasparJohannesSchneider, ktnkk, tfSheol, haribo-io,
    marcreichel

```
<!--/examples-->