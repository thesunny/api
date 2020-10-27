import { handleErrorResponse } from "./handle-error"
import { ParsedUrlQuery } from "querystring"
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPage,
} from "next"
import { MethodType, ServerMethod } from "../types"

export namespace Client {
  /**
   * Make a call to the server API
   *
   * @param path the path under the `pages/api` directory
   * @param props the props to pass to the `API.method`
   */
  export async function call<T extends ServerMethod>(
    path: string,
    props: MethodType<T>["props"]
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
      headers: { "Content-Type": "application/json" },
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
   * Create the getServerSideProps method
   *
   * @param fn
   */
  export function getServerSideProps<T>(
    fn: (context: GetServerSidePropsContext<ParsedUrlQuery>) => Promise<T>
  ): GetServerSideProps<T> {
    const generatedFn: GetServerSideProps<T, ParsedUrlQuery> = async function (
      context
    ) {
      const response = await fn(context)
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
