import { JsonObject, Simplify } from "type-fest"
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  InferGetServerSidePropsType,
  NextPage,
  NextPageContext,
} from "next"
import { ParsedUrlQuery } from "querystring"
import { log } from "../api/log"
import { DJ, JsonToDJ, DJObject } from "../dj"

let lastId = 0

export namespace Web {
  /**
   * Create this `Response` object and throw it in `getServerSideProps` in
   * order to do a redirect from anywhere.
   *
   * ```
   * throw new Web.Response({redirect: { destination: '/', permanent: false })
   * ```
   *
   * The benefit of throwing it is that it won't become part of the return
   * value of the function passed in making it easier to get the types of the
   * props.
   */
  export class Response {
    readonly value: GetServerSidePropsResult<never>
    constructor(value: GetServerSidePropsResult<never>) {
      this.value = value
    }
  }

  /**
   * Shortcut to redirect from inside `getServerSideProps`
   */
  export function redirect(
    destination: string,
    permanent: boolean = false
  ): never {
    throw new Response({ redirect: { destination, permanent } })
  }

  /**
   * Shrotcut to return a not found inside `getServerSideProps`
   */
  export function notFound(): never {
    throw new Response({ notFound: true })
  }

  /**
   * WARNING:
   *
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
   * The `getServerSideProps` function
   *
   * - types the `context` argument
   * - ensures returned value is a Promise
   * - ensures returnes value is a `JsonObject`
   */
  // export function getServerSideProps<RJ extends RJObject>(
  export function getServerSideProps<RJ extends DJObject>(
    fn: (context: GetServerSidePropsContext) => Promise<{ props: RJ }>
    // ) => Promise<{ props: RJ extends DJSafe<RJ> ? RJ : never }>
  ) {
    return async function getServerSideProps(
      context: GetServerSidePropsContext
    ) {
      /**
       * Keep track of the current `id` so that when we `console.log` details
       * of the execution, we can match the start of the request with the end.
       */
      lastId++
      const id = lastId
      try {
        const startTime = new Date().getTime()

        log.request(id, {
          query: context.query,
          params: context.params,
        })
        const djResponse = await fn(context)
        const jsonResponse = { props: DJ.toJsonValue(djResponse.props) }

        const diff = new Date().getTime() - startTime
        log.response(id, diff, jsonResponse)

        return jsonResponse
      } catch (e) {
        if (e instanceof Response) {
          return e.value
        } else {
          log.error(id, e as Error)
          throw e
        }
      }
    }
  }

  /**
   * Define the default export of a Page.
   *
   * IMPORTANT:
   * Converts JSON into DJ (JSON with dates). Dates are encoded as
   * `{ $date: number }` when `Web.getServerSideProps` is executed.
   *
   * - types the `props` argument using `typeof getServerSideProps` in generic
   * - ensures returned value is valid (React Element or null)
   */
  export function Page<GP extends GetServerSideProps>(
    fn: NextPage<JsonToDJ<InferGetServerSidePropsType<GP>>>
  ) {
    const PageWithJsonProps: NextPage<InferGetServerSidePropsType<GP>> =
      function ({ children, ...jsonProps }) {
        const djProps = DJ.fromJsonValue(jsonProps)
        /**
         * I'm fairly confident this works but it has been challenging to get
         * the type issues to disappear.
         */
        // @ts-ignore
        return fn({ children, ...djProps })
      }

    return PageWithJsonProps
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
  export type Props<T extends GetServerSideProps<JsonObject>> = JsonToDJ<
    InferGetServerSidePropsType<T>
  >

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
