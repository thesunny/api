// import { API, jsend } from "@thesunny/api2"
// import { ensureUser } from "~/lib/user"
// import { prisma } from "~/lib/prisma"
import { DJ, djsend, API } from "~/src"

type User = {
  id: string
  at: Date
}

const method = API.method(async (props, req) => {
  const user: User = {
    id: "jkfdsjklfds",
    at: new Date(),
  }
  const apps: { name: string }[] = [{ name: "lorem" }]
  const response = djsend({ status: "success", data: { user, apps } })
  return response
})

export default method

export type Props = {}
export type Response = API.Response<typeof method>
