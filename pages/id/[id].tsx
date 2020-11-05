import { Client } from "~/src/client"

import * as s from "superstruct"

const ToId = s.coercion(s.number(), (value) => {
  if (typeof value !== "string") throw new Error(`value must be a string`)
  const id = parseInt(value)
  if (id <= 0)
    throw new Error(
      `The value ${value} must parseInt to a value greater than zero`
    )
  return id
})

const Props = s.object({
  id: ToId,
})

export const getServerSideProps = Client.getServerSideProps(
  Props,
  async ({ id }, context) => {
    return { id: id }
  }
)

export default Client.Page<typeof getServerSideProps>(function ({ id }) {
  return <div>Input number is {id}</div>
})
