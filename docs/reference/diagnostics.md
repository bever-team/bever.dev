# Diagnostics

`bever check`, `bever compile`, `bever dev`, and the VS Code extension report problems as:

```text
bev/app.bev:12:5: error BEV3032: Unknown type 'Currency'. Use Text, Boolean, Int, ...
```

Errors stop compilation; warnings do not. Messages below show placeholders such as `{name}` where the actual message names your entity, field, or value.


## Syntax

| Code | Severity | Message |
| --- | --- | --- |
| `BEV0001` | Error | Entity name is required. |
| `BEV0002` | Error | Indented member is not inside a declaration. |
| `BEV0003` | Error | Unknown declaration '{keyword}'. Expected Import, Entity, Identity, Role, or Action. For planned keywords: '{keyword}' is not supported yet. |
| `BEV0004` | Error | Unknown entity member '{keyword}'. Expected Field, Rule, or Present. For planned keywords such as State or Computed: '{keyword}' is not supported yet. |
| `BEV0005` | Error | Field name is required. |
| `BEV0006` | Error | Field '{name}' requires a type. |
| `BEV0009` | Error | Unknown action member '{keyword}'. Expected By, OrderBy, or SearchBy. For planned keywords such as Rule (rules on actions): '{keyword}' is not supported yet. |
| `BEV0010` | Error | Present does not accept arguments. |
| `BEV0012` | Error | Use spaces, not tabs, for indentation. |
| `BEV0013` | Error | Import takes entity names and a quoted .bev path, for example 'Import Customer, Product From "sales.bev"'. |
| `BEV0014` | Error | Only entities can be exported: 'Export Entity &lt;Name&gt;'. |

## Entities and fields

| Code | Severity | Message |
| --- | --- | --- |
| `BEV1001` | Error | Duplicate entity '{entity}'. |
| `BEV1003` | Error | Entity name 'Identity' is reserved for the built-in identity target. |
| `BEV1004` | Error | Entity name '{entity}' must start with a letter and contain only letters and digits. |
| `BEV1005` | Error | Entities '{existing}' and '{entity}' would share the HTTP route '/{route}'. Rename one of them. |
| `BEV1010` | Error | Field name '{field}' must start with a letter and contain only letters and digits. |
| `BEV1011` | Error | '{field}' is a system field that every entity already has. Choose another name. |
| `BEV1012` | Error | Duplicate field '{field}' on entity '{entity}'. |

## Exports and imports

| Code | Severity | Message |
| --- | --- | --- |
| `BEV1020` | Error | Import path '{path}' does not name a .bev file of this model. |
| `BEV1021` | Error | '{path}' declares no entity '{entity}'. Or, for an entity without `Export`: '{entity}' is not exported. Declare it as 'Export Entity {entity}' in '{path}'. |
| `BEV1022` | Error | '{entity}' is already declared or imported in this file. |
| `BEV1023` | Error | Entity '{entity}' is declared in '{file}'. Export it there and add 'Import {entity} From "{path}"' to use it here. |

## Actions

| Code | Severity | Message |
| --- | --- | --- |
| `BEV2001` | Error | Action requires a verb and entity. |
| `BEV2002` | Error | Action references unknown entity '{entity}'. |
| `BEV2003` | Error | Unsupported action verb '{verb}'. |
| `BEV2004` | Error | Duplicate action '{verb} {entity}'. |
| `BEV2005` | Error | Identity is a reserved system target and does not support ordinary actions. |
| `BEV2006` | Error | 'As &lt;Name&gt;' names a picker: it is valid only as 'Action Pick &lt;Entity&gt; As &lt;Name&gt;' with an identifier name. |
| `BEV2007` | Error | Action '{verbs} {entity}' must say who may perform it, for example 'By Authenticated'. |

## Types, relationships, and rules

