export default async function awaiter<T>(func: Promise<T>): Promise<[T | null, Error | null]> {
  try {
    let result: T = await func;

    return [result, null];
  } catch (e: any) {
    return [null, e]
  }
}