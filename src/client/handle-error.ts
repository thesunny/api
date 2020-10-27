/**
 * When displaying the error in the console, we give a preamble that
 * identifies which method call this error belongs to. The error message is
 * not included because after this method is called, the error is thrown.
 *
 * The thrown error does its own logging through next.js
 *
 * @param path
 * @param props
 */
function logErrorPreamble(path: string, props: object, url: string) {
  console.log("")
  console.error(`== Error in client.call ==`)
  console.log("")
  console.log(`URL:  ${url}`)
  console.log(
    `call: Client.call(${JSON.stringify(path)}, ${JSON.stringify(props, null, 2)})`
  )
  console.log("")
}

export async function handleErrorResponse({
  path,
  url,
  props,
}: {
  path: string
  url: string
  props: any
}) {
  /**
   * If the fetch fails, the error message is in the response text.
   * This is designed into `API.method` as well as the way it normally
   * works.
   */
  logErrorPreamble(path, props, url)
}
