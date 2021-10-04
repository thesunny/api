import { API } from "~/src/api"
import * as s from "superstruct"

const Props = s.object({})

const method = API.method(async (props) => {
  const a: number = 1
  if (a) {
    throw new Error("Uh oh, it crashed")
  }
  return {}
})

export default method
export type APIProps = s.Infer<typeof Props>
export type APIResponse = API.Response<typeof method>
