import { APIProps, APIResponse } from "~/pages/api/crash"
import { Client, Web } from "~/src"

export const client = Client.create(process.env.NEXT_PUBLIC_API_URL)

export async function getServerSideProps(props: Web.Context) {
  const res = await client.call<APIProps, APIResponse>("api/crash", {
    username: "johndoe",
  })
  return { props: res }
}

type Props = Web.Props<typeof getServerSideProps>

export default function Page(props: Props) {
  console.log(props)
  return <div>API call will crash</div>
}
