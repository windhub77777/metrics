<!-- <% if (false) { %> -->
#### 💬 Metrics for organizations
<!-- <% } %> -->

Setup is the same as for user accounts, though you'll need to add `read:org` scope, **whether you're member of target organization or not**.

![Add read:org scope to personal token](/.github/readme/imgs/setup_token_org_read_scope.png)

You'll also need to set `user` option with your organization name.

If you're encounting errors and your organization is using single sign-on, try to [authorize your personal token](https://docs.github.com/en/free-pro-team@latest/github/authenticating-to-github/authorizing-a-personal-access-token-for-use-with-saml-single-sign-on).

Most of plugins supported by user accounts will work with organization accounts, but note that rendering metrics for organizations consume way more APIs requests.

To support private repositories, add full `repo` scope to your personal token.

#### ℹ️ Example workflow

```yaml
- uses: lowlighter/metrics@latest
  with:
    # ... other options
    token: ${{ secrets.METRICS_TOKEN }}          # A personal token from an user account with read:org scope
    user: organization-name                      # Organization name
```