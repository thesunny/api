/**
 * Utility to return the type that a Promise will return
 *
 * Also a good example of using infer
 */
export type Unpromise<T> = T extends Promise<infer U> ? U : never
