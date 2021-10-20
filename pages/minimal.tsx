import { Web } from "~/src"

export const getServerSideProps = Web.getServerSideProps(async (context) => {
  return { props: {} }
})

export default Web.Page<typeof getServerSideProps>((props) => {
  return <div>Hello</div>
})
