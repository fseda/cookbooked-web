export const parseToken = (rawToken: string | null): string => {
  return rawToken?.split("Bearer ")[1] ?? ""
}