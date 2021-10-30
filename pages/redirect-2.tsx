import { Web } from "~/src"

export const getServerSideProps = Web.getServerSideProps(async (context) => {
  return { props: {} }
})

export default Web.Page<typeof getServerSideProps>((props) => {
  return <div>Successfully Redirected to redirect-2</div>
})
