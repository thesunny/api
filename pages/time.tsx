import { APIProps, APIResponse } from "~/pages/api/get-time"
import { Client, Web } from "~/src"

if (process.env.NEXT_PUBLIC_API_URL == null)
  throw new Error(`Expected process.env.NEXT_PUBLIC_API_URL to be defined`)

export const client = Client.create(process.env.NEXT_PUBLIC_API_URL)

export const getServerSideProps = Web.getServerSideProps(async (context) => {
  const response = await client.call<APIProps, APIResponse>("api/get-time", {
    username: "johndoe",
  })
  return response.data
})

// export default function Page({
//   username,
//   serverTime,
// }: Web.Props<typeof getServerSideProps>) {
//   return (
//     <div>
//       Hello World {username}. It's {serverTime}ms since epoch.
//     </div>
//   )
// }

export default Web.Page<typeof getServerSideProps>(
  ({ username, serverTime }) => {
    return (
      <div>
        Hello World {username}. It's {serverTime}ms since epoch.
      </div>
    )
  }
)
