import { GetTime } from "./api/get-time"
import { Client } from "~/src/client"

export const getServerSideProps = Client.getServerSideProps(async () => {
  const props = await Client.call<GetTime>("get-time", {})
  return { props }
})

export default Client.Page<typeof getServerSideProps>(() => {
  return <div>Hello World</div>
})
