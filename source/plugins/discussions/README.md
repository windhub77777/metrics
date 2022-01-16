<!--header-->
<table>
  <tr><th colspan="2"><h3>💬 Discussions</h3></th></tr>
  <tr><td colspan="2" align="center"><p>This plugin displays your GitHub discussions stats.</p>
</td></tr>
  <tr>
    <th rowspan="3">Supported features<br><sub><a href="metadata.yml">→ Full specification</a></sub></th>
    <td><a href="/source/templates/classic"><code>📗 Classic template</code></a></td>
  </tr>
  <tr>
    <td><code>👤 Users</code></td>
  </tr>
  <tr>
    <td><code>🔑 (scopeless)</code> <code>read:org (optional)</code> <code>read:user (optional)</code> <code>repo (optional)</code></td>
  </tr>
  <tr>
    <td colspan="2" align="center">
      <img src="https://github.com/lowlighter/metrics/blob/examples/metrics.plugin.discussions.svg" alt=""></img>
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
    <td nowrap="nowrap"><code>plugin_discussions</code></td>
    <td rowspan="2"><p>Enable discussions plugin</p>
<img width="900" height="1" alt=""></td>
  </tr>
  <tr>
    <td nowrap="nowrap"><b>type:</b> <code>boolean</code>
<br>
<b>default:</b> no<br></td>
  </tr>
  <tr>
    <td nowrap="nowrap"><code>plugin_discussions_categories</code></td>
    <td rowspan="2"><p>Toggle discussion categories display</p>
<img width="900" height="1" alt=""></td>
  </tr>
  <tr>
    <td nowrap="nowrap">✨ On <code>master</code>/<code>main</code><br>
<b>type:</b> <code>boolean</code>
<br>
<b>default:</b> yes<br></td>
  </tr>
  <tr>
    <td nowrap="nowrap"><code>plugin_discussions_categories_limit</code></td>
    <td rowspan="2"><p>Display limit (categories)</p>
<p>Note that categories are sorted from highest to lowest count.</p>
<img width="900" height="1" alt=""></td>
  </tr>
  <tr>
    <td nowrap="nowrap">✨ On <code>master</code>/<code>main</code><br>
<b>type:</b> <code>number</code>
<br>
<b>zero behaviour:</b> disable</br>
<b>default:</b> 0<br></td>
  </tr>
</table>
<!--/options-->

## ℹ️ Examples workflows

<!--examples-->
```yaml
name: GitHub Discussions
uses: lowlighter/metrics@latest
with:
  filename: metrics.plugin.discussions.svg
  token: ${{ secrets.METRICS_TOKEN }}
  base: ""
  plugin_discussions: yes
  plugin_discussions_categories_limit: 8

```
<!--/examples-->
