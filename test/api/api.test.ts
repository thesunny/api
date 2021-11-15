import { API } from "~/src"
import { call } from "~/src/test-utils"
import * as s from "superstruct"
import { AssertType } from "@thesunny/assert-type"

describe("Test API", () => {
  beforeAll(() => {
    API.disableLog()
  })

  describe("API.method", () => {
    it("should make a mock call and read the response", async () => {
      const method = API.method(async (props) => {
        return { message: `Hello ${props.name}` }
      })
      const response = await call(method, { name: "John" })
      expect(response).toEqual({
        statusCode: 200,
        json: { message: "Hello John" },
      })
    })

    it("should throw an error and the error message should match", async () => {
      const method = API.method(async (props) => {
        throw new Error("abcdefg")
        return {}
      })
      const response = await call(method, {})
      expect(response).toEqual({
        statusCode: 500,
        data: expect.stringMatching(/abcdefg/),
      })
    })

    it("should extract the right types with API.Response", async () => {
      const method = API.method(async (props) => {
        return { message: `Hello ${props.name}` }
      })
      type Response = API.Response<typeof method>
      AssertType.Equal<Response, { message: string }>(true)
    })
  })

  describe("API.structMethod", () => {
    it("should validate props and pass", async () => {
      const Props = s.object({
        name: s.string(),
      })
      const method = API.structMethod(Props, async (props) => {
        return { message: `Hello ${props.name}` }
      })
      const { json } = await call(method, { name: "John" })
      expect(json).toEqual({ message: "Hello John" })
    })

    it("should validate props and fail", async () => {
      const Props = s.object({
        name: s.string(),
      })
      const method = API.structMethod(Props, async (props) => {
        return { message: `Hello ${props.name}` }
      })
      const response = await call(method, { BAD_VAR: "JOhn" })
      expect(response).toEqual({
        statusCode: 500,
        data: expect.stringMatching("StructError: At path: name"),
      })
    })

    it("should return prop types and response", async () => {
      const Props = s.object({
        name: s.string(),
      })
      const method = API.structMethod(Props, async (props) => {
        return { message: `Hello ${props.name}` }
      })
      type Method = typeof method
      AssertType.Equal<Method["_Props"], { name: string }>(true)
      AssertType.Equal<Method["_Response"], { message: string }>(true)
    })
  })

  describe("API.djmethod", () => {
    it("should convert a date to JSON", async () => {
      const Props = s.object({})
      const method = API.djmethod(Props, async () => {
        return { at: new Date() }
      })
      const { json } = await call(method, {})
      expect(json).toEqual({ at: { $date: expect.any(Number) } })
    })

    it("should handle DJ return types properly", async () => {
      const Props = s.object({ name: s.string() })
      const method = API.djmethod(Props, async () => {
        return { at: new Date() }
      })
      type Method = typeof method
      AssertType.Equal<Method["_Props"], { name: string }>(true)
      AssertType.Equal<Method["_Response"], { at: { $date: number } }>(true)
    })
  })
})
