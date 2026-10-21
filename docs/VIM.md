# Vim guide

Tines provides generated `tines`, `tines-light`, and `tines-dark` Vim colorschemes in
`vim/colors/`. They cover the built-in interface and syntax groups, spelling,
search, selections, diff surfaces, and Vim terminal ANSI colors.

## Install

Copy the generated files into Vim's user colors directory:

```sh
mkdir -p ~/.vim/colors
cp vim/colors/*.vim ~/.vim/colors/
```

On Windows, use `%USERPROFILE%\vimfiles\colors` instead. To develop directly
from a checkout, add only the repository's `vim/` subdirectory to
`runtimepath`; keeping it separate avoids colliding with Tines's Neovim runtime.

## Select a variant

For the automatic entry point, set Vim's background before loading Tines:

```vim
set termguicolors
set background=dark
colorscheme tines
```

Use `background=light` for the light variant. The explicit entry points ignore
the prior mode and can be loaded directly:

```vim
colorscheme tines-light
colorscheme tines-dark
```

If `background` changes later, run `colorscheme tines` again. Exact Tines colors
require truecolor; `g:terminal_ansi_colors` still supplies the canonical
16-color terminal palette.

## Remove

Delete only `tines.vim`, `tines-light.vim`, and `tines-dark.vim` from the user colors
directory, then select another colorscheme.
