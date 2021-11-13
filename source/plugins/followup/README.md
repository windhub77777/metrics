### 🎟️ Follow-up of issues and pull requests

The *followup* plugin displays the ratio of open/closed issues and the ratio of open/merged pull requests across all your repositories, which shows if they're well-maintained or not.

<table>
  <td align="center">
    <details open><summary>Indepth analysis</summary>
      <img src="https://github.com/lowlighter/lowlighter/blob/master/metrics.plugin.followup.indepth.svg">
    </details>
    <details><summary>Created on an user's repositories</summary>
      <img src="https://github.com/lowlighter/lowlighter/blob/master/metrics.plugin.followup.svg">
    </details>
    <details><summary>Created by an user</summary>
      <img src="https://github.com/lowlighter/lowlighter/blob/master/metrics.plugin.followup.user.svg">
    </details>
    <img width="900" height="1" alt="">
  </td>
</table>

#### ℹ️ Examples workflows

[➡️ Available options for this plugin](metadata.yml)

```yaml
- uses: lowlighter/metrics@latest
  with:
    # ... other options
    plugin_followup: yes
    plugin_followup_sections: repositories, user # Display overall status of issues/pull requests created on user's repositories and created by user
```

