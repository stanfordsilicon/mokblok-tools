# Demos (also known as MokBloks)

Demos are small, simulated interface previews that show translations in context. They appear
next to the translation table on the review screen and update immediately as a contributor edits
the target-language values. A demo might show translated month names in a calendar, time
intervals in a schedule, or coordinate patterns on a map.

Each demo is built with SVG so that its layout is predictable in the browser and can be exported
as a PNG for review or sharing.

## How demos fit into the review screen

The main pieces are in `src/widgets/review/demo`:

- `DemosForSection.tsx` selects the demos associated with the current `DataSection`.
- `Demo.tsx` maps each `DemoID` to a React component and places it in the common frame.
- `DemoSVG.tsx` supplies the SVG element, frame, shadow, and draft watermark.
- `demos/` contains the SVG content components. A component can serve one demo or be reused
  with different props by several demo IDs.
- `DownloadDemoButton.tsx` and `downloadSvgAsPng.ts` serialize the rendered SVG and download it
  as a PNG.

Most demo content comes from the same source and target data contexts as the translation table.
As a result, calls to `getTranslation(entry)` reflect the user's current edit, then the imported or
baseline target translation, and finally the source text when no target value exists.

Some demos also use the example date from the settings screen. Prefer `useExampleDate()` over the
current system date so the preview stays reproducible and responds to the user's selected example.

## Layout and export contract

`Demo.tsx` gives every demo a 240 by 240 SVG content area. Write the component as SVG children
that fit within coordinates `0` through `240`; do not add a second root `<svg>` element.
`DemoSVG.tsx` adds 20 pixels to both outer dimensions to leave room for the frame and its offset
shadow, so the SVG element rendered and exported by the current implementation is 260 by 260
pixels.

The download buttons currently export at 3x scale, producing a nominal 780 by 780 PNG. The
filename is `<target-language>_<demo-id>.png`, for example `fr_monthsGrid.png`.

Keep these export constraints in mind:

- Use SVG elements such as `<g>`, `<rect>`, `<path>`, and `<text>`. Groups and `transform` are
  useful for positioning repeated elements.
- Prefer SVG presentation attributes or inline styles for anything that must appear in the PNG.
  Tailwind classes and other page-level CSS can affect the live preview, but the external
  stylesheet is not embedded when the SVG is serialized.
- Click handlers and hover states can make the browser preview interactive, but the exported PNG
  is static.
- Avoid external images when possible. Image export is not currently reliable; vector paths,
  shapes, text, and emoji are safer.
- Leave room for translated strings to expand. Use alignment such as `textAnchor`, shorten fixed
  labels, and test with more than one language.

## Translation text versus interface text

A useful demo emphasizes the values contributors are reviewing. Retrieve those values from the
data contexts rather than copying example strings into the component:

```tsx
const { findDataEntry } = useSourceDataContext();
const { getTranslation } = useTargetDataContext();

const month = findDataEntry({ field: 'M', instance: '1', length: 'w' });

return <text>{getTranslation(month)}</text>;
```

Use `findDataEntries` when a preview needs a collection. Make the query as specific as practical;
`findDataEntry` returns the first match, so a broad query can silently select the wrong value.

Text that belongs to the simulated interface rather than the submitted translation should use
`uitext` from `useInterfaceTranslation()`:

```tsx
const { uitext } = useInterfaceTranslation();

return <text>{uitext('mocks.Weather')}</text>;
```

Add new interface strings under the appropriate namespace in
`public/locales/<interface-language>/common.json`. The English locale is the fallback, but adding
the corresponding strings to each supported locale keeps the surrounding interface consistently
localized.

Keep hard-coded language-dependent text to a minimum. If a word such as “Weather” already exists
as a reviewable data entry, prefer that entry so the contributor can see their own translation in
context. A UI-text fallback is useful when the entry may be absent:

```tsx
getTranslation(findDataEntry({ instance: 'Weather' }), false) || uitext('mocks.Weather');
```

Passing `false` disables `getTranslation`'s normal source-language fallback, allowing the
interface translation to be used instead.

## Adding a demo

1. Create a component in `src/widgets/review/demo/demos`. Return SVG children, usually a fragment,
   and design within the 240 by 240 content area. Reuse an existing generic component when the
   only difference can be expressed with props; `DemoSelector.tsx`, `DemoTimeInterval.tsx`, and
   `DemoMonthlyCalendar.tsx` are examples.
2. Add a unique value to `DemoID.ts`. The value becomes the SVG DOM ID and part of the downloaded
   filename, so do not use spaces or punctuation. Follow the existing convention of starting it
   with the relevant section or subject name.
3. Add the user-facing label to the exhaustive switch in `DemoLabel.ts`. Labels are interface
   text, so compose them from `uitext(...)` values and add any new locale keys.
4. Import the component in `Demo.tsx` and add its `DemoID` case to `DemoImage`. This is also where
   reusable components receive the props that make a particular demo variant.
5. Add the ID to the relevant array in `DemosForSection.tsx`. A demo may be listed under more than
   one section when it illustrates translations from several areas.

The `DemoID` enum and the switches in `DemoLabel` and `DemoImage` are intentionally centralized.
When adding or removing an ID, search for all uses of it so the registry, label, renderer, and
section mapping stay in sync.

## Reviewing the result

Run the app and inspect the demo beside its intended translation section:

```bash
npm run dev
```

Check that:

- editing every translation used by the demo updates it immediately;
- missing translations have an intentional fallback and do not crash the review page;
- the layout works with short and long strings and with the supported writing systems you can
  exercise;
- changing the example date updates date-dependent content;
- the individual download has the expected watermark, layout, resolution, and filename; and
- the demo appears under every intended section and nowhere unintended.

The **Download all demos** button iterates over registered IDs but skips any SVG that is not in the
DOM. It therefore downloads the demos currently rendered for the selected section or page, not
necessarily every demo in the application.

Finally, run the normal checks:

```bash
npm run lint
npm run screenshots:test
```

Demo layout changes may require updated Playwright screenshots. See
[`contributing.md`](./contributing.md#visual-screenshot-tests) for the repository's screenshot
update workflow.
