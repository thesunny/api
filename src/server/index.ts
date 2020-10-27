import { NextApiRequest, NextApiResponse } from "next"
import { assert, coerce, number, Struct } from "superstruct"
import { JSONObject } from "~/lib/json-types"
import { Unpromise } from "~/lib/ts-utils"
import { log } from "./log"
import { ServerMethod } from "../types"

let lastId = 0

export namespace Server {
  /**
   * Simplify the creation of an API handler or endpoint.
   *
   * Just return the value and it will be encoded as JSON automatically.
   *
   * Additionally, you can use `MethodResponse` to deriver the return type
   * back to the `call` in the browser.
   *
   * @param getResponse
   */
  export function method<P, RT extends JSONObject>(
    struct: Struct<P>,
    getResponse: (
      props: P,
      req: NextApiRequest,
      res: NextApiResponse
    ) => Promise<RT>
  ) {
    return async function (
      req: NextApiRequest,
      res: NextApiResponse
    ): Promise<{ props: P; response: RT }> {
      lastId++
      const id = lastId
      try {
        const startTime = new Date().getTime()
        const props = coerce(req.body, struct)

        log.request(id, props)

        const response = await getResponse(props, req, res)

        const diff = new Date().getTime() - startTime
        log.response(id, diff, response)

        res.status(200).json(response)
        /**
         * We don't use the returned response but it is useful
         * to derive the return type of the created `API.method`
         */
        return { props, response }
      } catch (error) {
        log.error(id, error)
        res.status(500).send(error.stack)
        throw error
      }
    }
  }

  /**
   * Takes a NextApiRequest object and validates it against a SuperStruct.
   * The returned value is guaranteed to match the SuperStruct and additionally
   * the TypeScript types are added to the return value.
   *
   * @param req
   * @param struct
   */
  export function props<P>(req: NextApiRequest, struct: Struct<P>): P {
    const props = req.body
    assert(props, struct)
    return props
  }

  /**
   * Takes a handler returned by `Server.method` and gets the TypeScript
   * type for the response.
   */
  export type MethodType<T extends ServerMethod> = Unpromise<ReturnType<T>>
}
