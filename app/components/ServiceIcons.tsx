/**
 * Line icons for the eight services, index-aligned with `serviceData` in the
 * dictionaries and with SERVICE_IMAGES in site-data.ts. Keep the order in sync
 * when adding a service.
 *
 * Inline SVG rather than an icon font, an emoji, or a sprite: these inherit
 * `currentColor` so they pick up the brand green for free, they add no network
 * request, and they stay sharp at any density. Emoji were considered and
 * rejected — they render differently on every platform and read informal
 * against an industrial B2B tone.
 *
 * Drawn on a 24x24 grid with a 1.6 stroke so they hold up at the 26px they are
 * actually displayed at. Decorative only, so every consumer marks them
 * aria-hidden and the meaning stays in the adjacent heading.
 */

const PATHS: string[][] = [
  // 01 Procurement Services — clipboard with checked lines
  ["M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1", "M5.5 4h13v17h-13z", "M9 11h6", "M9 15h4"],
  // 02 Logistics — freight truck
  ["M2.5 6.5h10v10h-10z", "M12.5 10h4l4.5 3.5v3h-8.5", "M6 20a1.9 1.9 0 1 0 0-3.8 1.9 1.9 0 0 0 0 3.8", "M17 20a1.9 1.9 0 1 0 0-3.8 1.9 1.9 0 0 0 0 3.8"],
  // 03 Bolt Torquing & Tensioning — hex nut
  ["M12 2.5l8 4.5v9l-8 4.5-8-4.5v-9z", "M12 8.6a3.4 3.4 0 1 0 0 6.8 3.4 3.4 0 0 0 0-6.8"],
  // 04 Equipment Rental — crate plus a time dial, i.e. plant for a period.
  // The two shapes are kept clear of each other: overlapping them turned the
  // crate into mush at 26px.
  ["M2.5 12h11v8h-11z", "M2.5 15.3h11", "M18 2.5a4 4 0 1 1 0 8 4 4 0 0 1 0-8", "M18 4.6v2.2l1.6 1"],
  // 05 Labour Supply — a crew, not one worker
  ["M9 4.6a3 3 0 1 1 0 6 3 3 0 0 1 0-6", "M2.6 20.5a6.4 6.4 0 0 1 12.8 0", "M17.4 7.4a2.3 2.3 0 1 1 0 4.6 2.3 2.3 0 0 1 0-4.6", "M16.4 14.6a5 5 0 0 1 5 4.9"],
  // 06 Electric Motor Services — motor body with an output shaft. The shaft is
  // what stops this reading as a generic power symbol.
  ["M11 4.8a7.2 7.2 0 1 1 0 14.4 7.2 7.2 0 0 1 0-14.4", "M11.9 8.4l-2.9 4.7h2.3l-.9 3.3 3-4.8h-2.3z", "M18.2 12h3"],
  // 07 Valve Services — inline valve with handwheel
  ["M12 10.2a3.9 3.9 0 1 1 0 7.8 3.9 3.9 0 0 1 0-7.8", "M2.8 14.1h5.3", "M15.9 14.1h5.3", "M12 10.2V5.6", "M8.6 5.6h6.8"],
  // 08 Piping Manufacturing — flanged elbow
  ["M3.5 7.5h6.2a5.5 5.5 0 0 1 5.5 5.5v7.5", "M3.5 4.9v5.2", "M12.6 20.5h5.8"],
];

export function ServiceIcon({ index }: { index: number }) {
  const paths = PATHS[index];
  if (!paths) return null;

  return (
    <svg
      className="service-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {paths.map((d) => <path key={d} d={d} />)}
    </svg>
  );
}
