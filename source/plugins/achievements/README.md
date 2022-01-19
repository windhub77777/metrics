<!--header-->
<table>
  <tr><th colspan="2"><h3>🏆 Achievements</h3></th></tr>
  <tr><td colspan="2" align="center"><p>This plugin displays several highlights about what you achieved on GitHub.</p>
</td></tr>
  <tr>
    <th rowspan="3">Supported features<br><sub><a href="metadata.yml">→ Full specification</a></sub></th>
    <td><a href="/source/templates/classic/README.md"><code>📗 Classic template</code></a></td>
  </tr>
  <tr>
    <td><code>👤 Users</code> <code>👥 Organizations</code></td>
  </tr>
  <tr>
    <td><code>🔑 (scopeless)</code> <code>read:org (optional)</code> <code>read:user (optional)</code> <code>repo (optional)</code></td>
  </tr>
  <tr>
    <td colspan="2" align="center">
      <details open><summary>Compact display</summary><img src="https://github.com/lowlighter/metrics/blob/examples/metrics.plugin.achievements.compact.svg" alt=""></img></details>
      <details><summary>Detailed display</summary><img src="https://github.com/lowlighter/metrics/blob/examples/metrics.plugin.achievements.svg" alt=""></img></details>
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
    <td nowrap="nowrap"><code>plugin_achievements</code></td>
    <td rowspan="2"><p>Enable achievements plugin</p>
<img width="900" height="1" alt=""></td>
  </tr>
  <tr>
    <td nowrap="nowrap"><b>type:</b> <code>boolean</code>
<br>
<b>default:</b> no<br></td>
  </tr>
  <tr>
    <td nowrap="nowrap"><code>plugin_achievements_threshold</code></td>
    <td rowspan="2"><p>Display rank threshold</p>
<p>Use <code>X</code> to display achievements not yet unlocked</p>
<img width="900" height="1" alt=""></td>
  </tr>
  <tr>
    <td nowrap="nowrap"><b>type:</b> <code>string</code>
<br>
<b>default:</b> C<br>
<b>allowed values:</b><ul><li>S</li><li>A</li><li>B</li><li>C</li><li>X</li></ul></td>
  </tr>
  <tr>
    <td nowrap="nowrap"><code>plugin_achievements_secrets</code></td>
    <td rowspan="2"><p>Display secrets achievements</p>
<img width="900" height="1" alt=""></td>
  </tr>
  <tr>
    <td nowrap="nowrap"><b>type:</b> <code>boolean</code>
<br>
<b>default:</b> yes<br></td>
  </tr>
  <tr>
    <td nowrap="nowrap"><code>plugin_achievements_display</code></td>
    <td rowspan="2"><p>Display style</p>
<ul>
<li><code>detailed</code>: display icon, name, description and ranking</li>
<li><code>compact</code>: display icon, name and value</li>
</ul>
<img width="900" height="1" alt=""></td>
  </tr>
  <tr>
    <td nowrap="nowrap"><b>type:</b> <code>string</code>
<br>
<b>default:</b> detailed<br>
<b>allowed values:</b><ul><li>detailed</li><li>compact</li></ul></td>
  </tr>
  <tr>
    <td nowrap="nowrap"><code>plugin_achievements_limit</code></td>
    <td rowspan="2"><p>Display limit</p>
<img width="900" height="1" alt=""></td>
  </tr>
  <tr>
    <td nowrap="nowrap"><b>type:</b> <code>number</code>
<i>(0 ≤
𝑥)</i>
<br>
<b>default:</b> 0<br></td>
  </tr>
  <tr>
    <td nowrap="nowrap"><code>plugin_achievements_ignored</code></td>
    <td rowspan="2"><p>Hide specified achievements</p>
<p>Use names without the rank adjective (i.e. without &quot;great&quot;, &quot;super&quot; or &quot;master&quot;)</p>
<img width="900" height="1" alt=""></td>
  </tr>
  <tr>
    <td nowrap="nowrap"><b>type:</b> <code>array</code>
<i>(comma-separated)</i>
<br></td>
  </tr>
  <tr>
    <td nowrap="nowrap"><code>plugin_achievements_only</code></td>
    <td rowspan="2"><p>Restrict display to specified achievements</p>
<p>Use names without the rank adjective (i.e. without &quot;great&quot;, &quot;super&quot; or &quot;master&quot;)</p>
<p>This option is equivalent to <code>plugin_achievements_ignored</code> with all existing achievements but the ones listed in this option</p>
<img width="900" height="1" alt=""></td>
  </tr>
  <tr>
    <td nowrap="nowrap"><b>type:</b> <code>array</code>
<i>(comma-separated)</i>
<br></td>
  </tr>
</table>
<!--/options-->

## ℹ️ Examples workflows

<!--examples-->
```yaml
name: Detailed display
uses: lowlighter/metrics@latest
with:
  filename: metrics.plugin.achievements.svg
  token: ${{ secrets.METRICS_TOKEN }}
  base: ""
  plugin_achievements: yes
  plugin_achievements_only: sponsor, maintainer, octonaut

```
```yaml
name: Compact display
uses: lowlighter/metrics@latest
with:
  filename: metrics.plugin.achievements.compact.svg
  token: ${{ secrets.METRICS_TOKEN }}
  base: ""
  plugin_achievements: yes
  plugin_achievements_only: >-
    polyglot, stargazer, sponsor, deployer, member, maintainer, developer,
    scripter, packager, explorer, infographile, manager
  plugin_achievements_display: compact
  plugin_achievements_threshold: X

```
<!--/examples-->