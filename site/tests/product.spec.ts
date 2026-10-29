import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
const palette = JSON.parse(
  readFileSync(new URL("../../palette/palette.json", import.meta.url), "utf8"),
);
const inks = [
  ["Blue-black", "blue_ink.primary"],
  ["Moss", "moss.primary"],
  ["Teal", "teal.primary"],
  ["Burgundy", "burgundy"],
  ["Rust", "rust"],
  ["Violet", "violet"],
  ["Amber", "amber"],
  ["Sepia", "sepia"],
  ["Graphite", "graphite"],
];
test("canonical values, modes, specimens, and saved state", async ({
  page,
}) => {
  await page.goto("/?mode=light");
  for (const mode of ["light", "dark"] as const) {
    await page
      .getByRole("button", {
        name: mode === "light" ? "Paper" : "Chalkboard",
        exact: true,
      })
      .click();
    for (const [label, path] of inks) {
      await page
        .locator(".ink-list")
        .getByRole("button", { name: new RegExp(label) })
        .click();
      const value = path
        .split(".")
        .reduce((v: any, k) => v[k], palette.modes[mode]);
      await expect(page.locator(".selected-line>code")).toHaveText(value);
    }
  }
  await page.getByRole("button", { name: "Prose", exact: true }).click();
  await expect(page.locator(".prose")).toContainText("Graphite");
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Chalkboard", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(
    page.getByRole("button", { name: "Prose", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Changes", exact: true }).click();
  await expect(page.locator(".diff")).toContainText("− const");
});
test("URL precedence and malformed preferences are safe", async ({ page }) => {
  await page.addInitScript(() =>
    localStorage.setItem(
      "tines-preferences",
      JSON.stringify({ mode: "dark", ink: "moss", specimen: "diff" }),
    ),
  );
  await page.goto("/?mode=light&ink=teal&specimen=prose");
  await expect(page.locator(".selected-line>code")).toHaveText(
    palette.modes.light.teal.primary,
  );
  await expect(page.locator(".prose")).toBeVisible();
  await page.goto("/?mode=garbage&ink=garbage&specimen=garbage");
  await expect(page.locator(".selected-line>code")).toHaveText(
    palette.modes.dark.moss.primary,
  );
});
test("unavailable storage respects system preference", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => {
      throw Error("denied");
    };
    Storage.prototype.setItem = () => {
      throw Error("denied");
    };
  });
  await page.goto("/?ink=invalid");
  await expect(page.locator(".selected-line>code")).toHaveText(
    palette.modes.dark.blue_ink.primary,
  );
});
test("copy reports success and rejection; shared view is accurate", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: async (value: string) => {
          (window as any).copied = value;
        },
      },
    });
  });
  await page.goto("/?mode=dark&ink=teal&specimen=prose");
  await page
    .getByRole("button", { name: "Copy value", exact: false })
    .first()
    .click();
  await expect(page.locator(".selected-line")).toContainText("Copied");
  expect(await page.evaluate(() => (window as any).copied)).toBe(
    palette.modes.dark.teal.primary,
  );
  await page.getByRole("button", { name: "Copy this view" }).click();
  expect(await page.evaluate(() => (window as any).copied)).toContain(
    "mode=dark&ink=teal&specimen=prose",
  );
  await page.evaluate(() => {
    navigator.clipboard.writeText = async () => {
      throw Error("denied");
    };
  });
  await page
    .getByRole("button", { name: "Copy value", exact: false })
    .first()
    .click();
  await expect(page.locator(".selected-line")).toContainText(
    "Copy unavailable",
  );
});
test("downloads match canonical files byte for byte", async ({ request }) => {
  for (const path of [
    "css/tines.css",
    "css/tines-foundation.css",
    "dist/tines-palette.json",
    "dist/tines-foundation.json",
  ]) {
    const response = await request.get("/downloads/" + path.split("/").pop());
    expect(response.ok()).toBeTruthy();
    expect(await response.body()).toEqual(
      readFileSync(new URL("../../" + path, import.meta.url)),
    );
  }
});
test("keyboard, expanded ramps, and application instructions", async ({
  page,
}) => {
  await page.goto("/?mode=light");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to palette" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await page.locator(".ink-list button").nth(1).focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(".ink-list button").nth(1)).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await page.locator("summary").click();
  await expect(
    page.getByRole("button", { name: "Copy neutral 50", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Zed", exact: false }).click();
  await expect(page.locator(".install-detail")).toContainText(
    "Install Dev Extension",
  );
});
test("WebGL failure and reduced motion keep content usable", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (
      type: any,
      ...args: any[]
    ) {
      if (String(type).includes("webgl")) return null;
      return original.apply(this, [type, ...args] as any);
    } as any;
  });
  await page.goto("/?mode=dark");
  await expect(page.locator(".scene svg")).toBeVisible();
  await page.getByRole("button", { name: "Paper", exact: true }).click();
  await expect(page.locator(".selected-line>code")).toHaveText(
    palette.modes.light.blue_ink.primary,
  );
  expect(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
  ).toBe("auto");
  await page.screenshot({
    path: "../output/product-site/fallback-reduced-motion.png",
    fullPage: true,
  });
});
test("responsive visuals and ordinary browser console", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  for (const width of [1440, 900, 390])
    for (const mode of ["light", "dark"]) {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 });
      await page.goto("/?mode=" + mode);
      await expect(page.locator("canvas")).toBeVisible();
      await page.waitForTimeout(1200);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBeTruthy();
      await page.screenshot({
        path: `../output/product-site/${width === 390 ? "mobile" : width === 900 ? "tablet" : "desktop"}-${mode}.png`,
        fullPage: true,
      });
    }
  expect(errors).toEqual([]);
});
test("malformed saved JSON falls back safely", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.addInitScript(() =>
    localStorage.setItem("tines-preferences", "{broken"),
  );
  await page.goto("/?mode=unknown&ink=unknown&specimen=unknown");
  await expect(page.locator(".selected-line>code")).toHaveText(
    palette.modes.light.blue_ink.primary,
  );
  await expect(
    page.getByRole("button", { name: "Code", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
});

test("all foundation shades stay faithful at narrow widths", async ({
  page,
}) => {
  const foundation = JSON.parse(
    readFileSync(
      new URL("../../palette/foundation.json", import.meta.url),
      "utf8",
    ),
  );
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/?mode=dark");
  await page.locator("summary").click();
  const expected = Object.values(foundation.ramps).flatMap((r: any) =>
    Object.values(r),
  );
  await expect(page.locator(".ramp-values code")).toHaveText(
    expected as string[],
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
  await page.screenshot({
    path: "../output/product-site/narrow-ramps.png",
    fullPage: true,
  });
});
test('ink study follows the story and changes with scroll', async ({page}) => {
  await page.setViewportSize({width: 1440, height: 900});
  await page.goto('/?mode=light');
  const canvas = page.locator('.ink-rail canvas');
  await expect(canvas).toBeVisible();
  const first = await canvas.screenshot();
  const before = await page.locator('.ink-rail').boundingBox();
  await page.evaluate(() => scrollTo(0, (document.documentElement.scrollHeight-innerHeight)*.75));
  await page.waitForTimeout(500);
  const after = await page.locator('.ink-rail').boundingBox();
  const bloom = await canvas.screenshot();
  expect(Math.abs((before?.y ?? 0) - (after?.y ?? 0))).toBeLessThan(150);
  expect(bloom.equals(first)).toBe(false);
  await page.getByRole('button',{name:'Chalkboard',exact:true}).click({force:true});
  await expect(page.locator('html')).toHaveAttribute('data-tines-theme','dark');
});
