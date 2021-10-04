import { handleErrorResponse } from "./handle-error"
import { JSONObject } from "~/lib/json-types"

export namespace Client {
  /**
   * Create a client that makes calls starting with the `baseUrl`
   */
  export function create(baseUrl: string) {
    if (!baseUrl.startsWith("http://") && !baseUrl.startsWith("https://")) {
      throw new Error(`baseUrl must start with http:// or https://`)
    }
    if (baseUrl.endsWith("/")) {
      throw new Error(`baseUrl must not end in /`)
    }

    /**
     * Call an API endpoint.
     *
     * @param path string that should not start with a '/'
     * @param props JSON object
     */
    async function call<Props extends JSONObject, Response extends JSONObject>(
      path: string,
      props: Props
    ): Promise<Response> {
      if (path.startsWith("/")) throw new Error(`path must not start with /`)
      const url = `${baseUrl}/${path}`
      const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify(props),
        headers: { "Content-Type": "application/json" },
      })
      if (res.ok) {
        try {
          /**
           * If the fetch is successful, return the data as JSON.
           */
          const json = await res.json()
          return json as Response
        } catch (e) {
          // API call from Client returned non-JSON type. Should show in debug.
          throw new Error(
            `Client call expects JSON response but API response was something else instead like text`
          )
        }
      } else {
        handleErrorResponse({ path, url, props })
        const text = await res.text()
        const htmlErrorTitleMatch = text.match(/<title>(.*)<\/title>/)
        let errorTitle = htmlErrorTitleMatch ? htmlErrorTitleMatch[1] : null
        if (errorTitle) {
          /**
           * If we can extract the title from the text which is, presumably HTML,
           * then throw an error with just the title.
           *
           * NOTE: We keep the following comment as `//` so that it displays
           * in the source code listing in the browser because it is very
           * close to the `throw new Error` code.
           */
          // Response not `ok` like 404 or 403 response. Should show in debug.
          throw new Error(errorTitle)
        } else {
          /**
           * If we can't find the title, for the time being, just dump everything
           * but if it is HTML, it is going to look really messy because we will
           * be seeing unparsed HTML code.
           */
          throw new Error(text)
        }
      }
    }
    return { call }
  }
}
