import React from "react"
import Link from "next/link"

export default function Page() {
  return (
    <div>
      <style>{`
        body {
          font: 16px sans-serif;
          color: #404040;
          padding: 0 32px;
        }
        div {
          width: 480px;
        }
        li {
          margin-bottom: 8px;
        }
        html * {
          line-height: 1.4;
        }
      `}</style>
      <h2>Success</h2>
      <ul>
        <li>
          <Link href="minimal">
            <a>Minimal</a>
          </Link>
          : Just says hello world but has the getServerSideProps method and
          typing code
        </li>
        <li>
          <Link href="time">
            <a>Time</a>
          </Link>
          : Should show the time from the server. Username is round tripped from
          client back to web page.
        </li>
      </ul>
      <h2>Errors and Failures</h2>
      <ul>
        <li>
          <Link href="crash-in-api">
            <a>Crash in API</a>
          </Link>
          : Should crash on the server and the error should pass back saying
          "Crashed on sever API cal"
        </li>
        <li>
          <Link href="api-not-found">
            <a>404 on API call</a>
          </Link>
          : The client will try and access the API but the page cannot be found
          so server returns an HTML page with error 404. We parse the
          &lt;title&gt; from the HTML page and return that as the error message.
        </li>
        <li>
          <Link href="crash-in-get-props">
            <a>Crash in getServerSideProps</a>
          </Link>
          : Sample of crashing in the call to getServerSideProps.
        </li>
      </ul>
    </div>
  )
}
