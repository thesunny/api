import { JSONObject } from "~/lib/json-types"

export type JSendObject =
  /**
   * More restrictive than the default `jsend`. `data` MUST be a JSONObject.
   */
  | { status: "success"; data: JSONObject }
  /**
   * A structured or predictable fail where we return information about the
   * failure.
   */
  | { status: "fail"; data: JSONObject }
  /**
   * This shouldn't happen normally.
   */
  | { status: "error"; message: string }

/**
 * Type check the incoming object to make sure it is a `jsend` compatible
 * object. Typcially used like if we have to return a `jsend` object in a
 * functino.
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
