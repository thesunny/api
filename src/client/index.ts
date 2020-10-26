import { handleErrorResponse } from "./handle-error"
import { ParsedUrlQuery } from "querystring"
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPage,
} from "next"

export namespace Client {
  /**
   * Make a call to the server API
   *
   * @param path the path under the `pages/api` directory
   * @param props the props to pass to the `API.method`
   */
  export async function call<T extends { props: any; response: any }>(
    path: string,
    props: T["props"]
  ) {
    const res = await fetch(`http://localhost:5000/api/${path}`, {
      method: "POST",
      body: JSON.stringify(props),
      headers: { "Content-Type": "application/json" },
    })
    if (res.ok) {
      /**
       * If the fetch is successful, return the data
       */
      const json = await res.json()
      return json as T["response"]
    } else {
      handleErrorResponse(path, props)
      const text = await res.text()
      throw new Error(text)
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
