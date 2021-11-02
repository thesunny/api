# DJ (Date Json)

DJ allows us to create a new type like JSON but allows for a `Date` type. The purpose is to allow us to easily work with database records which often contain `Date` types in them.

It works by converting any dates to `{ $date: number }` where the `number` is the number of ms since epoch as retrieved by `date.getTime()`. It does this in the method `DJ.toJsonValue`.

It reverse this in `DJ.fromJsonValue`

## DJ vs Dedate

There are two library based approaches we can take:

- Use `dedate` which converts `Date` to a `number` using the `Date.getTime()` method. On the client side, we use date libraries that expect the value to arrive as a `number`.
  - Pros:
    - No decode step required on the client so when processing the Date, we don't have to traverse all the objects/arrays looking for date encodings.
  - Cons:
    - Creating new `Date` objects on every render may cause performance issues
- Use `dj` manually with a `DJ.out` and `DJ.in` method to send data out through the Internet and decode it on the way back in.

## Sample In and Out code

Getting data out of the server in JSON safe format

```ts
// with explicit conversion using DJ
//
// Requires a `DJ.out` method call which feels messy.
export const getServerSideProps = Web.getServerSideProps(async () => {
  const user = await getUser()
  return jsend({ status: "success", data: DJ.out({ user }) })
})

// WINNER:
//
// There is DJtoJSON conversion in djsend. It's still explicit.
export const getServerSideProps = Web.getServerSideProps(async () => {
  const user = await getUser()
  return djsend({ status: "success", data: { user } })
})

// with implicit conversion in Web.getServerSideProps
export const getServerSideProps = Web.getServerSideProps(async () => {
  const user = await getUser()
  return jsend({ status: "success", data: { user } })
})

// with explicit conversion to number using dedate
export const getServerSideProps = Web.getServerSideProps(async () => {
  const user = await getUser()
  return jsend({ status: "success", data: dedate({ user }) })
})
```

Getting data into client in JSON safe format

```ts
/**
 * with explicit conversion using DJ
 *
 * ❌ Allows destructing
 * ✅ Obvious type
 *
 * 🍊 Biggest issue is:
 *   - we can't destructure
 *   - we have an extra line of code in `Web.Page`
 */
export default Web.Page<typeof getServerSideProps>((p) => {
  const { user } = DJ.in(props)
  // user
  // { name: string, at: Date }
  return (
    <p>
      User {user.name} created at {dateFormat(user.createdAt)}
    </p>
  )
})

/**
 * without conversion from dedate
 *
 * ✅ Allows destructing
 * ❌ Obvious type
 *
 * 🍊 Unclear that a value is a date. Type constraint won't work.
 */
export default Web.Page<typeof getServerSideProps>(({ user }) => {
  // user
  // { name: string, at: number }
  return (
    <p>
      User {user.name} created at {dateFormat(user.createdAt)}
    </p>
  )
})

/**
 * WINNER:
 *
 * without conversion from dj
 *
 * ✅ Allows destructing
 * ✅ Obvious type
 *
 * 🍊 This isn't bad. We have to use special date library anyways when
 *    displaying a date. Access to `ms` might even allow us to diff dates
 *    naturally. We can send the encoded date using `djsend` which is not
 *    100% explicit, but `djsend` as opposed to `jsend` gives an indication
 *    that a DJ conversion is happening. The benefit too is that non DJ values
 *    can still be used without any transformation being applied which keeps
 *    things simple.
 */
export default Web.Page<typeof getServerSideProps>(({ user }) => {
  // user
  // { name: string, at: { $date: number } }
  return (
    <p>
      User {user.name} created at {dateFormat(user.createdAt)}
    </p>
  )
})

/**
 * with implicit conversion in `Web.Page`
 *
 * ✅ Allows destructing
 * ✅ Obvious type
 *
 * 🍊 Implicit adds possibility for confusion (how did the dates change?)
 */
export default Web.Page<typeof getServerSideProps>(({ user }) => {
  // user
  // { name: string, at: Date }
  return (
    <p>
      User {user.name} created at {dateFormat(user.createdAt)}
    </p>
  )
})
```
