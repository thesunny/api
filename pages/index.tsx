import getTime from "./api/get-time"
import { Client } from "~/src/client"

export const getServerSideProps = Client.getServerSideProps(async (context) => {
  const props = await Client.call<typeof getTime>("get-time", {}, context)
  return props
})

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
