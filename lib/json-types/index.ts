export type JSONValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | JSONArray
  | JSONObject

export type JSONArray = Array<JSONValue>

export type JSONObject = {
  [key: string]: JSONValue
}
