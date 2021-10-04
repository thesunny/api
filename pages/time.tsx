import { APIProps, APIResponse } from "~/pages/api/get-time"
import React from "react"
import { client } from "~/lib/client"
import { GetServerSideProps, InferGetServerSidePropsType } from "next"

export const getServerSideProps: GetServerSideProps = async function () {
  const response = await client.call<APIProps, APIResponse>("api/get-time", {
    username: "johndoe",
  })
  return { props: response.data }
}

type Props = InferGetServerSidePropsType<typeof getServerSideProps>

export default function Page({ username, serverTime }: Props) {
  return (
    <div>
      Hello World {username}. It's {serverTime}ms since epoch.
    </div>
  )
}
