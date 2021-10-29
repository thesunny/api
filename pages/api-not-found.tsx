import { Client, Web } from "~/src"

if (process.env.NEXT_PUBLIC_API_URL == null)
  throw new Error(`Expected process.env.NEXT_PUBLIC_API_URL to be defined`)

export const client = Client.create(process.env.NEXT_PUBLIC_API_URL)

export const getServerSideProps = Web.getServerSideProps(async function () {
  const props = await client.call("api/invalid-end-point", {})
  return { props }
})

type Props = Web.Props<typeof getServerSideProps>

/**
 * The endpoint will not exist causing a 404 HTML page to be returned.
 *
 * The error shown to the screen should disable the title of the page so it
 * says something like "Error: 404: This page could not be found"
 */
export default function Page(props: Props) {
  return <div>API call will crash</div>
}
