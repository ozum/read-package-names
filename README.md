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
await readPackageNames("node_modules", { prefix: "pg" }); // ["pg-structure", "pg-generator", "@user/pg-promise", ...]
await readPackageNames("node_modules", { scope: "user", prefix: "pg" }); // ["@user/pg-promise", ...]
```

# Details

Reads all package names in a directory by reading all entries in the given directory and all sub entries in directories starting with the "@" sign.

<!-- usage -->

<!-- commands -->

# API

<a name="readmemd"></a>

## Functions

### default

▸ **default**(`cwd`: _string_, `options?`: { `prefix?`: _string_ \| _string_[] ; `scope?`: _string_ \| _string_[] ; `silent?`: _boolean_ }): _Promise_<string[]\>

Reads all package names from a directory.

#### Example

```typescript
await readPackageNames("node_modules"); // ["pg-structure", "@babel/runtime", ...]
await readPackageNames("node_modules", { scope: "babel" }); // ["@babel/runtime", "@babel/template", ...]
await readScopedPackageNames("node_modules", { scope: "not-found" }); // []
await readScopedPackageNames("node_modules", { scope: "not-found", silent: false }); // Throws `ENOENT`
await readPackageNames("node_modules", { prefix: "pg" }); // ["pg-structure", "pg-generator", "@user/pg-promise", ...]
```

#### Parameters:

| Name              | Type                   | Description                                                                                                                     |
| :---------------- | :--------------------- | :------------------------------------------------------------------------------------------------------------------------------ |
| `cwd`             | _string_               | is the directory to read package names from.                                                                                    |
| `options`         | _object_               | are options.                                                                                                                    |
| `options.prefix?` | _string_ \| _string_[] | reads only packages beginning with a prefix or one of the prefixes. Prefix is joined with a dash (e.g. "pg" -> "pg-structure"). |
| `options.scope?`  | _string_ \| _string_[] | reads only packages from a scope or one of the scopes.                                                                          |
| `options.silent?` | _boolean_              | prevents errors caused by not-found directories.                                                                                |

**Returns:** _Promise_<string[]\>

the list of package names including scoped packages.

Defined in: [read-package-names.ts:95](https://github.com/ozum/read-package-names/blob/f33d5dd/src/read-package-names.ts#L95)
