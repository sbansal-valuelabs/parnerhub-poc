export type ClassValue = string | number | boolean | undefined | null | ClassValue[]

export function clsx(...inputs: ClassValue[]): string {
  return inputs
    .flat()
    .filter((x) => typeof x === 'string' && x.length > 0)
    .join(' ')
}
