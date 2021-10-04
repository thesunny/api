import { JSONObject } from "~/lib/json-types"
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next"

export namespace Web {
  /**
   * WARNING:
   * Do not remove this method and use the `GetServerSideProps` type from
   * `next` instead. It won't return the proper type because it takes a
   * generic and if you don't explicitly define it, it won't figure it out
   * on its own.
   *
   * Usage:
   * ```ts
   * export const getServerSideProps = Web.getServerSideProps(
   *   async function (context) {
   *     return { props: {} }
   *   }
   * )
   * ```
   */
  export function getServerSideProps<RJ extends JSONObject>(
    fn: (context: GetServerSidePropsContext) => Promise<{ props: RJ }>
  ) {
    return fn
  }

  /**
   * Extract the Props for use in the web page from `getServerSideProps`
   *
   * Usage:
   * ```ts
   * type Props = Web.Props<typeof getServerSideProps>
   *
   * export default function (props: Props) {
   *   // props will be typed.
   *   // rest of content goes here.
   * }
   * ```
   */
  export type Props<T> = InferGetServerSidePropsType<T>
}
