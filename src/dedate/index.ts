import { isPlainObject } from "is-plain-object"

// prettier-ignore
type Dedate<T extends any> =
  T extends Date ? number :
  T extends { [key: string]: any } ? { [key in keyof T]: Dedate<T[key]> } :
  T extends Array<any> ? { [key in keyof T]: Dedate<T[key]> } :
  T

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
