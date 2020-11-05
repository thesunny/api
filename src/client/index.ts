import { handleErrorResponse } from "./handle-error"
import { ParsedUrlQuery } from "querystring"
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  InferGetServerSidePropsType,
  NextPage,
} from "next"
import { MethodType, ServerMethod } from "../types"
import * as s from "superstruct"

export namespace Client {
  /**
   * Private version of making a call to the server API that allows adding
   * headers so cookies can be passed through from server side requests.
   *
   * @param path the path under the `pages/api` directory
   * @param props the props to pass to the `API.method`
   */
  export async function _call<T extends ServerMethod>(
    path: string,
    props: MethodType<T>["props"],
    headers?: Record<string, string> //Parameters<typeof fetch>[1]["headers"]
  ) {
    if (process.env.NEXT_PUBLIC_API_URL == null) {
      throw new Error(
        `process.env.NEXT_PUBLIC_API_URL must be defined in environment`
      )
    }
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/${path}`
    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify(props),
      headers: { "Content-Type": "application/json", ...headers },
    })
    if (res.ok) {
      /**
       * If the fetch is successful, return the data
       */
      const json = await res.json()
      return json as MethodType<T>["response"]
    } else {
      handleErrorResponse({ path, url, props })
      const text = await res.text()
      const htmlErrorTitleMatch = text.match(/<title>(.*)<\/title>/)
      let errorTitle = htmlErrorTitleMatch ? htmlErrorTitleMatch[1] : null
      if (errorTitle) {
        /**
         * If we can extract the title from the text which is, presumably HTML,
         * then throw an error with just the title.
         */
        throw new Error(errorTitle)
      } else {
        /**
         * If we can't find the title, for the time being, just dump everything
         * but if it is HTML, it is going to look really messy because we will
         * be seeing unparsed HTML code.
         */
        throw new Error(text)
      }
    }
  }

  /**
   * Make a call to the server API
   *
   * @param path the path under the `pages/api` directory
   * @param props the props to pass to the `API.method`
   */
  export async function call<T extends ServerMethod>(
    path: string,
    props: MethodType<T>["props"],
    context?: GetServerSidePropsContext<ParsedUrlQuery>
  ) {
    if (typeof window !== "undefined") {
      // call from browser
      return await _call(path, props, {})
    } else {
      if (typeof context === "undefined") {
        throw new Error(
          `When Client.call is executed on the server, the context must be passed in as the third argument`
        )
      }
      const headers: Record<string, string> = {}
      if (context.req.headers["cookie"]) {
        headers.Cookie = context.req.headers["cookie"]
      }

      return _call(path, props, headers)
    }
  }

  /**
   * Create the getServerSideProps method
   *
   * @param fn
   */
  // export function getServerSideProps<T>(
  //   fn: (
  //     context: GetServerSidePropsContext<ParsedUrlQuery> //& { call: typeof call }
  //   ) => Promise<T>
  // ): GetServerSideProps<T> {
  //   const generatedFn = async function (
  //     context: GetServerSidePropsContext<ParsedUrlQuery>
  //   ) {
  //     const response = await fn(context)
  //     return { props: response }
  //   }
  //   return generatedFn
  // }

  type GetServerSidePropsFn<Q extends object, RT> = (
    transformedQuery: Q,
    context: GetServerSidePropsContext<ParsedUrlQuery>
  ) => Promise<RT>

  export function getServerSideProps<RT, Q extends object>(
    fn: GetServerSidePropsFn<Q, RT>,
    { Query }: { Query: s.Struct<Q> } = { Query: s.object({}) }
  ): GetServerSideProps<RT> {
    const generatedFn = async function (
      context: GetServerSidePropsContext<ParsedUrlQuery>
    ) {
      const props = s.coerce(context.query, Query)
      const response = await fn(props, context)
      return { props: response }
    }
    return generatedFn
  }

  /**
   * Create the Page default export
   *
   * @param fn
   */
  export function Page<T>(fn: (props: InferGetServerSidePropsType<T>) => any) {
    return fn
  }
}
