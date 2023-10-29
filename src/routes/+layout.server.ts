export const load = async ({ cookies }) => {
  return {
    token: cookies.get("token"),
  }
};
