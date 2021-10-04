import { jsend, API } from "~/src"
import * as s from "superstruct"

const APIProps = s.object({
  number: s.number(),
})

const method = API.method(async function (props) {
  const { number } = s.create(props, APIProps)
  return jsend({
    status: "success",
    data: { number },
  })
})

export default method
export type APIProps = s.Infer<typeof APIProps>
export type APIResponse = API.Response<typeof method>
