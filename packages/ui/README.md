# UI

`@medix/ui` is the shared UI package. It contains generic Base UI primitives shared by the apps.

## Run

```bash
npm run typecheck --workspace=packages/ui
npm test --workspace=packages/ui
```

## Structure

```text
src/
  base/          - generic primitives such as Button, Card, Input, Select
  index.ts       - public package exports
  styles.css     - package styles
```

## Layers

Base UI should stay generic. It should not know about patients, journals, or product workflows.

Shared domain components should be added here only when more than one app needs the same concept.

App UI belongs in the app when it is tied to one screen or workflow.

## Notes

Apps should import public UI from `@medix/ui`, not from deep internal paths.
