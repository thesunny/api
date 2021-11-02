import { JsonValue } from "type-fest"
import { DJValue, DJToJson, JsonToDJ } from "./types"
export * from "./types"

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
 * We use `any` here a lot because it doesn't seem to work without
 * type casting and we're confident that `JsonDateToJson` works because of
 * the unit tests.
 *
 * We could also case to `JsonDateToJson<T>` but am worried that might run
 * extra code that is completely unnecessary, not helpful and might impact
 * performance.
 */
export function toJsonValue<T extends DJValue>(value: T): DJToJson<T> {
  if (typeof value === "object") {
    if (value === null) {
      /**
       * handle null
       */
      return value as any
    } else if (Array.isArray(value)) {
      /**
       * Map array
       */
      return value.map(toJsonValue) as any
    } else if (value instanceof Date) {
      /**
       * Convert date to `{ $date: number }`
       */
      return {
        $date: value.getTime(),
      } as any
    } else {
      /**
       * Handle objects
       */
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
    }
  } else if (
    /**
     * Do not modify primtives
     */
    ["string", "number", "boolean", "undefined"].includes(typeof value)
  ) {
    return value as any
  } else {
    throw new Error(`Type ${typeof value} is not a valid DJ value`)
  }
}

export function fromJsonValue<T extends JsonValue>(value: T): JsonToDJ<T> {
  if (typeof value === "object") {
    if (value === null) {
      /**
       * handle null
       */
      return value as any
    } else if (Array.isArray(value)) {
      /**
       * Map array
       */
      return value.map(fromJsonValue) as any
    } else if (value.hasOwnProperty("$date")) {
      /**
       * Convert date from `{ $date: number }`
       */
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
      /**
       * Handle objects
       */
      const obj = {}
      for (const key in value) {
        // @ts-ignore
        obj[key] = fromJsonValue(value[key])
      }
      return obj as any //{ [key in keyof T]: T[key] }
    }
  } else if (
    /**
     * Do not modify primtives
     */
    ["string", "number", "boolean", "undefined"].includes(typeof value)
  ) {
    return value as any
  } else {
    throw new Error(`Type ${typeof value} is not a valid DJ value`)
  }
}

export const DJ = { toJsonValue, fromJsonValue }
