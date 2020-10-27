import crashMethod from "./api/crash"
import { Client } from "~/src/client"

export const getServerSideProps = Client.getServerSideProps(async () => {
  const props = await Client.call<typeof crashMethod>("crash", {})
  return props
})

export default Client.Page<typeof getServerSideProps>(() => {
  return <div>API call will crash</div>
})
