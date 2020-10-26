import { Server } from "~/src/server"
import * as s from "superstruct"

const Props = s.object({})

const getTime = Server.method(Props, async () => {
  return { serverTime: new Date().getTime() }
})

export default getTime

export type GetTime = Server.MethodType<typeof getTime>
