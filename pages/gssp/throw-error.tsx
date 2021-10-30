import { dedate, Web } from "~/src"
import Link from "next/link"

export const getServerSideProps = Web.getServerSideProps(async (context) => {
  if (context.query.error) {
    throw new Error("Oh no!")
  }
  return {
    props: {},
  }
})

export default Web.Page<typeof getServerSideProps>(() => {
  return <div>Hello World.</div>
})
