import * as bcrypt from 'bcryptjs';

export const hashData = async (password: string) => {
  return await bcrypt.hash(password, 10);
};

export const compareData = async (
  currentPassword: string,
  newPassword: string,
) => {
  return await bcrypt.compare(newPassword, currentPassword);
};
