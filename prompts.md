# Prompts Library — myOperator TaskPilot

> Reusable prompts for working with this codebase. Copy-paste into OpenCode (or any AI assistant) to quickly get context-aware help.

---

## 1. Add a new page with myOperator design

```
Create a new page component at src/pages/<PageName>.jsx that follows the myOperator design system.
- Use hash-based routing (window.location.hash)
- Include the full :root CSS token block as an inline string
- Use Tailwind utility classes with CSS custom properties (e.g., bg-[var(--semantic-primary)])
- Font: Source Sans Pro
- Rounded 4px for buttons/inputs, 8px for cards
- Add the route to App.jsx
```

## 2. Build a modal/dialog

```
Add a modal component to <file> for <purpose>.
Requirements:
- z-[9999] for the overlay (host app navbar sits above z-50)
- bg-black/50 backdrop
- Rounded-lg (8px) white card
- Close on backdrop click and Escape key
- Focus trap inside modal
- Use myOperator design tokens (inline css string)
```

## 3. Create a form with validation

```
Build a form in <component> with these fields: <list fields>.
- Tailwind-styled inputs with myOperator tokens
- Real-time or on-submit validation
- Error messages below inputs in red
- Submit button uses --semantic-brand for active state
- Disabled state uses --semantic-disabled-* tokens
- No hardcoded hex values
```

## 4. Style a data table

```
Create/update a data table in <component> using myOperator design system.
- Header row: bg-[var(--semantic-surface)] text-[var(--semantic-text-heading)]
- Rows: border-b border-[var(--semantic-border)]
- Hover state on rows
- Action buttons (edit/delete) with --semantic-brand accent
- Responsive: horizontal scroll on small screens
```

## 5. Add a sidebar / dashboard layout

```
Create a dashboard layout with a sidebar in src/App.jsx or a new layout component.
- Sidebar: fixed left, width ~250px, bg-[var(--semantic-primary)]
- Top nav bar if needed
- Main content area with proper padding
- Sidebar links use --semantic-brand for active/hover
- Collapsible on mobile (hamburger menu)
```

## 6. Fix / refactor a component

```
Refactor <component> to:
- Extract the inline CSS token block into a reusable design-tokens.js if DRY is preferred, OR keep it inline per project convention
- Ensure no hardcoded hex values in Tailwind classes
- Replace arbitrary values with design token variables where possible
- Preserve all existing functionality
```

## 7. Add a loading / empty state

```
Add a loading state and an empty state to <component>.
- Loading: spinner using --semantic-brand color
- Empty: friendly illustration or icon + message text-[var(--semantic-text-muted)]
- Both centered in their containers
```

## 8. Work with the hash router

```
I need to add navigation between pages in this hash-router app.
- Add a link/button that sets window.location.hash = '#<route>'
- Ensure App.jsx route switch handles the new hash
- Pass state via URL query params in the hash if needed (e.g., #page?id=123)
```

## 9. Apply myOperator design tokens to existing HTML/CSS

```
I have this existing markup/CSS: <paste code>
Convert it to use myOperator design tokens and Tailwind utilities.
- Replace all hardcoded colors with CSS custom properties
- Use rounded, rounded-lg correctly
- Ensure Source Sans Pro font
- Follow accessibility guidelines from the design system
```

## 10. Create a reusable button component

```
Create a reusable Button component in src/components/Button.jsx.
Variants:
- Primary: bg-[var(--semantic-primary)] text-white
- Secondary: border border-[var(--semantic-border)] bg-white
- Danger: bg-red-600 text-white
- Ghost: transparent, text-[var(--semantic-text-body)]
States: hover, active, disabled (use --semantic-disabled-*)
Props: variant, size (sm/md/lg), disabled, onClick, children
```

---

## How to use

1. Copy the prompt block you need.
2. Paste it into OpenCode (or any AI chat).
3. Fill in placeholders like `<component>`, `<file>`, `<purpose>`.
4. Send the message.

## Contributing

When you discover a useful prompt pattern during development, append it here with a clear title and example.
