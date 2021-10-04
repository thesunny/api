import { client } from "~/lib/client"
import { GetServerSideProps, InferGetServerSidePropsType } from "next"

export const getServerSideProps: GetServerSideProps = async function () {
  const props = await client.call("api/invalid-end-point", {})
  return { props }
}

type Props = InferGetServerSidePropsType<typeof getServerSideProps>

/**
 * The endpoint will not exist causing a 404 HTML page to be returned.
 *
 * The error shown to the screen should disable the title of the page so it
 * says something like "Error: 404: This page could not be found"
 */
export default function Page(props: Props) {
  return <div>API call will crash</div>
}
