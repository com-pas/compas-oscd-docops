## CoMPAS Open Plugin

File explorer and opener menu plugin for CoMPAS Open SCD (next)

### Class: `CompasOpenMenuPlugin`

### Superclass:

| Name         | Module | Package     |
| ------------ | ------ | ----------- |
| `LitElement` |        | lit-element |

### Fields

| Name             | Privacy | Type        | Default | Description                                        | Inherited From |
| ---------------- | ------- | ----------- | ------- | -------------------------------------------------- | -------------- |
| `allowLocalFile` |         | `boolean`   | true    | If true, the user can select a local file to open. |                |
| `selectedType`   |         | `string`    |         | The selected SCL type..                            |                |
| `sclTypes`       |         | `Element[]` |         | The list of SCL types.                             |                |
| `items`          |         | `Element[]` |         | The list of SCL documents.                         |                |
| `labels`         |         | `string[]`  |         | The list of available labels.                      |                |
| `selectedLabels` |         | `string[]`  |         | The list of selected labels.                       |                |
| `locale`         |         | `string`    |         | The locale to use for translations.                |                |

### Methods

| Name  | Privacy | Description                     | Parameters | Return    | Inherited From |
| ----- | ------- | ------------------------------- | ---------- | --------- | -------------- |
| `run` |         | Run method to start the plugin. |            | `Promise` |                |

### Exports

| Kind | Name      | Declaration       | Module                    | Package |
| ---- | --------- | ----------------- | ------------------------- | ------- |
| `js` | `default` | CompasOpenElement | src/compas-open-plugin.ts |         |

## Linting and formatting

To scan the project for linting and formatting errors, run

```bash
npm run lint
```

To automatically fix linting and formatting errors, run

```bash
npm run format
```

## Testing with Web Test Runner

To execute a single test run:

```bash
npm run test
```

To run the tests in interactive watch mode run:

```bash
npm run test:watch
```

## Demoing with Storybook

To run a local instance of Storybook for your plugin, run

```bash
npm run storybook
```

To build a production version of Storybook, run

```bash
npm run storybook:build
```

## Local Demo with `web-dev-server`

```bash
npm start
```

To run a local development server that serves the basic demo located in `demo/index.html`

© 2023 Alliander N.V.
