<!--header-->
<table>
  <tr><th colspan="2"><h3>🙋 Introduction</h3></th></tr>
  <tr><td colspan="2" align="center"><p>This plugin displays account bio or organization/repository description.</p>
<p>It is mostly intended for images that will be used outside of GitHub, since these informations are already displayed on GitHub.</p>
</td></tr>
  <tr>
    <th rowspan="3">Supported features<br><sub><a href="metadata.yml">→ Full specification</a></sub></th>
    <td><a href="/source/templates/classic"><code>📗 Classic template</code></a> <a href="/source/templates/repository"><code>📘 Repository template</code></a></td>
  </tr>
  <tr>
    <td><code>👤 Users</code> <code>👥 Organizations</code> <code>📓 Repositories</code></td>
  </tr>
  <tr>
    <td><code>🔑 (scopeless)</code> <code>read:org (optional)</code> <code>read:user (optional)</code> <code>repo (optional)</code></td>
  </tr>
  <tr>
    <td colspan="2" align="center">
      <details open><summary>For an user or an organization</summary><img src="https://github.com/lowlighter/metrics/blob/examples/metrics.plugin.introduction.svg" alt=""></img></details>
      <details><summary>For a repository</summary><img src="https://github.com/lowlighter/metrics/blob/examples/metrics.plugin.introduction.repository.svg" alt=""></img></details>
      <img width="900" height="1" alt="">
    </td>
  </tr>
</table>
<!--/header-->

## ➡️ Available options

<!--options-->
<table>
  <tr>
    <td align="center" nowrap="nowrap">Type</i></td><td align="center" nowrap="nowrap">Description</td>
  </tr>
  <tr>
    <td nowrap="nowrap"><code>plugin_introduction</code></td>
    <td rowspan="2"><p>Display account or repository introduction</p>
<img width="900" height="1" alt=""></td>
  </tr>
  <tr>
    <td nowrap="nowrap"><b>type:</b> <code>boolean</code>
<br>
<b>default:</b> no<br></td>
  </tr>
  <tr>
    <td nowrap="nowrap"><code>plugin_introduction_title</code></td>
    <td rowspan="2"><p>Display introduction section title</p>
<img width="900" height="1" alt=""></td>
  </tr>
  <tr>
    <td nowrap="nowrap"><b>type:</b> <code>boolean</code>
<br>
<b>default:</b> yes<br></td>
  </tr>
</table>
<!--/options-->

## ℹ️ Examples workflows

<!--examples-->
```yaml
name: Organization introduction
uses: lowlighter/metrics@latest
with:
  filename: metrics.plugin.introduction.svg
  token: ${{ secrets.METRICS_TOKEN }}
  user: github
  base: header
  plugin_introduction: 'yes'

```
```yaml
name: Repository introduction
uses: lowlighter/metrics@latest
with:
  filename: metrics.plugin.introduction.repository.svg
  token: ${{ secrets.METRICS_TOKEN }}
  template: repository
  repo: metrics
  base: header
  plugin_introduction: 'yes'

```
<!--/examples-->
