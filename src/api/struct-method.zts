import { API } from "../index"
import { NextApiRequest, NextApiResponse } from "next"
import * as s from "superstruct"
import { JsonObject } from "type-fest"
import { PromiseValue } from "type-fest"

/**
 * Like `API.method` but takes a superstruct `Struct` as its first argument
 * and makes sure that the passed in props are validated against the `Struct`.
 *
 * It also returns a `type` that includes `_Props` and `_Response` which can
 * be used in `client.structCall`
 */

export function structMethod<S extends s.Struct<any>, R extends JsonObject>(
  struct: S,
  fn: (
    props: s.Infer<S>,
    req: NextApiRequest,
    res: NextApiResponse
  ) => Promise<R>
) {
  const method = API.method(async (jsonProps, req, res) => {
    const props = struct.create(jsonProps)
    return await fn(props, req, res)
  })
  return method as typeof method & {
    _Props: s.Infer<S>
    _Response: PromiseValue<ReturnType<typeof method>>
  }
}

// const Props = s.object({
//   name: s.string(),
//   age: s.number(),
// })

// const method = structMethod(Props, async (props) => {
//   return { name: "john", age: 28 }
// })

// type X = typeof method["_Props"]
// type Y = typeof method["_Response"]
