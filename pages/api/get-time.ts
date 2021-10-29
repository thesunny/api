import { jsend, API } from "~/src"
import * as s from "superstruct"
import { dedate } from "~/src/dedate"

const APIProps = s.object({
  username: s.string(),
})

const method = API.method(async function (props) {
  const { username } = s.create(props, APIProps)
  return jsend({
    status: "success",
    data: dedate({ username, serverTime: new Date() }),
  })
})

export default method
export type APIProps = s.Infer<typeof APIProps>
export type APIResponse = API.Response<typeof method>
