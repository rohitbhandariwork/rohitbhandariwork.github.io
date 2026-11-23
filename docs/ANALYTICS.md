# Analytics and Privacy — Rohit Builds

## Defaults

The current site is a static personal portfolio and should minimize tracking.

- Do not add analytics, pixels, cookies, fingerprinting, or third-party trackers by default.
- Do not collect personally identifiable information unless a page feature explicitly requires it.
- Never transmit form fields, interview prompts, resume data, job data, or timer state to a third-party service without disclosure and explicit implementation approval.
- Prefer local browser storage and client-side state for personal tools.

## External integrations

Any integration must document:

- What data leaves the browser.
- The third-party destination.
- Retention and deletion behavior.
- Whether consent or disclosure is required.
- How errors and opt-out work.

## Analytics events

If analytics is later approved, maintain an explicit event catalog including event name, purpose, fields, allowed values, consent state, and data retention.

Do not infer sensitive traits or use event data for profiling.

## Local storage

Local storage keys must:

- Use clear names.
- Store only necessary app state.
- Avoid secrets and payment details.
- Document invalidation and reset behavior.

## Privacy copy

Public pages must disclose meaningful data collection or third-party communication. A private implementation is not a substitute for visible privacy information.
