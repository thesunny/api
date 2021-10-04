import { Client, Web } from "~/src"
import { APIProps, APIResponse } from "~/pages/api/minimal-api"

export const client = Client.create(process.env.NEXT_PUBLIC_API_URL)

export async function getServerSideProps(context: Web.Context) {
  const response = await client.call<APIProps, APIResponse>("api/minimal-api", {
    number: 7,
  })
  return { props: response.data }
}

type Props = Web.Props<typeof getServerSideProps>

export default function Page({ number }: Props) {
  return <div>{number}</div>
}
