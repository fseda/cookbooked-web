export const isFieldValid = (login: string): boolean => {
  return login.length > 0;
}

export const isUsernameValid = (username: string): boolean => {
  const regex = /^(?!.*\.\.)[a-zA-Z0-9_@]*\.?[a-zA-Z0-9_@]*$/;
  return regex.test(username) && username.length > 2;
}

export const isEmailValid = (email: string): boolean => {
  const regex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return regex.test(email);
}

export const isNewPasswordValid = (password: string): boolean => {
  return password.length >= 4;
}

export const isNewPasswordConfirmValid = (password: string, passwordConfirm: string): boolean => {
  return password === passwordConfirm;
}

export const isPasswordValid = (password: string): boolean => {
  return 0 < password.length;
}