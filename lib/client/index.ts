import { Client } from "~/src/client"

export const client = Client.create(process.env.NEXT_PUBLIC_API_URL)
