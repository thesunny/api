import { Client, Web } from "~/src"
import { GetTimeMethod } from "~/pages/api/struct/get-time"

if (process.env.NEXT_PUBLIC_API_URL == null)
  throw new Error(`Expected process.env.NEXT_PUBLIC_API_URL to be defined`)

export const client = Client.create(process.env.NEXT_PUBLIC_API_URL)

export const getServerSideProps = Web.getServerSideProps(async (context) => {
  const response = await client.structCall<GetTimeMethod>("api/get-time", {
    username: "johndoe",
  })
  return response.data
})

export default Web.Page<typeof getServerSideProps>(
  ({ username, serverTime }) => {
    return (
      <div>
        Hello World {username}. It's {serverTime}ms since epoch.
      </div>
    )
  }
)
