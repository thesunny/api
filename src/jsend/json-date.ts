/**
 * Same as JSON from `type-fest` but with dates
 *
 * https://github.com/sindresorhus/type-fest/blob/main/source/basic.d.ts
 */

/**
Matches a JSON object.
This type can be useful to enforce some input to be JSON-compatible or as a super-type to be extended from. Don't use this as a direct return type as the user would have to double-cast it: `jsonObject as unknown as CustomResponse`. Instead, you could extend your CustomResponse type from it to ensure your type only uses JSON-compatible types: `interface CustomResponse extends JsonObject { … }`.
@category Basic
*/
export type JsonDateObject = { [Key in string]?: JsonDateValue }

/**
Matches a JSON array.
@category Basic
*/
export type JsonDateArray = JsonDateValue[]

/**
Matches any valid JSON primitive value.
@category Basic
*/
export type JsonDatePrimitive = string | number | boolean | null | Date

/**
Matches any valid JSON value.
@see `Jsonify` if you need to transform a type to one that is assignable to `JsonValue`.
@category Basic
*/
export type JsonDateValue = JsonDatePrimitive | JsonDateObject | JsonDateArray

// prettier-ignore
export type Dedate<T extends JsonDateValue | undefined> =
  T extends Date ? number :
  T extends JsonDatePrimitive ? T :
  T extends JsonDateObject ? { [key in keyof T]: Dedate<T[key]> } :
  T extends JsonDateArray ? { [key in keyof T]: Dedate<T[key]> } :
  never
