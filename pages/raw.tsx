import { JsonObject } from "type-fest"
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  InferGetServerSidePropsType,
  NextPage,
} from "next"

export const getServerSideProps = async (context) => {
  const x: number = 0
  if (x === 1) {
    return {
      // notFound: true,
      props: { age: 24 },
    }
  }
  return { props: { name: "John Doe" } }
}

const Page = function (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  return <div>abc</div>
}
