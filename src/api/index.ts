import { NextApiRequest, NextApiResponse } from "next"
import { JsonObject, PromiseValue } from "type-fest"
import { log } from "./log"

let lastId = 0

type Method<Response> = (
  props: JsonObject,
  req: NextApiRequest,
  res: NextApiResponse
) => Promise<Response>

export namespace API {
  /**
   * Takes a function created using `createMethod` and extracts the return
   * JSON from it.
   *
   * Note that the method is `export default` which means it creates a standard
   * JSON response for Next.js; however, the `APIResponse` type only works with
   * `createMethod`.
   *
   * This is because `createMethod` explicitly returns the `response` as well
   * so that it can be extracted using this `APIResponse` type.
   */
  export type Response<
    MethodType extends (req: any, res: any) => Promise<JsonObject>
  > = PromiseValue<ReturnType<MethodType>>

  /**
   * Create a method
   */
  export function method<APIResponse>(fn: Method<APIResponse>) {
    return async function (req: NextApiRequest, res: NextApiResponse) {
      /**
       * Keep track of the current `id` so that when we `console.log` details
       * of the execution, we can match the start of the request with the end.
       */
      lastId++
      const id = lastId

      try {
        const startTime = new Date().getTime()
        const props = req.body

        log.request(id, props)

        const response = await fn(props, req, res)

        const diff = new Date().getTime() - startTime
        log.response(id, diff, response)

        res.status(200).json(response)
        /**
         * We don't use the returned response but it is useful
         * to derive the return type of the created `API.method`
         */
        return response
      } catch (e) {
        /**
         * We cast e as type `Error`. We can see from the code above that we
         * don't throw anything of our own and Node should only throw Error
         * types.
         */
        const error = e as Error
        log.error(id, error)
        res.status(500).send(error.stack)
        throw error
      }
    }
  }
}
