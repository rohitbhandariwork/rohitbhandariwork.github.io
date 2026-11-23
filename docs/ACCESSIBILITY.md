# Accessibility — Rohit Builds

## Baseline

The website must remain usable by keyboard, screen reader, switch, touch, and zoom users.

## Requirements

- Use semantic landmarks: `header`, `nav`, `main`, `footer`, `section`, and headings in a logical hierarchy.
- Use real `button` elements for actions and `a` elements for navigation.
- Do not remove or suppress focus indicators.
- Any element with a click handler must be keyboard operable.
- Icon-only controls require an accessible name.
- Decorative icons must be hidden from assistive technology.
- Images need meaningful alternative text or an empty `alt` attribute when purely decorative.
- Form fields must have visible labels and associated error messages.
- Status and error changes must use appropriate live regions when they are not obvious in the visual context.
- Modals and dialogs must trap focus while open, restore focus on close, and support Escape when appropriate.
- Menus must support keyboard navigation and expose an accurate expanded state.
- Animation must respect `prefers-reduced-motion`.
- Do not communicate status by color alone.

## Color and contrast

- Keep body text at WCAG AA contrast or better.
- Verify text over brand gradients and tinted backgrounds.
- Preserve at least 4.5:1 contrast for normal text and 3:1 for large text.
- Do not encode price, success, warning, or error state only with red, green, or amber.

## Responsive behavior

- Support 200% browser zoom without horizontal page overflow.
- Keep interactive targets comfortably tappable on touch devices.
- Preserve content and actions when the topbar becomes a mobile menu.
- Test both narrow portrait and wide desktop layouts.

## Testing checklist

- Complete all primary tasks using only the keyboard.
- Test with a screen reader where available.
- Verify heading order and landmark structure.
- Verify focus order and focus visibility.
- Run automated checks such as `@astrojs/check` and an accessibility browser audit.
- Retest modals, dropdowns, forms, timers, and dynamic content after changes.
