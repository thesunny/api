import { AssertType } from "@thesunny/assert-type"
import { DJSendObject, JSendObject, djsend, jsend } from "~/src/jsend"

describe("jsend library", () => {
  describe("jsend without date", () => {
    it("should pass jsend", async () => {
      jsend({ status: "success", data: {} })
      jsend({ status: "fail", data: {} })
      jsend({ status: "error", message: "" })
    })

    it("should extend JSendObject", async () => {
      AssertType.Extends<
        { status: "success"; data: { name: string } },
        JSendObject
      >(true)
    })

    it("should not extend JSendObject if it has a date", async () => {
      AssertType.NotExtends<
        { status: "success"; data: { name: string; at: Date } },
        JSendObject
      >(true)
    })
  })

  describe("djsend with date", () => {
    it("should pas djsend", async () => {
      djsend({ status: "success", data: { at: new Date() } })
      djsend({ status: "fail", data: { at: new Date() } })
      djsend({ status: "error", message: "" })
    })

    it("should extend JSendObject even with a date", async () => {
      AssertType.Extends<
        { status: "success"; data: { name: string; at: Date } },
        DJSendObject
      >(true)
    })
  })
})
