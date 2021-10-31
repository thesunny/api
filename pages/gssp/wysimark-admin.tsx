import { Web } from "~/src"

type UserWithId = {
  name: string
  email: string
  image: string
  id: string
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

const getServerSideProps = Web.getServerSideProps(async (context) => {
  const props: Props = {
    user: {
      id: "abcdefg",
      name: "John Doe",
      email: "johndoe@gmail.com",
      image: "",
    },
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
