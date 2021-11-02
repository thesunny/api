import { dedate } from ".."
import { AssertType } from "@thesunny/assert-type"

const DATE_MS = 946713600000

describe("dedate", () => {
  it("should dedate a date", async () => {
    const at = dedate(new Date(DATE_MS))
    expect(at).toEqual(DATE_MS)
    AssertType.Equal<typeof at, number>(true)
  })

  it("should dedate in an object", async () => {
    const thing = dedate({ name: "John", at: new Date(DATE_MS) })
    expect(thing).toEqual({ name: "John", at: DATE_MS })
    AssertType.Equal<typeof thing, { name: string; at: number }>(true)
  })

  it("should dedate in an array", async () => {
    const ats = dedate([new Date(DATE_MS), new Date(DATE_MS + 1)])
    expect(ats).toEqual([DATE_MS, DATE_MS + 1])
    AssertType.Equal<typeof ats, number[]>(true)
  })

  it("should dedate array with object in it", async () => {
    const things = dedate([
      { at: new Date(DATE_MS) },
      { at: new Date(DATE_MS + 1) },
    ])
    expect(things).toEqual([{ at: DATE_MS }, { at: DATE_MS + 1 }])
    AssertType.Equal<typeof things, { at: number }[]>(true)
  })

  it("should dedate object with array in it", async () => {
    const thing = dedate({ ats: [new Date(DATE_MS), new Date(DATE_MS + 1)] })
    expect(thing).toEqual({ ats: [DATE_MS, DATE_MS + 1] })
    AssertType.Equal<typeof thing, { ats: number[] }>(true)
  })
})
