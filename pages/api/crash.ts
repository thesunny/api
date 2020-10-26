import { Server } from "~/src/server"
import * as s from "superstruct"

const Props = s.object({})

const crash = Server.method(Props, async () => {
  const a: number = 1
  if (a) {
    throw new Error("Uh oh, it crashed")
  }
  return {}
})

export default crash

export type Crash = Server.MethodType<typeof crash>
