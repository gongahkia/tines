import palette from "../../palette/palette.json";
import foundation from "../../palette/foundation.json";
export { palette, foundation };
export const inks = [
  ["blue_black", "Blue-black", "blue_ink.primary"],
  ["moss", "Moss", "moss.primary"],
  ["teal", "Teal", "teal.primary"],
  ["burgundy", "Burgundy", "burgundy"],
  ["rust", "Rust", "rust"],
  ["violet", "Violet", "violet"],
  ["amber", "Amber", "amber"],
  ["sepia", "Sepia", "sepia"],
  ["graphite", "Graphite", "graphite"],
] as const;
export type Mode = "light" | "dark";
export type State = { mode: Mode; ink: string; specimen: string };
export function inkColor(mode: Mode, id: string) {
  const path = inks.find((i) => i[0] === id)?.[2] ?? "blue_ink.primary";
  return path
    .split(".")
    .reduce((v: any, k) => v[k], palette.modes[mode]) as string;
}
export function initialState(): State {
  let saved: any = {};
  try {
    saved = JSON.parse(localStorage.getItem("tines-preferences") || "{}") || {};
  } catch {}
  const q = new URLSearchParams(location.search);
  const valid = (v: unknown, values: string[]) =>
    typeof v === "string" && values.includes(v) ? v : undefined;
  return {
    mode: (valid(q.get("mode"), ["light", "dark"]) ??
      valid(saved.mode, ["light", "dark"]) ??
      (matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light")) as Mode,
    ink:
      valid(
        q.get("ink"),
        inks.map((i) => i[0]),
      ) ??
      valid(
        saved.ink,
        inks.map((i) => i[0]),
      ) ??
      "blue_black",
    specimen:
      valid(q.get("specimen"), ["prose", "code", "diff"]) ??
      valid(saved.specimen, ["prose", "code", "diff"]) ??
      "code",
  };
}
