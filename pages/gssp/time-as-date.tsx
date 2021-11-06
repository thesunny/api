import { AssertType } from "@thesunny/assert-type"
import { string } from "superstruct"
import { Web } from "~/src"

export const getServerSideProps = Web.getServerSideProps(async (context) => {
  return {
    props: {
      username: "John Doe",
      serverTime: new Date(),
    },
  }
})

type Props = Web.Props<typeof getServerSideProps>
AssertType.Equal<Props, { username: string; serverTime: Date }>(true)

export default Web.Page<typeof getServerSideProps>((props) => {
  const { username, serverTime } = props
  return (
    <div>
      Hello World {username}. It's{" "}
      {serverTime.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })}
      .
    </div>
  )
})
