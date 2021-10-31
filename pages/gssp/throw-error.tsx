import { dedate, Web } from "~/src"
import Link from "next/link"

export const getServerSideProps = Web.getServerSideProps(async (context) => {
  if (context.query.error) {
    // This comment should be seen on the browser page `3t6cF`.
    throw new Error(
      "This error should show the comment above `3t6cf` in the browser when it throws!"
    )
  }
  return {
    props: {},
  }
})

export default Web.Page<typeof getServerSideProps>(() => {
  return <div>Hello World.</div>
})
