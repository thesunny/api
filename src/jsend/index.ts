import { JsonObject } from "type-fest"

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
export async function jsend<T extends JSendObject>(
  arg: T | (() => Promise<T>)
): Promise<T | JSendError> {
  if (typeof arg === "function") {
    try {
      return arg()
    } catch (e) {
      return {
        status: "error",
        message: String(e),
      }
    }
  } else {
    return arg
  }
}
