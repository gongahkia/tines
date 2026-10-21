# Linux desktop fragments

Tines provides generated light and dark fragments for i3, Waybar, Dunst, and
Zathura. They use only reviewed foundation aliases and do not alter layout,
fonts, key bindings, opacity, or notification behavior.

These ports are **Generated**, not **Verified**. Their syntax and color sources
are checked by `make verify`, but native screenshots and host-specific parsing
remain pending in the [visual acceptance matrix](VISUAL_ACCEPTANCE.md).

## i3

Choose [`i3/tines-light.conf`](../i3/tines-light.conf) or
[`i3/tines-dark.conf`](../i3/tines-dark.conf), then include its absolute path from
your i3 configuration. The fragment defines namespaced variables and client
colors only. Reload i3 and inspect focused, inactive, unfocused, urgent, and
placeholder windows.

## Waybar

Import [`waybar/tines-light.css`](../waybar/tines-light.css) or
[`waybar/tines-dark.css`](../waybar/tines-dark.css) near the start of your Waybar
stylesheet. The fragment colors the bar, workspaces, modes, network failures,
and battery warnings without changing sizing or typography.

## Dunst

Merge [`dunst/tines-light.conf`](../dunst/tines-light.conf) or
[`dunst/tines-dark.conf`](../dunst/tines-dark.conf) into the matching Dunst
configuration. The fragment changes global separators and the three urgency
classes only. Restart Dunst and send low, normal, and critical test
notifications before treating the result as locally verified.

## Zathura

Include or merge [`zathura/tines-light`](../zathura/tines-light) or
[`zathura/tines-dark`](../zathura/tines-dark) in `zathurarc`. The fragment covers
interface, completion, highlight, notification, and document recoloring roles.
Inspect both ordinary and image-heavy PDFs before leaving recoloring enabled.
