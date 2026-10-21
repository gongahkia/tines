# Helix guide

Tines provides generated `tines-light.toml` and `tines-dark.toml` Helix themes. Both
cover editor UI, syntax, markup, selections, search, diagnostics, and version
control diffs. Diagnostic severity uses labelled gutters plus undercurls; diffs
combine foreground and surface changes.

## Install

Copy both files into the user theme directory:

```sh
mkdir -p ~/.config/helix/themes
cp helix/tines-*.toml ~/.config/helix/themes/
```

On Windows, use `%AppData%\helix\themes`. Then set a theme at the top level of
Helix's `config.toml`:

```toml
theme = "tines-dark"
```

Switch without restarting with `:theme tines-light` or `:theme tines-dark`. Helix
does not combine both appearances in one theme file, so OS-mode automation
belongs in the user's configuration or launcher.

## Remove

Select another theme, then delete `tines-light.toml` and `tines-dark.toml` from the
user theme directory.
