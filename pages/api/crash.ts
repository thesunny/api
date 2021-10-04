import { API } from "~/src/api"
import * as s from "superstruct"

const Props = s.object({})

const method = API.method(async (props) => {
  const a: number = 1
  if (a) {
    // This is the place where it crashes in the code. Should show in debug.
    throw new Error("Crashed on server API call")
  }
  return {}
})

export default method
export type APIProps = s.Infer<typeof Props>
export type APIResponse = API.Response<typeof method>
