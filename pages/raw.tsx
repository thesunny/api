import {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPageContext,
} from "next"

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const x: number = 0
  if (x === 1) {
    return {
      /**
       * If we uncomment this, `props` below will be set to `never`.
       *
       * Typing with TypeScript doesn't work well when there is a possibility
       * of not returning props.
       *
       * This is one of the reasons why we `throw` in `Web.getServerSideProps`
       * so that a possible return value with `redirect` or `notFound` are
       * never returned as the value of the `getServerSideProps` function that
       * the developer defines.
       */
      // notFound: true,
      props: { age: 24 },
    }
  }
  return { props: { name: "John Doe" } }
}

export default function Page(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  return <div>Hello {props.name}</div>
}
