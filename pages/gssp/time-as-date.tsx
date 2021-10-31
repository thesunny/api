import { Web } from "~/src"

export const getServerSideProps = Web.getServerSideProps(async (context) => {
  return {
    props: {
      username: "John Doe",
      serverTime: new Date(),
    },
  }
})

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
