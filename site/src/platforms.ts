export const repository = "https://github.com/gongahkia/tines";
export const platforms = [
  {
    id: "ghostty",
    name: "Ghostty",
    description: "An ink palette for your terminal.",
    instructions:
      "Requires Ghostty 1.3 or newer. Clone the repository, then run the installer from its root. It previews changes by default; --apply installs both themes. Add the paired theme line below to your Ghostty config and reload.",
    code: "git clone https://github.com/gongahkia/tines.git\ncd tines\npython3 scripts/install_ghostty.py --apply",
    configuration:
      "theme = light:tines-light,dark:tines-dark\nwindow-theme = system\nbackground-opacity = 1",
    language: "Shell · then Ghostty config",
    url: `${repository}/blob/main/docs/GHOSTTY.md`,
  },
  {
    id: "neovim",
    name: "Neovim",
    description: "Syntax, diagnostics, and a considered hierarchy.",
    instructions:
      "Requires Neovim 0.10 or newer. Install the repository with your plugin manager, or follow the manual package instructions in the guide. Then select a theme in your Neovim configuration.",
    code: 'vim.o.background = "light"\nvim.cmd.colorscheme("tines")',
    configuration: "",
    language: "Lua · after installation",
    url: `${repository}/blob/main/docs/NEOVIM.md`,
  },
  {
    id: "vscode",
    name: "VS Code / Cursor",
    description: "One theme extension, two appearances.",
    instructions:
      "Requires VS Code 1.85 or newer, or a compatible Cursor version. From a cloned Tines repository, package the local extension. Use “Extensions: Install from VSIX…” to select the resulting file, then “Preferences: Color Theme” to choose tines-light or tines-dark.",
    code: "cd vscode\nnpx --yes @vscode/vsce@3.6.2 package --no-dependencies --out tines-color-theme-0.1.0.vsix",
    configuration: "",
    language: "Shell · from a cloned repository",
    url: `${repository}/blob/main/docs/VSCODE.md`,
  },
  {
    id: "zed",
    name: "Zed",
    description: "A paired theme for your workspace.",
    instructions:
      "Clone the repository. In Zed’s Extensions page choose “Install Dev Extension” and select the zed/ directory containing extension.toml. Select tines-light or tines-dark in the Theme Selector, or add this to your settings for system appearance.",
    code: '{\n  "theme": {\n    "mode": "system",\n    "light": "tines-light",\n    "dark": "tines-dark"\n  }\n}',
    configuration: "",
    language: "JSON · Zed settings",
    url: `${repository}/blob/main/docs/ZED.md`,
  },
  {
    id: "web",
    name: "Web / CSS",
    description: "The same system, in your own interface.",
    instructions:
      'Download tines.css and load it in your page. Semantic properties follow system appearance. Set data-tines-theme="light" or "dark" on your root element to choose explicitly. Typography is yours to choose.',
    code: '<link rel="stylesheet" href="tines.css">\n<style>\n  body {\n    background: var(--tines-background);\n    color: var(--tines-foreground-primary);\n  }\n</style>',
    configuration: "",
    language: "HTML / CSS",
    url: `${repository}/blob/main/docs/PORTS.md#web-projects`,
  },
] as const;
