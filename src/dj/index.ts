import {
  JsonArray,
  JsonObject,
  JsonPrimitive,
  JsonValue,
  Simplify,
} from "type-fest"
import { AssertType } from "@thesunny/assert-type"

/**
 * DJ Overview
 *
 * The purpose of the DJ code is to allow us to transport Date data from the
 * server to the Client. This is important because database models often include
 * date data like `createdAt` and `updatedAt` fields.
 *
 * Without it, we end up with many type errors that we have to do work to
 * conver the date types.
 *
 * `dj` supercedes `dedate` which simply took all the Date objects and turned
 * them into `number` of ms since epoch.
 */

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
 * We use `any` here a lot because it doesn't seem to work without
 * type casting and we're confident that `JsonDateToJson` works because of
 * all the accompanying unit tests.
 *
 * We could also case to `JsonDateToJson<T>` but am worried that might run
 * extra code that is completely unnecessary, not helpful and might impact
 * performance.
 */
// export function toJsonValue<T extends DJValue>(value: T): DJToJson<T> {
export function toJsonValue<T>(value: T): DJToJson<T> {
  // ): T extends DJSafe<T> ? DJToJson<DJSafe<T>> : never {
  if (value === null) {
    return value as any
  } else if (value instanceof Date) {
    return {
      $date: value.getTime(),
    } as any
  } else if (Array.isArray(value)) {
    return value.map(toJsonValue) as any
  } else if (typeof value === "object") {
    const obj = {}
    for (const key in value) {
      /**
       * See comments in the `JsonDateToJson` type on why we made this choice
       * to eschew complexity and completeness for speed and simplicity.
       */
      if (key === "$date") throw new Error(`Object with key $date is invalid`)
      // @ts-ignore
      obj[key] = toJsonValue(value[key])
    }
    return obj as any
  } else if (
    ["string", "number", "boolean", "undefined"].includes(typeof value)
  ) {
    return value as any
  } else {
    throw new Error(`Type ${typeof value} is not a valid DJ value`)
  }
}

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

export function fromJsonValue<T extends JsonValue>(value: T): JsonToDJ<T> {
  if (value === null) {
    return value as any
  } else if (Array.isArray(value)) {
    return value.map(fromJsonValue) as any
  } else if (typeof value === "object") {
    if (value.hasOwnProperty("$date")) {
      if (Object.keys.length > 1) {
        throw new Error(
          `If value is object and has $date property, it should have no other properties but is ${JSON.stringify(
            value
          )}`
        )
      }
      /**
       * This doesn't require `as any` except for it throws an Error in
       * Jest with `ts-jest`. `ts-jest` may be using different settings than
       * other `tsconfig` or is using a different version of TypeScript.
       */
      const $date = (value as any)["$date"]
      if (typeof $date !== "number") {
        throw new Error(
          `If value is object and has $date property, the value should be a number but is ${JSON.stringify(
            $date
          )}`
        )
      }
      return new Date($date) as any
    } else {
      const obj = {}
      for (const key in value) {
        // @ts-ignore
        obj[key] = fromJsonValue(value[key])
      }
      return obj as any //{ [key in keyof T]: T[key] }
    }
  } else if (
    ["string", "number", "boolean", "undefined"].includes(typeof value)
  ) {
    return value as any
  } else {
    throw new Error(`Type ${typeof value} is not a valid DJ value`)
  }
}

export const DJ = { toJsonValue, fromJsonValue }

// // prettier-ignore
// export type DJSafe<T> =
//   T extends null ? null :
//   T extends Date ? Date :
//   T extends Function ? never :
//   /**
//    * WARNING:
//    * I can't remember why Arrays just work here. I mean I have no code dealing
//    * with it. I do remember that I had encountered this before but I can't
//    * find any documentation referring to it.
//    *
//    * If I know in the future, make sure I document it here.
//    */
//   T extends { [key: string]: any } ? { [key in keyof T]: DJSafe<T[key]> } :
//   T extends DJPrimitive ? T :
//   never
