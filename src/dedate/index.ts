import { isPlainObject } from "is-plain-object"

/**
 * RECOMMEND:
 * Do not delete. This method is superceded by the `DJ` code which in most
 * cases should convert a `Date` into `JSON` and back again; however, there
 * may be cases like when we're testing that we just won't to get some clean
 * JSON before sending it through the Internet.
 *
 * This may be for testing or for the rare occasion when we might want to send
 * a Date from the client to the server.
 */

// prettier-ignore
type Dedate<T extends any> =
  T extends Date ? number :
  T extends { [key: string]: any } ? { [key in keyof T]: Dedate<T[key]> } :
  T extends Array<any> ? { [key in keyof T]: Dedate<T[key]> } :
  T

/**
 * Convert Date into number within complex objects.
 *
 * Takes any value and if there are any Date objects in it, will return the
 * date as a number representing the ms since epoch.
 *
 * IMPORTANT:
 * It won't traverse into all objects. Only plain objects as defined by the
 * `is-plain-object` library.
 */
export function dedate<T extends any>(value: T): Dedate<T> {
  if (Array.isArray(value)) {
    return value.map(dedate) as Dedate<T>
  } else if (isPlainObject(value)) {
    const o = {} as Dedate<T>
    for (const key in value) {
      // @ts-ignore
      o[key] = dedate(value[key])
    }
    return o
  } else if (value instanceof Date) {
    return value.getTime() as Dedate<T>
  } else {
    return value as Dedate<T>
  }
}
