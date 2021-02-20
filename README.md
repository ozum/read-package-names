# read-package-names

Read package names (including scoped packages) from a directory.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Synopsis](#synopsis)
- [Details](#details)
- [API](#api)
  - [Functions](#functions)
    - [default](#default)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Synopsis

```ts
await readPackageNames("node_modules"); // ["pg-structure", "@babel/runtime", ...]
await readPackageNames("node_modules", { scope: "babel" }); // ["@babel/runtime", "@babel/template", ...]
```

# Details

Reads all package names in a directory by reading all entries in the given directory and all sub entries in directories starting with the "@" sign.

<!-- usage -->

<!-- commands -->

# API

<a name="readmemd"></a>

## Functions

### default

▸ **default**(`cwd`: _string_, `__namedParameters?`: { `scope?`: _string_ }): _Promise_<string[]\>

Reads all package names from a directory.

#### Example

```typescript
await readPackageNames("node_modules"); // ["pg-structure", "@babel/runtime", ...]
await readPackageNames("node_modules", { scope: "babel" }); // ["@babel/runtime", "@babel/template", ...]
```

#### Parameters:

| Name                       | Type     | Description                                  |
| :------------------------- | :------- | :------------------------------------------- |
| `cwd`                      | _string_ | is the directory to read package names from. |
| `__namedParameters`        | _object_ | -                                            |
| `__namedParameters.scope?` | _string_ | is the name of the scope to filter packages. |

**Returns:** _Promise_<string[]\>

the list of package names including scoped packages.

Defined in: [read-package-names.ts:62](https://github.com/ozum/read-package-names/blob/bd13ba0/src/read-package-names.ts#L62)
