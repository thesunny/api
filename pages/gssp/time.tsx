import { APIProps, APIResponse } from "~/pages/api/get-time"
import { Client, dedate, Web } from "~/src"
import Link from "next/link"

if (process.env.NEXT_PUBLIC_API_URL == null)
  throw new Error(`Expected process.env.NEXT_PUBLIC_API_URL to be defined`)

export const client = Client.create(process.env.NEXT_PUBLIC_API_URL)

export const getServerSideProps = Web.getServerSideProps(async (context) => {
  console.log("getServerSidProps called")
  return {
    props: dedate({
      username: "John Doe",
      serverTime: new Date(),
    }),
  }
})

// export default function Page({
//   username,
//   serverTime,
// }: Web.Props<typeof getServerSideProps>) {
//   return (
//     <div>
//       Hello World {username}. It's {serverTime}ms since epoch.
//     </div>
//   )
// }

export default Web.Page<typeof getServerSideProps>(
  ({ username, serverTime }) => {
    return (
      <div>
        <div>
          <ul>
            <li>
              <Link href="/gssp/time?user=John">
                <a>John</a>
              </Link>
            </li>
            <li>
              <Link href="/gssp/time?user=Jane">
                <a>Jane</a>
              </Link>
            </li>
          </ul>
        </div>
        Hello World {username}. It's {serverTime}ms since epoch.
      </div>
    )
  }
)
