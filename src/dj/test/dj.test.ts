import { toJsonValue, fromJsonValue, DJToJson } from ".."

/**
 * If the two types are equal (either type can extends from the other type in
 * either direction) then return a type of `true` and otherwise a type of
 * `false`
 *
 * <https://github.com/Microsoft/TypeScript/issues/27024#issuecomment-509504856>
 *
 * Use this to check for type equality
 *
 * const a: IsEqual<{a: string}, {a: string}> = true
 * const a: IsEqual<{a: string}, {a: number}> = false
 *
 * Which in this case will show an error
 */
// prettier-ignore
export type IsEqual<A, B, Y = true, N = false> =
  (<T>() => T extends A ? 1 : 2) extends
  (<T>() => T extends B ? 1 : 2) ? Y : N

// prettier-ignore
export function assertTypeEqual<A, B>(value: IsEqual<A, B>): B {
  return {} as B
}

const DATE_MS = 946713600000

describe("ejson", () => {
  describe("JsonDate.toJsonValue", () => {
    it("should export a date", async () => {
      const value = new Date("January 1, 2000")
      const json = toJsonValue(value)

      expect(value).toBeInstanceOf(Date)
      assertTypeEqual<typeof json, { $date: number }>(true)
      expect(json).toEqual({ $date: DATE_MS })
    })

    it("should export 1", async () => {
      const json = toJsonValue(1)
      expect(json).toEqual(1)
      assertTypeEqual<typeof json, 1>(true)
    })

    it("should export number", async () => {
      const json = toJsonValue(1 as number)
      expect(json).toEqual(1)
      assertTypeEqual<typeof json, number>(true)
    })

    it("should export string", async () => {
      const json = toJsonValue("abc" as string)
      expect(json).toEqual("abc")
      assertTypeEqual<typeof json, string>(true)
    })

    it("should export boolean", async () => {
      const json = toJsonValue(true as boolean)
      expect(json).toEqual(true)
      assertTypeEqual<typeof json, boolean>(true)
    })

    it("should export null", async () => {
      const json = toJsonValue(null as null)
      expect(json).toEqual(null)
      assertTypeEqual<typeof json, null>(true)
    })

    it("should export objects with date", async () => {
      const djson = { at: new Date("January 1, 2000") }
      const json = toJsonValue(djson)
      assertTypeEqual<typeof json, { at: { $date: number } }>(true)
      expect(json).toEqual({ at: { $date: DATE_MS } })
    })

    it("should export arrays with date", async () => {
      const djson = [new Date("January 1, 2000")]
      const json = toJsonValue(djson)
      assertTypeEqual<typeof json, Array<{ $date: number }>>(true)
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
      assertTypeEqual<T, never>(true)
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
      assertTypeEqual<
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
      assertTypeEqual<typeof value, Date>(true)
      expect(value.getTime()).toEqual(DATE_MS)
    })

    it("should import a number", async () => {
      const value = fromJsonValue(1 as number)
      expect(value).toEqual(1)
      assertTypeEqual<typeof value, number>(true)
    })

    it("should import a string", async () => {
      const value = fromJsonValue("abc" as string)
      expect(value).toEqual("abc")
      assertTypeEqual<typeof value, string>(true)
    })

    it("should import a boolean", async () => {
      const value = fromJsonValue(true as boolean)
      expect(value).toEqual(true)
      assertTypeEqual<typeof value, boolean>(true)
    })

    it("should import a null", async () => {
      const value = fromJsonValue(null as null)
      expect(value).toEqual(null)
      assertTypeEqual<typeof value, null>(true)
    })

    it("should import object with date", async () => {
      const value = fromJsonValue({ at: { $date: DATE_MS } })
      assertTypeEqual<typeof value, { at: Date }>(true)
      expect(value).toEqual({ at: expect.any(Date) })
      expect(value.at.getTime()).toEqual(DATE_MS)
    })

    it("should import arrays with date", async () => {
      const value = fromJsonValue([{ $date: DATE_MS }])
      assertTypeEqual<typeof value, Date[]>(true)
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
      assertTypeEqual<
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
