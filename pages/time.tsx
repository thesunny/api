import { APIProps, APIResponse } from "~/pages/api/get-time"
import { Client, Web } from "~/src"

export const client = Client.create(process.env.NEXT_PUBLIC_API_URL)

export const getServerSideProps = Web.getServerSideProps(async (context) => {
  const response = await client.call<APIProps, APIResponse>("api/get-time", {
    username: "johndoe",
  })
  return { props: response.data }
})

export default function Page({
  username,
  serverTime,
}: Web.Props<typeof getServerSideProps>) {
  return (
    <div>
      Hello World {username}. It's {serverTime}ms since epoch.
    </div>
  )
}
