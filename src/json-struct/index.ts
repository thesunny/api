import { JsonArray, JsonObject, JsonPrimitive, JsonValue } from "type-fest"
import * as s from "superstruct"

export const JsonPrimitiveStruct: s.Describe<JsonPrimitive> = s.nullable(
  s.union([s.string(), s.number(), s.boolean()])
)

export const JsonArrayStruct: s.Describe<JsonArray> = s.array(
  s.lazy(() => JsonValueStruct)
)

export const JsonObjectStruct: s.Describe<JsonObject> = s.record(
  s.string(),
  s.lazy(() => s.optional(JsonValueStruct))
)

export const JsonValueStruct: s.Describe<JsonValue> = s.union([
  JsonPrimitiveStruct,
  s.lazy(() => JsonArrayStruct),
  s.lazy(() => JsonObjectStruct),
])
