# 09 — Color-Threaded Entities

## When to use
Use in Setup to teach recurring entities, then at Plot Point 2 to reconnect them. It helps readers track who is who across formats.

Hook: repeated recognition rewards memory and makes separate modules feel intentionally connected.

## When NOT to use
Do not use when the story has only one meaningful entity or colour cannot survive accessibility checks.

## Prompt
Build every prose, chart, map, and timeline entity with matching `data-ent`. On hover/focus, light matching elements and dim non-matches. Use `transform-box:fill-box` for SVG marks.

## Implementation
```js
const ENTS = {
  a: { name: 'Northfield', color: 'var(--accent)', val: 86 },
  b: { name: 'Lakeside', color: 'var(--accent2)', val: 54 },
  c: { name: 'Eastgate', color: 'var(--accent3)', val: 31 }
};
const allThreaded = () => $$('[data-ent]');
function litEntity(key) {
  allThreaded().forEach(el => {
    const match = el.dataset.ent === key;
    el.classList.toggle('lit', match);
    el.classList.toggle('dim', !match);
  });
}
function clearEntity() { allThreaded().forEach(el => el.classList.remove('lit', 'dim')); }
allThreaded().forEach(el => {
  el.addEventListener('mouseenter', () => litEntity(el.dataset.ent));
  el.addEventListener('mouseleave', clearEntity);
  el.addEventListener('focus', () => litEntity(el.dataset.ent));
  el.addEventListener('blur', clearEntity);
  if (el.classList.contains('ent')) el.tabIndex = 0;
});
```
```css
.th-el{transform-box:fill-box;transform-origin:center}
```

## Known failure
SVG scaling was wrong until `transform-box:fill-box` made origins local.

## Checklist
- [ ] Beat matches: Setup / Plot Point 2.
- [ ] Reduced motion path exists.
- [ ] Replay resets without stale state.
- [ ] Keyboard/focus state exists.
- [ ] Uses shared tokens where styled.

## See it live
[docs/index.html#m9](../../docs/index.html#m9)
