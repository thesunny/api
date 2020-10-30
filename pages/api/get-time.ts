import { Server, s } from "~/src/server"

const Props = s.object({})

export default Server.method(Props, async () => {
  return { serverTime: new Date().getTime() }
})
