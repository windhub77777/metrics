//Imports
const path = require("path")
const git = require("simple-git")(path.join(__dirname, ".."))

//Edited files list
const diff = async () => (await git.diff("origin/master...", ["--name-status"])).split("\n").map(x => x.trim()).filter(x => /^M\s+/.test(x)).map(x => x.replace(/^M\s+/, ""))

//Files editions
describe("Check files editions (checkout your files if needed)", () => {
  describe("Auto-generated files were not modified", () =>
    void test.each([
      "README.md",
      "source/plugins/README.md",
      "source/templates/README.md",
      "action.yml",
      "settings.example.json",
    ])("%s", async file => expect((await diff()).includes(file)).toBe(false)))
  describe("Repository level files were not modified", () =>
    void test.each([
      ".github/config/*",
      ".github/ISSUE_TEMPLATE/*",
      ".github/PULL_REQUEST_TEMPLATE/*",
      ".github/readme/partials/license.md",
      ".github/readme/partials/setup.md",
      ".github/readme/partials/features.md",
      ".github/readme/partials/documentation/compatibility.md",
      ".github/readme/partials/introduction.md",
      ".github/workflows/*",
      ".github/FUNDING.yml",
      ".github/index.mjs",
      ".github/release.mjs",
      ".github/markdown_example.mjs",
      ".github/architecture.svg",
      "LICENSE",
      "ARCHITECTURE.md",
      "SECURITY.md",
      "tests/ci.test.js",
      "source/.eslintrc.yml",
      "source/app/mocks/.eslintrc.yml",
      "vercel.json",
    ])("%s", async file => expect((await diff()).filter(edited => new RegExp(`^${file.replace(/[.]/g, "[.]").replace(/[*]/g, "[\\s\\S]*")}$`).test(edited)).length).toBe(0)))
})

//Templates editions
describe("Check templates editions", () => {
  test("Use community templates instead (see https://github.com/lowlighter/metrics/tree/master/source/templates/community)", async () =>
    void expect((await diff()).filter(edited => /^sources[/]templates[/]/.test(edited) && /^source[/]templates[/](?:classic|terminal|markdown|repository|community)[/][\s\S]*$/.test(edited)).length).toBe(0))
})
