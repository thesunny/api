import { JsonObject } from "type-fest"
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPage,
} from "next"
import { ParsedUrlQuery } from "querystring"

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
   *
   * Degine `getServerSideProps` function
   *
   * - types the `context` argument
   * - ensures returned value is a Promise
   * - ensures returnes value is a `JsonObject`
   */
  export function getServerSideProps<RJ extends JsonObject>(
    fn: (context: GetServerSidePropsContext) => Promise<{ props: RJ }>
  ) {
    return fn
  }

  /**
   * Define the default export of a Page.
   *
   * - types the `props` argument using `typeof getServerSideProps` in generic
   * - ensures returned value is valid (React Element or null)
   */
  export function Page<GP extends GetServerSideProps>(
    fn: NextPage<InferGetServerSidePropsType<GP>>
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

  /**
   * WARNING!
   *
   * Do not remove this method and use the `GetServerSideProps` function type
   * instead. It won't return the proper type because it takes a generic and
   * if you don't provide it, defaults to something like `any`.
   *
   * WARNING:
   *
   * Recommend not using this directly. Use `getServerSideProps` instead as it
   * will type the return value.
   *
   * Usage:
   * ```ts
   * export const async function (context: Web.Context) {
   *   return { props: {} }
   * }
   * ```
   */
  export type Context<Q extends ParsedUrlQuery = ParsedUrlQuery> =
    GetServerSidePropsContext<Q>
}
