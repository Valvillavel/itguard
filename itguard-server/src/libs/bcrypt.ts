import * as bcrypt from 'bcrypt';

export const hashPassword = async (password: string, salt = 10) => {
  return await bcrypt.hash(password, salt);
};

export const comparePassword = async (
  password: string,
  hashedPassword: string,
) => {
  return await bcrypt.compare(password, hashedPassword);
};
