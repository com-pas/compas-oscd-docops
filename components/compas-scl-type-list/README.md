## `src/compas-scl-type-list.ts`:

### class: `CompasSclTypeList`, `compas-scl-type-list`

#### Superclass

| Name         | Module | Package     |
| ------------ | ------ | ----------- |
| `LitElement` |        | lit-element |

#### Fields

| Name        | Privacy | Type        | Default | Description                     | Inherited From |
| ----------- | ------- | ----------- | ------- | ------------------------------- | -------------- |
| `sclTypes`  |         | `Element[]` |         | The list of SCL types.          |                |
| `nameSpace` |         | `string`    | `""`    | The namespace of the SCL types. |                |

<details><summary>Private API</summary>

#### Methods

| Name            | Privacy | Description                               | Parameters | Return           | Inherited From |
| --------------- | ------- | ----------------------------------------- | ---------- | ---------------- | -------------- |
| `renderLoading` | private | renders a loading message                 |            | `TemplateResult` |                |
| `renderNoTypes` | private | renders a message when no types are found |            | `TemplateResult` |                |
| `renderTypes`   | private | renders the list of types                 |            | `TemplateResult` |                |

</details>

<hr/>

### Functions

| Name                   | Description | Parameters     | Return              |
| ---------------------- | ----------- | -------------- | ------------------- |
| `newTypeSelectedEvent` |             | `type: string` | `TypeSelectedEvent` |

<hr/>

### Exports

| Kind | Name                   | Declaration          | Module                      | Package |
| ---- | ---------------------- | -------------------- | --------------------------- | ------- |
| `js` | `newTypeSelectedEvent` | newTypeSelectedEvent | src/compas-scl-type-list.ts |         |
| `js` | `CompasSclTypeList`    | CompasSclTypeList    | src/compas-scl-type-list.ts |         |

## `src/CompasSclTypeList.ts`:

### Exports

| Kind                        | Name                  | Declaration       | Module                       | Package |
| --------------------------- | --------------------- | ----------------- | ---------------------------- | ------- |
| `custom-element-definition` | `compas-scltype-list` | CompasSclTypeList | /src/compas-scl-type-list.js |         |
| `js`                        | `CompasSclTypeList`   | CompasSclTypeList | src/CompasSclTypeList.ts     |         |
| `js`                        | `TypeSelectedEvent`   | TypeSelectedEvent | src/CompasSclTypeList.ts     |         |
