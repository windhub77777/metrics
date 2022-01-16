<!--header-->
<table>
  <tr><th colspan="2"><h3>🎭 Comment reactions</h3></th></tr>
  <tr><td colspan="2" align="center"><p>This plugin displays overall reactions on your recent issues, comments and discussions.</p>
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
      <img src="https://github.com/lowlighter/metrics/blob/examples/metrics.plugin.reactions.svg" alt=""></img>
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
    <td nowrap="nowrap"><code>plugin_reactions</code></td>
    <td rowspan="2"><p>Enable reactions plugin</p>
<img width="900" height="1" alt=""></td>
  </tr>
  <tr>
    <td nowrap="nowrap"><b>type:</b> <code>boolean</code>
<br>
<b>default:</b> no<br></td>
  </tr>
  <tr>
    <td nowrap="nowrap"><code>plugin_reactions_limit</code></td>
    <td rowspan="2"><p>Display limit (issues and pull requests comments)</p>
<img width="900" height="1" alt=""></td>
  </tr>
  <tr>
    <td nowrap="nowrap"><b>type:</b> <code>number</code>
<i>(0 ≤
𝑥
≤ 1000)</i>
<br>
<b>default:</b> 200<br></td>
  </tr>
  <tr>
    <td nowrap="nowrap"><code>plugin_reactions_limit_issues</code></td>
    <td rowspan="2"><p>Display limit (issues and pull requests, first comment)</p>
<img width="900" height="1" alt=""></td>
  </tr>
  <tr>
    <td nowrap="nowrap"><b>type:</b> <code>number</code>
<i>(0 ≤
𝑥
≤ 1000)</i>
<br>
<b>default:</b> 100<br></td>
  </tr>
  <tr>
    <td nowrap="nowrap"><code>plugin_reactions_limit_discussions</code></td>
    <td rowspan="2"><p>Display limit (discussions, first comment)</p>
<img width="900" height="1" alt=""></td>
  </tr>
  <tr>
    <td nowrap="nowrap"><b>type:</b> <code>number</code>
<i>(0 ≤
𝑥
≤ 1000)</i>
<br>
<b>default:</b> 100<br></td>
  </tr>
  <tr>
    <td nowrap="nowrap"><code>plugin_reactions_limit_discussions_comments</code></td>
    <td rowspan="2"><p>Display limit (discussions comments)</p>
<img width="900" height="1" alt=""></td>
  </tr>
  <tr>
    <td nowrap="nowrap"><b>type:</b> <code>number</code>
<i>(0 ≤
𝑥
≤ 1000)</i>
<br>
<b>default:</b> 100<br></td>
  </tr>
  <tr>
    <td nowrap="nowrap"><code>plugin_reactions_days</code></td>
    <td rowspan="2"><p>Comments maximum age</p>
<img width="900" height="1" alt=""></td>
  </tr>
  <tr>
    <td nowrap="nowrap"><b>type:</b> <code>number</code>
<i>(0 ≤
𝑥)</i>
<br>
<b>zero behaviour:</b> disable</br>
<b>default:</b> 0<br></td>
  </tr>
  <tr>
    <td nowrap="nowrap"><code>plugin_reactions_display</code></td>
    <td rowspan="2"><p>Display mode</p>
<ul>
<li><code>absolute</code>: scale percentages using total reactions count</li>
<li><code>relative</code>: scale percentages using highest reaction count</li>
</ul>
<img width="900" height="1" alt=""></td>
  </tr>
  <tr>
    <td nowrap="nowrap"><b>type:</b> <code>string</code>
<br>
<b>default:</b> absolute<br>
<b>allowed values:</b><ul><li>absolute</li><li>relative</li></ul></td>
  </tr>
  <tr>
    <td nowrap="nowrap"><code>plugin_reactions_details</code></td>
    <td rowspan="2"><p>Additional details</p>
<img width="900" height="1" alt=""></td>
  </tr>
  <tr>
    <td nowrap="nowrap"><b>type:</b> <code>array</code>
<i>(comma-separated)</i>
<br>
<b>allowed values:</b><ul><li>count</li><li>percentage</li></ul></td>
  </tr>
  <tr>
    <td nowrap="nowrap"><code>plugin_reactions_ignored</code></td>
    <td rowspan="2"><p>Ignored users</p>
<p>Useful to ignore bots activity</p>
<img width="900" height="1" alt=""></td>
  </tr>
  <tr>
    <td nowrap="nowrap">⏩ Inherits <code>users_ignored</code><br>
<b>type:</b> <code>array</code>
<i>(comma-separated)</i>
<br></td>
  </tr>
</table>
<!--/options-->

## ℹ️ Examples workflows

<!--examples-->
```yaml
name: Comment reactions
uses: lowlighter/metrics@latest
with:
  filename: metrics.plugin.reactions.svg
  token: ${{ secrets.METRICS_TOKEN }}
  base: ''
  plugin_reactions: 'yes'
  plugin_reactions_limit: 100
  plugin_reactions_details: percentage

```
<!--/examples-->
