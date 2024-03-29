import { Client, Web } from "~/src"
import { APIProps, APIResponse } from "~/pages/api/minimal-api"

if (process.env.NEXT_PUBLIC_API_URL == null)
  throw new Error(`Expected process.env.NEXT_PUBLIC_API_URL to be defined`)

export const client = Client.create(process.env.NEXT_PUBLIC_API_URL)

export const getServerSideProps = Web.getServerSideProps(async (context) => {
  const response = await client.call<APIProps, APIResponse>("api/minimal-api", {
    number: 7,
  })
  return response.data
})

export default function Page({ number }: Web.Props<typeof getServerSideProps>) {
  return <div>{number}</div>
}
