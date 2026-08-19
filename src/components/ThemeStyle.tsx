import { getSiteContent } from "@/lib/cms";

/**
 * Emits the CMS's design-token overrides as CSS custom properties.
 *
 * The Tailwind theme is declared with plain `@theme`, so every utility resolves
 * through `var(--color-…)`; redefining those properties here re-skins the whole
 * site without a rebuild. Tailwind's own values live in `@layer theme`, and an
 * unlayered rule beats any layered one regardless of source order, so this block
 * always wins without needing `!important` or a specificity trick.
 *
 * Only tokens that differ from the compiled default are sent, so on an untouched
 * install this renders nothing at all.
 */

/** Values are validated in the CMS; this is the second gate, at the boundary. */
const SAFE_NAME = /^--[a-zA-Z0-9-]+$/;
const UNSAFE_VALUE = /[;{}<>]|@import|url\s*\(|expression\s*\(|\/\*/i;

function declarations(vars: Record<string, string>): string {
  return Object.entries(vars)
    .filter(([name, value]) => SAFE_NAME.test(name) && value && !UNSAFE_VALUE.test(value) && value.length <= 200)
    .map(([name, value]) => `${name}:${value}`)
    .join(";");
}

export async function ThemeStyle() {
  const { theme, motion } = await getSiteContent();

  // Marquee speeds are CSS animations, so unlike the reveal settings they belong
  // here as custom properties rather than in the motion context.
  const rootVars: Record<string, string> = {
    ...(theme.root ?? {}),
    "--marquee-logos": `${motion.marquee.logos}s`,
    "--marquee-pills": `${motion.marquee.pills}s`,
    "--marquee-team": `${motion.marquee.team}s`,
  };

  const root = declarations(rootVars);
  const dark = declarations(theme.dark ?? {});
  if (!root && !dark) return null;

  const css = [root && `:root{${root}}`, dark && `.dark{${dark}}`].filter(Boolean).join("");
  return <style id="norr3-theme" dangerouslySetInnerHTML={{ __html: css }} />;
}
