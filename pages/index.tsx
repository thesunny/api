import React from "react"
import Link from "next/link"

export default function Page() {
  return (
    <div>
      <ul>
        <li>
          <Link href="time">
            <a>Time</a>
          </Link>
        </li>
        <li>
          <Link href="crash">
            <a>Crash</a>
          </Link>
        </li>
        <li>
          <Link href="api-not-found">
            <a>API Not Found</a>
          </Link>
        </li>
      </ul>
    </div>
  )
}
