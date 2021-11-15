import chalk from "chalk"
import jsome from "jsome"

// let logIfEnabled = console.log
let logEnabled = true

export const log = {
  enable() {
    logEnabled = true
  },
  disable() {
    logEnabled = false
  },
  request(id: number, props: any) {
    if (!logEnabled) return
    console.log(chalk.hex("32cd32")(`== Request (${id}) ==`))
    if (props) {
      jsome(props)
    }
  },
  response(id: number, diff: number, response: any) {
    if (!logEnabled) return
    console.log(chalk.hex("32cd32")(`== Response (${id}) ${diff}ms ==`))
    jsome(response)
  },
  error(id: number, error?: Error) {
    if (!logEnabled) return
    console.log(chalk.hex("b22222")(`== Error (${id}) ==`))
    if (error === undefined) return
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
