import {
  GetServerSidePropsContext as OriginalGetServerSidePropsContext,
  InferGetServerSidePropsType,
  GetServerSideProps as OriginalGetServerSideProps,
} from "next"
import { JSONObject } from "../json-types"

export namespace Web {
  /**
   * Use this to type `getServerSideProps`
   */
  export type GetServerSideProps = OriginalGetServerSideProps

  /**
   * Use this to get the `Props` type for the Page.
   *
   * export default function Page({
   *   username,
   *   serverTime,
   * }: Web.Props<typeof getServerSideProps>) {
   *   return (
   *     <div>
   *       Hello World {username}. It's {serverTime}ms since epoch.
   *     </div>
   *   )
   * }
   */
  export type Props<T> = InferGetServerSidePropsType<T>
}
