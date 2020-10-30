import { Server, s } from "~/src/server"

const Props = s.object({})

export default Server.method(Props, async () => {
  const a: number = 1
  if (a) {
    throw new Error("Uh oh, it crashed")
  }
  return {}
})
