import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { UserModel } from '../db/models/User.js';

export const registerUserService = async (body) => {
  const user = await UserModel.findOne({ email: body.email });
  if (user) {
    throw createHttpError(409, 'Email is used');
  }
  const inCryptedPassword = await bcrypt.hash(body.password, 10);
  return await UserModel.create({ ...body, password: inCryptedPassword });
};
