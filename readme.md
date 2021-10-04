# @thesunny/api

A featherweight API abstraction and browser client in a few KB for Next.js with end-to-end TypeScript typing, colorful API call/response logging, and type validation on the API server to ensure you are getting the right data types.

## Design Decisions

You will feel a need to improve this API. Most likely, you don't want to. There are sane reasons why the API is designed this way. Here are a few:

- Next.js gets upgraded frequently so we don't extend Next.js types
- The web page `type`s are therefore purely from Next. When we tried to override them by using a surrounding function, the method calls got long, and they were harder to manage when Next.js changed.
- The `Client` method is completely separate. It actually doesn't have any Next.js integration which keeps it clean.
- The `API.method` function is as minimal as possible. Here's some thoughts on its design:
- - **Get Response Type**: It does all you to get the `Response` type for consumption by the client using `API.Response`.
  - **Opinionated JSON Return Type**: It forces you to return a JSON object because if you don't, you get weird bugs.
  - **Response is otherwuse unopinionated**: It does not type narrow the return type to `jsend` but you have to do it manually. Because sometimes, that might not be what you want to return.
  - **No incoming validation**: It does not validate the incoming props because that ties it too closely with superstruct which we use... and the problem is superstruct changes often
  - **Eliminates Res Setting Boilerplate**: It does allow you to simply return a `JSON` response and you don't need to do all the `res.status` stuff
  - **Better Debugging**: Show important debug information in console like errors, execution time, incoming props, outgoing values.

## Define an API method

```ts
import { API } from "@thesunny/api"
import * as s from "superstruct"
import { jsend } from "@thesunny/api/jsend"

const Props = s.object({})

const method = API.method(async function (props) {
  const {} = s.create(props, Props)
  return jsend({ status: "success", data: {} })
})

export default method
export type APIProps = s.Infer<typeof Props>
export type APIResponse = API.Response<typeof method>
```

## Make an API call from the Client

Client can be on the browser or on the Node.js server. Both will work.

```ts
import { Client } from "@thesunny/api"

const client = Client.create("http://localhost:3000")
const response = await client.call("api/get-time", { username: "john" })
```

## Use call in Web Page

```ts
import { Client } from "@thesunny/api/client"
import { GetServerSideProps, InferGetServerSidePropsType } from "next"
import { APIProps, APIResponse } from "~/path/to/api"

const client = Client.create("http://localhost:3000")

export const getServerSideProps: GetServerSideProps = async function () {
  const response = await client.call<APIProps, APIResponse>(
    "api/path/to/api",
    {}
  )
  return { props: {} }
}

export default function Page({}: InferGetServerSidePropsType<
  typeof getServerSideProps
>) {
  return <div>Hello World</div>
}
```

## Features

- Supports end-to-end typing so that you can get the proper types i the client
- Logs API calls to console with call arguments with pretty colors
- Logs API return values to console with pretty colors
- Adds a counter to identify each call and displays it with the response so you can match calls with responses if they don't happen in order
- Validate the types of incoming API call props so that you don't have to
- Adds the types to your API call params
