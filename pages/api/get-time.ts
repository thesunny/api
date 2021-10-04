import { API } from "~/src/api"
import * as s from "superstruct"
import { jsend } from "~/src/jsend"

const APIProps = s.object({
  username: s.string(),
})

const method = API.method(async function (props) {
  const { username } = s.create(props, APIProps)
  return jsend({
    status: "success",
    data: { username, serverTime: new Date().getTime() },
  })
})

export default method
export type APIProps = s.Infer<typeof APIProps>
export type APIResponse = API.Response<typeof method>
