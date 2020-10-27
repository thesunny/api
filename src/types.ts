import { NextApiRequest, NextApiResponse } from "next"
import { Unpromise } from "~/lib/ts-utils"

export type ServerMethod = (
  req: NextApiRequest,
  res: NextApiResponse
) => Promise<any>

/**
 * Takes a handler returned by `Server.method` and gets the TypeScript
 * type for the response.
 */
export type MethodType<
  T extends ServerMethod
  // T extends (req: NextApiRequest, res: NextApiResponse) => Promise<any>
> = Unpromise<ReturnType<T>>
