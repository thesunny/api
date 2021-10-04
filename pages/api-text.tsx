import { Client, Web } from "~/src"

const client = Client.create("http://localhost:5000")

export async function getServerSideProps(context: Web.Context) {
  const response = await client.call("api/plain-text", {})
  return { props: {} }
}

type Props = Web.Props<typeof getServerSideProps>

export default function Page(props: Props) {
  return <div>Hello World.</div>
}
