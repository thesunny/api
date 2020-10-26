import chalk from "chalk"
import jsome from "jsome"

export const log = {
  request(id: number, props: any) {
    console.log(chalk.hex("32cd32")(`== Request (${id}) ==`))
    jsome(props)
  },
  response(id: number, diff: number, response: any) {
    console.log(chalk.hex("32cd32")(`== Response (${id}) ${diff}ms ==`))
    jsome(response)
  },
  error(id: number, error: Error) {
    console.log(chalk.hex("b22222")(`== Error (${id}) ==`))
    if (error.stack == null) return
    error.stack.split("\n").forEach((line: string) => {
      /**
       * Dim stack lines that come from `node_modules` because they are less
       * important. We want the lines from our source code to be more
       * prominent.
       */
      if (line.includes("/node_modules/")) {
        console.log(chalk.hex("800000")(line))
      } else {
        console.log(chalk.red(line))
      }
    })
  },
}
