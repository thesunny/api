import { JSONObject } from "~/lib/json-types"

/**
 * A successful JSend response. Importantly, the data returns must be a
 * JSONObject.
 */
export type JSendSuccess = { status: "success"; data: JSONObject }

/**
 * A structured or predictable fail where we return information about the
 * failure.
 */
export type JSendFail = { status: "fail"; data: JSONObject }

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
 */
export function jsend<T extends JSendObject>(jsendObject: T): T {
  return jsendObject
}
