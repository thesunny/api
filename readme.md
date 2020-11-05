# @thesunny/api

A featherweight API abstraction and browser client in a few KB for Next.js with end-to-end TypeScript typing, colorful API call/response logging, and type validation on the API server to ensure you are getting the right data types.

## Features

- Supports end-to-end typing so that you can get the proper types i the client
- Logs API calls to console with call arguments with pretty colors
- Logs API return values to console with pretty colors
- Adds a counter to identify each call and displays it with the response so you can match calls with responses if they don't happen in order
- Validate the types of incoming API call props so that you don't have to
- Adds the types to your API call params

## Getting Started in Browser

```ts
import { Client } from "@thesunny/api"
import * as s from "superstruct"

export const getServerSideProps = Client.getServerSideProps(
  /**
   * The function arguments are automatically typed using the `Query` `Struct`
   * option from below.
   */
  ({ name }, context) => {
    const message = `Hello ${name}`
    return { message }
  },
  /**
   * Use a superstruct `Struct` to validate and coerce the query. Query is a
   * superstruct `Struct`
   */
  {
    Query: s.object({ name: s.string() }),
  }
)
```
