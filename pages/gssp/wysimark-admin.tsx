import { Web } from "~/src"
import { Simplify } from "type-fest"

// interface UserWithId {
//   name: string
//   email: string
//   image: string
//   id: string
// }

type UserWithId = {
  name: string
}

type App = {
  id: string
  userId: string
  name: string
  createdAt: Date
  updatedAt: Date
  isActive: boolean
  isPublic: boolean
}

type Props = {
  user: UserWithId
  app: App
}

/**
 * This will work because the interface is converted to a `type`
 */
type SimplifiedProps = {
  user: Simplify<UserWithId>
  app: Simplify<App>
}

/**
 * The interface is not being accepted as `extends DJ` because the props are
 * an `interface`. The problem with it being an `interface` is that there can
 * be additional properties and the value would satisfy the interface.
 *
 * This means that there are a bunch of possibly unknown properties that will
 * not satisfy `extends DJ`.
 *
 * One poor workaround is to `Simplify<TheInterface>` for each interface
 */
const getServerSideProps = Web.getServerSideProps(async (context) => {
  const props = {
    user: {
      id: "abcdefg",
      name: "John Doe",
      email: "johndoe@gmail.com",
      image: "",
    } as UserWithId,
    app: {
      id: "def",
      userId: "abcdefg",
      name: "test-app-1",
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
      isPublic: true,
    },
  }
  return { props }
})
