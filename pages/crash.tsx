import { APIProps, APIResponse } from "~/pages/api/crash"
import { client } from "~/lib/client"
import { GetServerSideProps, InferGetServerSidePropsType } from "next"

export const getServerSideProps: GetServerSideProps = async function () {
  const res = await client.call<APIProps, APIResponse>("api/crash", {
    username: "johndoe",
  })
  return { props: res }
}

type Props = InferGetServerSidePropsType<typeof getServerSideProps>

export default function Page(props: Props) {
  console.log(props)
  return <div>API call will crash</div>
}
