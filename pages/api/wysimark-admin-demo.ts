// import { API, jsend } from "@thesunny/api2"
// import { ensureUser } from "~/lib/user"
// import { prisma } from "~/lib/prisma"
import { jsend, API } from "~/src"

const method = API.method(async (props, req) => {
  const user = { id: "jkfdsjklfds" }
  const apps = [{}]
  // return { status: "success", data: { user, apps } }
  return jsend({ status: "success", data: { user, apps } })
})

export default method

export type Props = {}
export type Response = API.Response<typeof method>
