import { createLightTheme, type BrandVariants, type Theme } from "@fluentui/react-components";

// RISE CPA green as a 16-shade Fluent brand ramp, darkest (10) to lightest
// (160). Shade 80 is the primary brand colour, as in Fluent's own ramps.
export const riseBrand: BrandVariants = {
  10: "#0E1407",
  20: "#1A260D",
  30: "#263813",
  40: "#324A19",
  50: "#3F5C1F",
  60: "#4E7027",
  70: "#6A9137",
  80: "#87B04B",
  90: "#95BA5E",
  100: "#A3C471",
  110: "#B1CE84",
  120: "#BFD897",
  130: "#CCE1AB",
  140: "#DAEBBE",
  150: "#E8F4D2",
  160: "#F5FAEC",
};

const baseTheme = createLightTheme(riseBrand);

export const riseLightTheme: Theme = {
  ...baseTheme,
  // next/font sets --font-open-sans in the root layout; the names after it
  // are fallbacks while the font loads.
  fontFamilyBase: "var(--font-open-sans), 'Open Sans', 'Segoe UI', Arial, sans-serif",
  // #87B04B is too light for white text or text on white (about 2.4:1), so
  // filled buttons and brand text use darker shades of the same green.
  colorBrandBackground: riseBrand[60],
  colorBrandBackgroundHover: riseBrand[50],
  colorBrandBackgroundPressed: riseBrand[40],
  colorBrandBackgroundSelected: riseBrand[50],
  colorBrandForeground1: riseBrand[60],
  colorBrandForeground2: riseBrand[50],
  colorBrandForegroundLink: riseBrand[60],
  colorBrandForegroundLinkHover: riseBrand[50],
  colorBrandForegroundLinkPressed: riseBrand[40],
  colorCompoundBrandStroke: riseBrand[60],
  colorCompoundBrandStrokeHover: riseBrand[50],
  colorCompoundBrandStrokePressed: riseBrand[40],
  colorCompoundBrandForeground1: riseBrand[60],
  colorCompoundBrandForeground1Hover: riseBrand[50],
  colorCompoundBrandBackground: riseBrand[60],
  colorCompoundBrandBackgroundHover: riseBrand[50],
};
