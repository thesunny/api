import { Web } from "~/src"

export async function getServerSideProps(context: Web.Context) {
  // Should show this comment in the error message displayed in the browser
  throw new Error("Error in getServerSideProps")
  return { props: {} }
}

type Props = Web.Props<typeof getServerSideProps>

export default function Page(props: Props) {
  return <div>Hello World.</div>
}
