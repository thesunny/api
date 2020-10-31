import { Server, s } from "~/src/server"

const Props = s.object({})

export default Server.method(Props, async (props, req) => {
  const cookies = req.cookies
  return { serverTime: new Date().getTime(), cookies }
})
