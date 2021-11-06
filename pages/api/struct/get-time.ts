import { jsend, API } from "~/src"
import * as s from "superstruct"
import { dedate } from "~/src/dedate"

const Props = s.object({
  username: s.string(),
})

const getTimeMethod = API.structMethod(Props, async function ({ username }) {
  return jsend({
    status: "success",
    data: dedate({ username, serverTime: new Date() }),
  })
})

export default getTimeMethod
export type GetTimeMethod = typeof getTimeMethod
