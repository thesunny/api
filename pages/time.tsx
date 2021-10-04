import { APIProps, APIResponse } from "~/pages/api/get-time"
import React from "react"
import { Client } from "~/src/client"
import { Web } from "~/src/web"

export const client = Client.create(process.env.NEXT_PUBLIC_API_URL)

export const getServerSideProps = Web.getServerSideProps(async function () {
  const response = await client.call<APIProps, APIResponse>("api/get-time", {
    username: "johndoe",
  })
  return { props: response.data }
})

type Props = Web.Props<typeof getServerSideProps>

export default function Page({ username, serverTime }: Props) {
  return (
    <div>
      Hello World {username}. It's {serverTime}ms since epoch.
    </div>
  )
}