| Code | Severity | Message |
| --- | --- | --- |
| `BEV3000` | Error | Relationship target 'Identity' requires a top-level Identity declaration. |
| `BEV3001` | Error | Relationship target '{target}' is not a declared entity. |
| `BEV3003` | Error | Unsupported field type syntax '{text}'. |
| `BEV3004` | Error | Text length must be a positive integer, for example Text(200). |
| `BEV3005` | Error | Conditional rules ('By ... Where ...') are not supported yet. See https://bever.dev/roadmap. |
| `BEV3006` | Error | 'By' needs a subject: Anyone, Authenticated, a role, or a field. |
| `BEV3007` | Error | OrderBy requires a field and an optional Asc or Desc direction, for example 'OrderBy DueDate Desc'. |
| `BEV3008` | Error | OrderBy direction must be Asc or Desc. |
| `BEV3010` | Error | Field paths have no leading '/'. Write '{field}' instead of '/{field}'. |
| `BEV3012` | Error | OnDelete behavior must be Restrict, Cascade, or SetNull, not '{onDelete}'. |
| `BEV3013` | Error | OnDelete SetNull requires a nullable relationship. |
| `BEV3014` | Error | SearchBy is valid only under Action Read or Action Pick. |
| `BEV3015` | Error | SearchBy needs at least one field, for example 'SearchBy Name'. |
| `BEV3017` | Error | SearchBy references unknown field '{field}' on entity '{entity}'. |
| `BEV3018` | Error | Duplicate SearchBy declaration. |
| `BEV3019` | Error | SearchBy field '{field}' does not have a supported searchable type. |
| `BEV3020` | Error | 'By {field}' needs '{field}' to reference Identity, for example 'Field {field} -&gt; Identity', and a top-level Identity block. |
| `BEV3021` | Error | 'By {text}' names no role or field. Use 'By Anyone', 'By Authenticated', 'By &lt;Role&gt;' with a declared 'Role {text}', or 'By &lt;Field&gt;' with a field that references Identity. |
| `BEV3022` | Error | Relationship target 'Identity' cannot be mixed with application targets. |
| `BEV3024` | Error | Relationship clauses are 'OnDelete &lt;Behavior&gt;' and 'Pick &lt;Picker&gt;', each at most once. |
| `BEV3025` | Error | SearchBy under 'Action Read {Entity}' is unused because 'Action Pick {Entity}' decides picking; move SearchBy there. |
| `BEV3026` | Error | '{entity}.{field}' targets '{target}', which declares no Pick or Read, so no one can select it. Add 'Action Pick {target}' or remove '{field}' from Creating and Editing. |
| `BEV3027` | Error | '{entity}' has no field that can label its records, so it cannot be a relationship target. Add a Text field or 'Present RecordLabel'. |
| `BEV3028` | Warning | Creators may not see what they create: 'Read {Entity}' only shows records by {owner}, but 'Create {Entity}' lets them set {owner} to someone else. Use 'Action Create {Entity} By {owner}' to only allow creating records you own. |
| `BEV3023` | Error | OrderBy is not valid under Action Pick; picker order is fixed by label. |
| `BEV3029` | Error | OrderBy is valid only under Action Read. |
| `BEV3030` | Error | Duplicate OrderBy declaration. |
| `BEV3031` | Error | Type '{head}' is not supported yet. Also reported for paths through relationships such as 'Owner/Team'. See https://bever.dev/roadmap. |
| `BEV3032` | Error | Unknown type '{name}'. Use Text, Boolean, Int, Decimal, Money, Date, DateTime, Time, Email, Phone, Url, Enum(...), or '-&gt; Entity'. |
| `BEV3033` | Error | Type '{name}' does not take arguments. |
| `BEV3034` | Error | Default value for '{field}' must be {expected}, or is longer than the field allows. Relationships cannot have defaults. |
| `BEV3035` | Error | Enum option '{option}' must be a name that starts with a letter, for example Enum(Low, Medium, High). |
| `BEV3036` | Error | 'By {name}' is ambiguous: '{name}' is both a field of '{entity}' and a role. Rename one of them. |

## Presentation

| Code | Severity | Message |
| --- | --- | --- |
| `BEV4001` | Error | A problem inside a `Present` block: an unknown member, a duplicate, an invalid value, or a field that does not belong to the entity. The message names the exact problem. |

## Identity

| Code | Severity | Message |
| --- | --- | --- |
| `BEV5001` | Error | Duplicate Identity declaration. |
| `BEV5002` | Error | Duplicate Identity Registration declaration. |
| `BEV5003` | Error | Duplicate Identity Summary declaration. |
| `BEV5004` | Error | Unsupported Identity member '{Text}'. |
| `BEV5005` | Error | Generic Enable syntax is not supported. Use top-level 'Identity' to enable Bever identity. |
| `BEV5006` | Error | Identity declaration does not accept inline arguments. Use top-level 'Identity' with indented members. |
| `BEV5007` | Error | Role '{role}' requires a top-level Identity declaration. |
| `BEV5008` | Error | Duplicate role '{role}'. |
| `BEV5009` | Error | Role name '{role}' must start with a letter and contain only letters and digits. Also: Role needs a name, for example 'Role Agent'; '{role}' is reserved and cannot be a role name (Anyone, Authenticated, Administrator, Identity). |
| `BEV5010` | Error | Roles have no members: '{keyword}' is not supported yet. See https://bever.dev/roadmap for planned language features. |

## Validation rules

| Code | Severity | Message |
| --- | --- | --- |
| `BEV6001` | Error | A problem in a `Rule`: a missing condition or message, an unknown field, a value that does not fit its field, a comparison the field's type does not support (such as `<` on text, or a relationship compared with anything but `Null`), fields of different types, or invalid syntax. The message names the exact problem. Field paths with a leading `/` or through relationships report `BEV3010` and `BEV3031`. |
