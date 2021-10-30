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
      <h1>getServerSideProps</h1>
      <h2>Pages</h2>
      <ul>
        <li>
          <Link href="gssp/time">
            <a>Time</a>
          </Link>
          : Get the time on the server
        </li>
        <li>
          <Link href="gssp/throw-error?error=true">
            <a>Throw Error</a>
          </Link>
          : Throw in error in the getServerSideProps function
        </li>
      </ul>
      <h2>Throw new Web.Response</h2>
      <ul>
        <li>
          <Link href="redirect?redirect=true">
            <a>Redirect</a>
          </Link>
          : Use <code>throw new Web.Response</code> to redirect in
          getServerSideProps.
        </li>
        <li>
          <Link href="redirect">
            <a>Don't Redirect</a>
          </Link>
          : Change query param so same page does not redirect
        </li>
        <li>
          <Link href="not-found?notFound=true">
            <a>Page Not Found</a>
          </Link>
          : Use <code>throw new Web.Response</code> to return a page not found
        </li>
        <li>
          <Link href="not-found">
            <a>Not Page Not Found</a>
          </Link>
          : Change query param so same page does not return page not found
        </li>
      </ul>
      <h1>API</h1>
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
