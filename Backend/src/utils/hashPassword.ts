import bcrypt from "bcrypt";


export async function HashedPassword(password: string) {
  const newHashPassword = await bcrypt.hash(password, 10); 
  return newHashPassword;
}

interface Password{
  plainPassword:string,
  hashPassword:string
}

export async function decode(password: Password) {
  const isMatch = await bcrypt.compare(password.plainPassword, password.hashPassword);
  return isMatch; // true or false
}