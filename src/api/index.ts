import { NextApiRequest, NextApiResponse } from "next"
import { JsonObject, PromiseValue } from "type-fest"
import { log } from "./log"
import * as s from "superstruct"

let lastId = 0

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
  export type Response<T extends (req: any, res: any) => Promise<JsonObject>> =
    PromiseValue<ReturnType<T>>

  /**
   * Defines a valid API method function to be passed in.
   */
  type Method<Response extends JsonObject> = (
    props: JsonObject,
    req: NextApiRequest,
    res: NextApiResponse
  ) => Promise<Response>

  /**
   * Create a method
   */
  export function method<R extends JsonObject>(fn: Method<R>) {
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
        /**
         * NOTE:
         * The response from this function card is always discarded; however,
         * the type of the response is used. If we don't call return here,
         * then the signature of this function will return the response or
         * `undefined` which is not what we want for the signature.
         *
         * So we fudge this by telling TypeScript, incorrectly, that it will
         * never hit this code.
         *
         * It doesn't affect operation though (since the return value is never
         * used) but it will allow us to easily get the response type for
         * this function.
         *
         * Another way you may be tempted to try is to throw an Error, however,
         * depending on the verison of Next, this may stop the server from
         * functioning at all which is not what we want.
         */
        return null as never
      }
    }
  }

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
}
