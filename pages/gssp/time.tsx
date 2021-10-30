import { dedate, Web } from "~/src"
import Link from "next/link"

export const getServerSideProps = Web.getServerSideProps(async (context) => {
  return {
    props: dedate({
      username: context.query.user ? context.query.user : "Unspecified User",
      serverTime: new Date(),
    }),
  }
})

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
