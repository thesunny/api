import { toJsonValue, fromJsonValue, DJToJson } from "~/src/dj"
import { AssertType } from "@thesunny/assert-type"

const DATE_MS = 946713600000

describe("ejson", () => {
  describe("JsonDate.toJsonValue", () => {
    it("should export a date", async () => {
      const value = new Date("January 1, 2000")
      const json = toJsonValue(value)

      expect(value).toBeInstanceOf(Date)
      AssertType.Equal<typeof json, { $date: number }>(true)
      expect(json).toEqual({ $date: DATE_MS })
    })

    it("should export specific number", async () => {
      const json = toJsonValue(1)
      expect(json).toEqual(1)
      AssertType.Equal<typeof json, 1>(true)
    })

    it("should export number", async () => {
      const json = toJsonValue(1 as number)
      expect(json).toEqual(1)
      AssertType.Equal<typeof json, number>(true)
    })

    it("should export specific string", async () => {
      const json = toJsonValue("abc")
      expect(json).toEqual("abc")
      AssertType.Equal<typeof json, "abc">(true)
    })

    it("should export string", async () => {
      const json = toJsonValue("abc")
      expect(json).toEqual("abc")
      AssertType.Equal<typeof json, "abc">(true)
    })

    it("should export boolean", async () => {
      const json = toJsonValue(true as boolean)
      expect(json).toEqual(true)
      AssertType.Equal<typeof json, boolean>(true)
    })

    it("should export null", async () => {
      const json = toJsonValue(null as null)
      expect(json).toEqual(null)
      AssertType.Equal<typeof json, null>(true)
    })

    it("should export objects with date", async () => {
      const djson = { at: new Date("January 1, 2000") }
      const json = toJsonValue(djson)
      AssertType.Equal<typeof json, { at: { $date: number } }>(true)
      expect(json).toEqual({ at: { $date: DATE_MS } })
    })

    it("should export arrays with date", async () => {
      const djson = [new Date("January 1, 2000")]
      const json = toJsonValue(djson)
      AssertType.Equal<typeof json, Array<{ $date: number }>>(true)
      expect(json).toEqual([{ $date: DATE_MS }])
    })

    it("should make sure the type of { $date: any } returns never", async () => {
      /**
       * We don't want to accept any object with a $date property.
       *
       * This allows us to keep the project simpler. But we also don't want to
       * get bad typing information if we ever do so we elect to return
       * `never` and throw an Error if we do receive an object with a $date
       * property.
       */
      type T = DJToJson<{ $date: any }>
      AssertType.Equal<T, never>(true)
    })

    it("should disallow the key $date in an object", async () => {
      const djson = { $date: "string-date" }
      expect(() => toJsonValue(djson)).toThrow(
        "Object with key $date is invalid"
      )
    })

    it("should export complex", async () => {
      const value = toJsonValue([
        {
          at: new Date(DATE_MS),
          s: "abc",
          n: 123,
          a: [{ at: new Date(DATE_MS) }],
        },
      ])
      AssertType.Equal<
        typeof value,
        {
          at: { $date: number }
          s: string
          n: number
          a: { at: { $date: number } }[]
        }[]
      >(true)
      expect(value).toEqual([
        {
          at: { $date: DATE_MS },
          s: "abc",
          n: 123,
          a: [{ at: { $date: DATE_MS } }],
        },
      ])
    })
  })

  describe("JsonDate.fromJsonValue", () => {
    it("should import a date", async () => {
      const json = { $date: DATE_MS }
      const value = fromJsonValue(json)

      expect(value).toBeInstanceOf(Date)
      AssertType.Equal<typeof value, Date>(true)
      expect(value.getTime()).toEqual(DATE_MS)
    })

    it("should import a number", async () => {
      const value = fromJsonValue(1 as number)
      expect(value).toEqual(1)
      AssertType.Equal<typeof value, number>(true)
    })

    it("should import a string", async () => {
      const value = fromJsonValue("abc" as string)
      expect(value).toEqual("abc")
      AssertType.Equal<typeof value, string>(true)
    })

    it("should import a boolean", async () => {
      const value = fromJsonValue(true as boolean)
      expect(value).toEqual(true)
      AssertType.Equal<typeof value, boolean>(true)
    })

    it("should import a null", async () => {
      const value = fromJsonValue(null as null)
      expect(value).toEqual(null)
      AssertType.Equal<typeof value, null>(true)
    })

    it("should import object with date", async () => {
      const value = fromJsonValue({ at: { $date: DATE_MS } })
      AssertType.Equal<typeof value, { at: Date }>(true)
      expect(value).toEqual({ at: expect.any(Date) })
      expect(value.at.getTime()).toEqual(DATE_MS)
    })

    it("should import arrays with date", async () => {
      const value = fromJsonValue([{ $date: DATE_MS }])
      AssertType.Equal<typeof value, Date[]>(true)
      expect(value).toEqual([expect.any(Date)])
    })

    it("should import complex", async () => {
      const value = fromJsonValue([
        {
          at: { $date: DATE_MS },
          s: "abc",
          n: 123,
          a: [{ at: { $date: DATE_MS } }],
        },
      ])
      AssertType.Equal<
        typeof value,
        { at: Date; s: string; n: number; a: { at: Date }[] }[]
      >(true)
      expect(value).toEqual([
        {
          at: expect.any(Date),
          s: "abc",
          n: 123,
          a: [{ at: expect.any(Date) }],
        },
      ])
    })
  })
})
