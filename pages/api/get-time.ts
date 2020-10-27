import { Server } from "~/src/server"
import * as s from "superstruct"

const Props = s.object({})

export default Server.method(Props, async () => {
  return { serverTime: new Date().getTime() }
})
