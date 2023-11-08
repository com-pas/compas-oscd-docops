## `src/compas-scl-list.ts`:

### class: `CompasSclList`, `compas-scl-list`

#### Superclass

| Name         | Module | Package     |
| ------------ | ------ | ----------- |
| `LitElement` |        | lit-element |

#### Fields

| Name        | Privacy | Type     | Default | Description                           | Inherited From |
| ----------- | ------- | -------- | ------- | ------------------------------------- | -------------- |
| `type`      |         | `string` |         | The type of SCL to retrieve.          |                |
| `nameSpace` |         | `string` | `""`    | The namespace of the SCL to retrieve. |                |

#### CSS Properties

| Name                      | Default | Description              |
| ------------------------- | ------- | ------------------------ |
| `--mdc-list-side-padding` |         | The padding of the list. |

<details><summary>Private API</summary>

#### Fields

| Name             | Privacy | Type        | Default | Description                         | Inherited From |
| ---------------- | ------- | ----------- | ------- | ----------------------------------- | -------------- |
| `items`          | private | `Element[]` |         | The list of SCL documents.          |                |
| `labels`         | private | `string[]`  | `[]`    | The list of labels.                 |                |
| `selectedLabels` | private | `string[]`  | `[]`    | The list of selected labels.        |                |
| `filteredItems`  | private | `Element[]` |         | The list of filtered SCL documents. |                |

#### Methods

| Name            | Privacy | Description                                       | Parameters | Return           | Inherited From |
| --------------- | ------- | ------------------------------------------------- | ---------- | ---------------- | -------------- |
| `renderLoading` | private | renders a loading message                         |            | `TemplateResult` |                |
| `renderNoScls`  | private | renders a message when no SCL documents are found |            | `TemplateResult` |                |
| `renderSclList` | private | renders the list of SCL documents                 |            | `TemplateResult` |                |

</details>

<hr/>

### Functions

| Name                  | Description | Parameters      | Return             |
| --------------------- | ----------- | --------------- | ------------------ |
| `newSclSelectedEvent` |             | `docId: string` | `SclSelectedEvent` |

<hr/>

### Exports

| Kind | Name                  | Declaration         | Module                 | Package |
| ---- | --------------------- | ------------------- | ---------------------- | ------- |
| `js` | `newSclSelectedEvent` | newSclSelectedEvent | src/compas-scl-list.ts |         |
| `js` | `CompasSclList`       | CompasSclList       | src/compas-scl-list.ts |         |

## `src/CompasSclList.ts`:

### Exports

| Kind                        | Name               | Declaration      | Module                  | Package |
| --------------------------- | ------------------ | ---------------- | ----------------------- | ------- |
| `custom-element-definition` | `compas-scl-list`  | CompasSclList    | /src/compas-scl-list.js |         |
| `js`                        | `CompasSclList`    | CompasSclList    | src/CompasSclList.ts    |         |
| `js`                        | `SclSelectedEvent` | SclSelectedEvent | src/CompasSclList.ts    |         |
