### 📅 Isometric commit calendar

The *isocalendar* plugin displays an isometric view of your commits calendar, along with a few additional stats like current streak and commit average per day.

<table>
  <td align="center">
    <details open><summary>Full year isometric calendar</summary>
      <img src="https://github.com/lowlighter/lowlighter/blob/master/metrics.plugin.isocalendar.fullyear.svg">
    </details>
    <details><summary>Half year isometric calendar</summary>
      <img src="https://github.com/lowlighter/lowlighter/blob/master/metrics.plugin.isocalendar.svg">
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
    plugin_isocalendar: yes
    plugin_isocalendar_duration: full-year # Display full year instead of half year
```
