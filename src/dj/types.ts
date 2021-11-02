import { JsonArray, JsonObject, JsonPrimitive, JsonValue } from "type-fest"

/**
 * All the `DJ` value types match the design of the `type-fest` `JSON` value
 * types to reduce confusion except for the added `Date` in `DJPrimitive`.
 */

/**
 * Matches a DJ object.
 *
 * The declaration `[Key in string]` is different from `[Key: string]` in
 * subtle and hard to understand ways:
 *
 * https://stackoverflow.com/questions/56960841/are-the-types-key-in-string-boolean-and-key-string-boolean
 */
export type DJObject = { [Key in string]?: DJValue }

/**
 * Matches a DJ array.
 */
export type DJArray = Array<DJValue>

/**
 * Matches any valid DJ primitive value.
 */
export type DJPrimitive = string | number | boolean | null | Date

/**
 * Matches any valid DJ value.
 */
export type DJValue = DJPrimitive | DJObject | DJArray

/**
 * We need to add `undefined` because JsonDateObject has optional keys which
 * means `undefined` can be fed in during a recursive loop.
 *
 * It is defined this way to match the definition in `type-fest` which also
 * uses optional properties.
 */
// prettier-ignore
export type DJToJson<T extends DJValue | undefined> =
  /**
   * This needs to be here before `T extends Date` because `null extends Date`
   * is true and hence a `null` will be turned into `{ $date: number}`
   */
  T extends null ? null :
  /**
   * To avoid confusion, we just don't allow `$date` to be encoded to JSON.
   * In Meteor's EJSON specification, we can do { $escape: { $date: T } } but
   * there are some edge cases like what if it includes other fields that
   * then include dates.
   * 
   * In the end, it seems like it's not worth the complexity to the code
   * because I can't think of a good use case for our app where we'd want to do
   * it.
   * 
   * If we ever wanted to release this, then we can fix it.
   */
  T extends { $date: any } ? never :
  /**
   * Convert `Date` to `{ $date: number }` like in EJSON specification.
   */
  T extends Date ? { $date: number } :
  T extends DJPrimitive ? T :
  T extends DJArray ? Array<DJToJson<T[number]>> :
  T extends Function ? T :
  T extends object ? { [key in keyof T]: DJToJson<T[key]> } :
  T

/**
 * We need undefined in there best the `ts-fest` definition of JsonValue
 * includes an Object with properties that are optional (i.e. `?`) and that
 * means that `undefined` gets fed back in on a loop.
 */
// prettier-ignore
export type JsonToDJ<T extends JsonValue | undefined> =
  T extends null ? null :
  T extends undefined ? undefined :
  T extends JsonArray ? Array<JsonToDJ<T[number]>> :
  T extends { $date: number } ? Date :
  T extends JsonObject ? { [key in keyof T]: JsonToDJ<T[key]> } :
  T extends JsonPrimitive ? T : 
  never
