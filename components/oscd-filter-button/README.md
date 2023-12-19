## `src/oscd-filter-button.ts`:

### class: `OscdFilterButton`, `oscd-filter-button`

#### Superclass

| Name               | Module | Package                     |
| ------------------ | ------ | --------------------------- |
| `OscdFilteredList` |        | @openscd/oscd-filtered-list |

#### Fields

| Name       | Privacy | Type      | Default | Description                      | Inherited From |
| ---------- | ------- | --------- | ------- | -------------------------------- | -------------- |
| `header`   |         | `string`  |         | The header of the dialog.        |                |
| `icon`     |         | `string`  |         | The icon of the button.          |                |
| `disabled` |         | `boolean` | `false` | If true, the button is disabled. |                |

#### CSS Properties

| Name                     | Default | Description            |
| ------------------------ | ------- | ---------------------- |
| `--mdc-theme-on-surface` |         | The color of the icon. |

#### Slots

| Name | Description       |
| ---- | ----------------- |
|      | The default slot. |

<details><summary>Private API</summary>

#### Fields

| Name           | Privacy | Type     | Default | Description                             | Inherited From |
| -------------- | ------- | -------- | ------- | --------------------------------------- | -------------- |
| `filterDialog` | private | `Dialog` |         | the dialog element containing the list. |                |

#### Methods

| Name         | Privacy | Description                                                            | Parameters | Return | Inherited From |
| ------------ | ------- | ---------------------------------------------------------------------- | ---------- | ------ | -------------- |
| `toggleList` | private | toggles the dialog containing the list.                                |            | `void` |                |
| `onClosing`  | private | dispatches a "selected-items-changed" event when the dialog is closed. |            | `void` |                |

</details>

<hr/>

### Exports

| Kind | Name               | Declaration      | Module                    | Package |
| ---- | ------------------ | ---------------- | ------------------------- | ------- |
| `js` | `OscdFilterButton` | OscdFilterButton | src/oscd-filter-button.ts |         |

## `src/OscdFilterButton.ts`:

### Exports

| Kind                        | Name                        | Declaration               | Module                     | Package |
| --------------------------- | --------------------------- | ------------------------- | -------------------------- | ------- |
| `custom-element-definition` | `oscd-filter-button`        | OscdFilterButton          | /src/oscd-filter-button.js |         |
| `js`                        | `OscdFilterButton`          | OscdFilterButton          | src/OscdFilterButton.ts    |         |
| `js`                        | `SelectedItemsChangedEvent` | SelectedItemsChangedEvent | src/OscdFilterButton.ts    |         |
