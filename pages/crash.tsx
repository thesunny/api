// import { GetTime } from "./api/get-time"
import crash from "./api/crash"
import { Client } from "~/src/client"
import { Server } from "~/src/server"

type Crash = Server.MethodType<typeof crash>

export const getServerSideProps = Client.getServerSideProps(async () => {
  const props = await Client.call<Crash>("crash", {})
  return props
})

export default Client.Page<typeof getServerSideProps>(() => {
  return <div>API call will crash</div>
})
