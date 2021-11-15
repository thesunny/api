import { NextApiRequest, NextApiResponse } from "next"
import { createMocks } from "node-mocks-http"
import { JsonObject } from "type-fest"

/**
 * Executes a minimal fake method call against the NextJS compatible method
 * and returns a minimal response.
 *
 * A few things to keep in mind:
 *
 * The response can be either `json` or `utf8`. If it's `json`, we get a
 * `json` property and if it's `utf8` we get a `data` property.
 *
 *
 */
export async function call(
  method: (req: NextApiRequest, res: NextApiResponse) => Promise<JsonObject>,
  json: JsonObject
) {
  /**
   * Create mock Request and Response objects
   */
  const { req, res } = createMocks({ method: "POST", body: json })

  await method(req, res)

  const { statusCode, statusMessage } = res
  const isJSON = res._isJSON()

  /**
   * We return a rather verbose `statusCode` and `statusMessage` to remove
   * ambiguity. For example, if we used `message`, that might get confused
   * with the data that we are returning (which is kind of a message).
   *
   * It's just really clear when we say `statusCode` that we are referring to
   * the http `statusCode` as well and not, perhaps, the `status` inside the
   * body of the response.
   */
  const result = isJSON
    ? {
        statusCode,
        json: res._getJSONData(),
      }
    : {
        statusCode,
        data: res._getData(),
      }
  return result
}
