## `src/compas-open.ts`:

### class: `CompasOpenElement`, `compas-open`

#### Superclass

| Name         | Module | Package |
| ------------ | ------ | ------- |
| `LitElement` |        | lit     |

#### Fields

| Name             | Privacy | Type      | Default | Description                                        | Inherited From |
| ---------------- | ------- | --------- | ------- | -------------------------------------------------- | -------------- |
| `allowLocalFile` |         | `boolean` | `true`  | If true, the user can select a local file to open. |                |

#### Slots

| Name       | Description                |
| ---------- | -------------------------- |
| `sclTypes` | The list of SCL types.     |
| `sclList`  | The list of SCL documents. |
|            | The default slot.          |

<details><summary>Private API</summary>

#### Fields

| Name        | Privacy | Type               | Default | Description             | Inherited From |
| ----------- | ------- | ------------------ | ------- | ----------------------- | -------------- |
| `sclFileUI` | private | `HTMLInputElement` |         | the file input element. |                |

#### Methods

| Name               | Privacy | Description                                                       | Parameters                                                                     | Return           | Inherited From |
| ------------------ | ------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------ | ---------------- | -------------- |
| `getSclFile`       | private | parses selected SCL document and triggers a "doc-retrieved" event | `fileObj: {
    isLocal: boolean;
    evt: Event;
    docId?: string;
  }` | `Promise<void>`  |                |
| `renderFileSelect` | private | renders the file selector                                         |                                                                                | `TemplateResult` |                |

</details>

<hr/>

### Functions

| Name                   | Description | Parameters                                                          | Return              |
| ---------------------- | ----------- | ------------------------------------------------------------------- | ------------------- |
| `newDocRetrievedEvent` |             | `localFile: boolean, doc: Document, docName: string, docId: string` | `DocRetrievedEvent` |

<hr/>

### Exports

| Kind | Name                   | Declaration          | Module             | Package |
| ---- | ---------------------- | -------------------- | ------------------ | ------- |
| `js` | `newDocRetrievedEvent` | newDocRetrievedEvent | src/compas-open.ts |         |
| `js` | `CompasOpenElement`    | CompasOpenElement    | src/compas-open.ts |         |

## `src/CompasOpen.ts`:

### Exports

| Kind                        | Name                | Declaration       | Module              | Package |
| --------------------------- | ------------------- | ----------------- | ------------------- | ------- |
| `custom-element-definition` | `compas-open`       | CompasOpenElement | /src/compas-open.js |         |
| `js`                        | `CompasOpenElement` | CompasOpenElement | src/CompasOpen.ts   |         |
| `js`                        | `DocRetrievedEvent` | DocRetrievedEvent | src/CompasOpen.ts   |         |
