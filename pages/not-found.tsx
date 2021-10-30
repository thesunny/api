import { Web } from "~/src"

export const getServerSideProps = Web.getServerSideProps(async (context) => {
  console.log(context.query)
  if (context.query.notFound) {
    throw new Web.Response({
      notFound: true,
    })
  }
  return { props: {} }
})

export default Web.Page<typeof getServerSideProps>((props) => {
  return (
    <div>
      No <code>?notFound=true</code> query param so we did not return a 404
      notFound
    </div>
  )
})
