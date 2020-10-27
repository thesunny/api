// import { GetTime } from "./api/get-time"
import getTime from "./api/get-time"
import { Client } from "~/src/client"
import { Server } from "~/src/server"

// type GetTime = Server.MethodType<typeof getTime>

// export const getServerSideProps = Client.getServerSideProps(async () => {
//   const props = await Client.call<GetTime>("get-time", {})
//   return props
// })


export const getServerSideProps = Client.getServerSideProps(async () => {
  const props = await Client.call<typeof getTime>("get-time", {})
  return props
})

export default Client.Page<typeof getServerSideProps>(({ serverTime }) => {
  return <div>Hello World {serverTime}</div>
})
