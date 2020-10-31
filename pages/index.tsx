// import { GetTime } from "./api/get-time"
import getTime from "./api/get-time"
import { Client } from "~/src/client"
import { Server } from "~/src/server"

// type GetTime = Server.MethodType<typeof getTime>

// export const getServerSideProps = Client.getServerSideProps(async () => {
//   const props = await Client.call<GetTime>("get-time", {})
//   return props
// })

export const getServerSideProps = Client.getServerSideProps(
  async ({ call }) => {
    // console.log(Object.keys(context))
    const props = await call<typeof getTime>("get-time", {})
    return props
  }
)

export default Client.Page<typeof getServerSideProps>(
  ({ cookies, serverTime }) => {
    return (
      <div>
        <div>Time on server: {serverTime}</div>
        <div>
          Cookies read from headers sent to server:{" "}
          <pre>{JSON.stringify(cookies, null, 2)}</pre>
        </div>
      </div>
    )
  }
)
