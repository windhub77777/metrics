<!--header-->
<table>
  <tr><th colspan="2"><h3>📘 Repository template</h3></th></tr>
  <tr><td colspan="2" align="center">A template mimicking GitHub visual identity and specially crafted for repositories.</td></tr>
  <tr>
    <th rowspan="3">Supported features<br><sub><a href="metadata.yml">→ Full specification</a></sub></th>
    <td><a href="/source/plugins/activity" title="📰 Recent activity">📰</a> <a href="/source/plugins/contributors" title="🏅 Repository contributors">🏅</a> <a href="/source/plugins/followup" title="🎟️ Follow-up of issues and pull requests">🎟️</a> <a href="/source/plugins/introduction" title="🙋 Introduction">🙋</a> <a href="/source/plugins/languages" title="🈷️ Most used languages">🈷️</a> <a href="/source/plugins/licenses" title="📜 Repository licenses">📜</a> <a href="/source/plugins/lines" title="👨‍💻 Lines of code changed">👨‍💻</a> <a href="/source/plugins/pagespeed" title="⏱️ Website performances">⏱️</a> <a href="/source/plugins/people" title="🧑‍🤝‍🧑 People plugin">🧑‍🤝‍🧑</a> <a href="/source/plugins/posts" title="✒️ Recent posts">✒️</a> <a href="/source/plugins/projects" title="🗂️ Active projects">🗂️</a> <a href="/source/plugins/rss" title="🗼 Rss feed">🗼</a> <a href="/source/plugins/screenshot" title="📸 Website screenshot">📸</a> <a href="/source/plugins/sponsors" title="💕 GitHub Sponsors">💕</a> <a href="/source/plugins/stargazers" title="✨ Stargazers over last weeks">✨</a> <a href="/source/plugins/stock" title="💹 Stock prices">💹</a> <a href="/source/plugins/traffic" title="🧮 Repositories traffic">🧮</a></td>
  </tr>
  <tr>
    <td>📓 Repositories</td>
  </tr>
  <tr>
    <td>*️⃣ SVG, *️⃣ PNG, *️⃣ JPEG, #️⃣ JSON</td>
  </tr>
  <tr>
    <td colspan="2" align="center">
      <img src="https://github.com/lowlighter/lowlighter/blob/master/metrics.repository.svg" alt=""></img>
      <img width="900" height="1" alt="">
    </td>
  </tr>
</table>
<!--/header-->

## 🎎 Using a repository template

To use a repository template, a `repo` handle must be provided.

If the token owner is not the repository owner, then the `user` option must be set to the repository owner (whether it is an user or organization account).

*Example: render `lowlighter/metrics` repository*
```yml
- uses: lowlighter/metrics@latest
  with:
    template: repository
    user: lowlighter
    repo: metrics
```

## ℹ️ Examples workflows

<!--examples-->
```yaml
name: Example
uses: lowlighter/metrics@latest
with:
  template: repository
  filename: metrics.repository.svg
  token: ${{ secrets.METRICS_TOKEN_WITH_SCOPES }}
  user: lowlighter
  repo: metrics
  plugin_lines: 'yes'
  plugin_followup: 'yes'
  plugin_projects: 'yes'
  plugin_projects_repositories: lowlighter/metrics/projects/1

```
<!--/examples-->