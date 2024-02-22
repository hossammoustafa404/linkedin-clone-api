import * as bcrypt from 'bcrypt';

export const hash = async (target: string | Buffer) => {
  const salt = await bcrypt.genSalt();
  return bcrypt.hash(target, salt);
};
