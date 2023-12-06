export const load = async ({ cookies, url }) => {
  const { pathname } = url;
  
  return {
    token: !!cookies.get("token"),
    pathname,
  }
};
