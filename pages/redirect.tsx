import { Web } from "~/src"

export const getServerSideProps = Web.getServerSideProps(async (context) => {
  console.log(context.query)
  if (context.query.redirect) {
    throw new Web.Response({
      redirect: {
        destination: "/redirect-2",
        permanent: false,
      },
    })
  }

  return { props: {} }
})

export default Web.Page<typeof getServerSideProps>((props) => {
  return (
    <div>
      No <code>?redirect=true</code> query param so no redirect
    </div>
  )
})
