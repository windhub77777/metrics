### 🎭 Comment reactions

The *reactions* plugin displays overall reactions on your recent issues and issue comments.

<table>
  <td align="center">
    <img src="https://github.com/lowlighter/lowlighter/blob/master/metrics.plugin.reactions.svg">
    <img width="900" height="1" alt="">
  </td>
</table>

#### ℹ️ Examples workflows

[➡️ Available options for this plugin](metadata.yml)

```yaml
- uses: lowlighter/metrics@latest
  with:
    # ... other options
    plugin_reactions: yes
    plugin_reactions_limit: 200                 # Compute reactions over last 200 issue comments
    plugin_reactions_days: 14                   # Compute reactions on issue comments posted less than 14 days ago
    plugin_reactions_details: count, percentage # Display reactions count and percentage
```