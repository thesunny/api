import { JsonObject } from "type-fest"
import { DJObject, DJToJson, toJsonValue } from "../dj"

/**
 * A successful JSend response. Importantly, the data returns must be a
 * JsonObject.
 */
export type JSendSuccess = { status: "success"; data: JsonObject }

/**
 * A structured or predictable fail where we return information about the
 * failure.
 */
export type JSendFail = { status: "fail"; data: JsonObject }

/**
 * This shouldn't happen normally.
 */
export type JSendError = { status: "error"; message: string }

/**
 * The merged JSendObject which can be a success, fail or error
 */
export type JSendObject = JSendSuccess | JSendFail | JSendError

/**
 * The main way to use this `jsend` library.
 *
 * Type check the incoming object to make sure it is a `jsend` compatible
 * object.
 *
 * Typically used like this if we have to return a `jsend` object in a
 * function.
 *
 * ```js
 * function getSomething() {
 *   return jsend({ status: 'success', data: { value: 100 } })
 * }
 * ```
 *
 * Alternatively, we can add error checking to a function which will return
 * the error message:
 *
 * ```js
 * function getSomething(status: number) {
 *   return jsend(() => {
 *     if (status == 404) throw new Error("Error")
 *     return { status: 'success', data: { value: 100 } }
 *   })
 * }
 * ```
 */

export function jsend<T extends JSendObject>(value: T): T {
  return value
}

/**
 * djsend related types and method. Same as `jsend` but accepts `Date` objects
 * in the `data` payloads.
 */

export type DJSendSuccess = { status: "success"; data: DJObject }

export type DJSendFail = { status: "fail"; data: DJObject }

export type DJSendError = JSendError

export type DJSendObject = DJSendSuccess | DJSendFail | DJSendError

/**
 * Like jsend but type checks DJ object instead of JSON object
 */
export function djsend<T extends DJSendObject>(value: T) {
  return toJsonValue(value)
}
