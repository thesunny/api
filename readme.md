# @thesunny/api2

A featherweight API abstraction and browser client in a few KB for Next.js with end-to-end TypeScript typing, colorful API call/response logging, and type validation on the API server to ensure you are getting the right data types.

## Design Decisions

- Next.js gets upgraded frequently so we try not to build on top of Next.js methods and types
- The `Client` method is unrelated to Next.js. It actually doesn't have any Next.js integration which keeps it clean.
- The `API.method` function is as minimal as possible. Here's some thoughts on its design:
- - **Get Response Type**: It does all you to get the `Response` type for consumption by the client using `API.Response`.
  - **Opinionated JSON Return Type**: It forces you to return a JSON object because if you don't, you get weird bugs.
  - **Response is otherwuse unopinionated**: It does not type narrow the return type to `jsend` but you have to do it manually. Because sometimes, that might not be what you want to return.
  - **No incoming validation**: It does not validate the incoming props because that ties it too closely with superstruct which we use... and the problem is superstruct changes often
  - **Eliminates Res Setting Boilerplate**: It does allow you to simply return a `JSON` response and you don't need to do all the `res.status` stuff
  - **Better Debugging**: Show important debug information in console like errors, execution time, incoming props, outgoing values.
- `Web`
  - Self documenting (because they are the only two things in `Web`) use of `Web.Context` and `Web.Props` in place of more verbose and hard to rememeber Next.js types `GetServerSidePropsContext` and `InferGetServerSidePropsContext`
  - It is redundant, but its easy to forget the name of these methods, and even as we remember, they use a lot of screen real estate.
- `jsend`
  - Kept separate because sometimes we may not want to conform to `jsend`
  - When we do, a single method takes `jsend` object and returns the object making it super simple to use.

## Define an API method

```ts
import { API, jsend } from "@thesunny/api"
import * as s from "superstruct"

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

## Minimal Web Page (Without API)

```ts
import { Web } from "@thesunny/api"

export async function getServerSideProps(context: Web.Context) {
  return { props: {} }
}

type Props = Web.Props<typeof getServerSideProps>

export default function Page(props: Props) {
  return <div>Hello</div>
}
```

## Minimal Web Page (With API and Client)

```ts
import { Client, Web } from "@thesunny/api"
import { APIProps, APIResponse } from "~/pages/api/minimal-api"

export const client = Client.create(process.env.NEXT_PUBLIC_API_URL)

export async function getServerSideProps(context: Web.Context) {
  const response = await client.call<APIProps, APIResponse>("api/...path", {})
  return { props: response.data }
}

type Props = Web.Props<typeof getServerSideProps>

export default function Page({ number }: Props) {
  return <div>{number}</div>
}
```

## Features

### Client features

- Supports end-to-end typing
- Proper calling types for API
- Proper return types for API
- If the Client hits a bad URL, throws a helpful Error

### API Features

- Logs API calls to console with call arguments with pretty colors
- Logs API return values to console with pretty colors
- Logs Errors nicely into the console
- Adds a counter to identify each call and displays it with the response so you can match calls with responses if they don't happen in order
- Type generics to extract API Response type for use with client

### JSend Features

- Easy method makes sure your types conform to `jsend` standard.

### Web Features

- `Web.Context` shortcut for use with `getServerSideProps` first argument
- `Web.Props` shortcut that takes `typeof getServerSideProps` and extracts the return value from the function for use in Page props.
