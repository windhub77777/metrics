<!--header-->
<table>
  <tr><th colspan="2"><h3>💭 GitHub Community Support</h3></th></tr>
  <tr><td colspan="2" align="center"><p>This plugin displays your statistics from <a href="https://github.community/">GitHub Support Community</a> (an account must be created on it beforehand).</p>
</td></tr>
  <tr>
    <th rowspan="3">Supported features<br><sub><a href="metadata.yml">→ Full specification</a></sub></th>
    <td><a href="/source/templates/classic"><code>📗 Classic template</code></a></td>
  </tr>
  <tr>
    <td><code>👤 Users</code></td>
  </tr>
  <tr>
    <td><i>No tokens are required for this plugin</i></td>
  </tr>
  <tr>
    <td colspan="2" align="center">
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
    <td nowrap="nowrap"><code>plugin_support</code></td>
    <td rowspan="2"><p>Enable support plugin</p>
<img width="900" height="1" alt=""></td>
  </tr>
  <tr>
    <td nowrap="nowrap"><b>type:</b> <code>boolean</code>
<br>
<b>default:</b> no<br></td>
  </tr>
</table>
<!--/options-->

## ℹ️ Examples workflows

<!--examples-->
```yaml
name: GitHub Community Support
uses: lowlighter/metrics@latest
with:
  filename: metrics.plugin.support.svg
  token: NOT_NEEDED
  base: ''
  plugin_support: 'yes'

```
<!--/examples-->
