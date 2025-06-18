import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { UserModel } from '../db/models/User.js';
import { SessionModel } from '../db/models/Session.js';
import { randomBytes } from 'crypto';
import { getEnvVar } from '../utils/getEnvVar.js';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../utils/sendMail.js';
import { SMTP, TEMPLATES_DIR } from '../constants/index.js';
import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';

export const registerUserService = async (body) => {
  const user = await UserModel.findOne({ email: body.email });
  if (user) {
    throw createHttpError(409, 'Email is used');
  }
  const inCryptedPassword = await bcrypt.hash(body.password, 10);
  return await UserModel.create({ ...body, password: inCryptedPassword });
};

export const loginUserService = async (body) => {
  const user = await UserModel.findOne({ email: body.email });
  if (!user) {
    throw createHttpError(404, 'User is not found');
  }
  const isEqual = await bcrypt.compare(body.password, user.password);
  if (!isEqual) {
    throw createHttpError(401, 'Unauthorized');
  }
  await SessionModel.deleteOne({ userId: user._id });
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');
  const accessTokenValidUntil = new Date(Date.now() + 15 * 60 * 1000);
  const refreshTokenValidUntil = new Date(Date.now() + 24 * 60 * 60 * 1000);
  return await SessionModel.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });
};

export const refreshUserService = async ({ sessionId, refreshToken }) => {
  const session = await SessionModel.findOne({ _id: sessionId, refreshToken });
  if (!session) {
    throw createHttpError(401, 'Session is not found');
  }
  if (new Date() > new Date(session.refreshTokenValidUntil)) {
    throw createHttpError(401, 'Session token is expired');
  }
  await SessionModel.deleteOne({ _id: sessionId, refreshToken });
  const accessToken = randomBytes(30).toString('base64');
  const newRefreshToken = randomBytes(30).toString('base64');
  const accessTokenValidUntil = new Date(Date.now() + 15 * 60 * 1000);
  const refreshTokenValidUntil = new Date(Date.now() + 24 * 60 * 60 * 1000);
  return await SessionModel.create({
    userId: session.userId,
    accessToken,
    refreshToken: newRefreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });
};

export const logoutUserService = async (sessionId) => {
  await SessionModel.deleteOne({ _id: sessionId });
};

export const resetEmailService = async (email) => {
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User is not found');
  }
  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    getEnvVar('JWT_SECRET'),
    {
      expiresIn: '15m',
    },
  );

  const resetPasswordTemplatePath = path.join(
    TEMPLATES_DIR,
    'reset-password-email.html',
  );

  const templateSource = (
    await fs.readFile(resetPasswordTemplatePath)
  ).toString();

  const template = handlebars.compile(templateSource);
  const html = template({
    name: user.name,
    link: `${getEnvVar('APP_DOMAIN')}/reset-password?token=${resetToken}`,
  });

  await sendEmail({
    from: getEnvVar(SMTP.SMTP_FROM),
    to: email,
    subject: 'Reset your password',
    html,
  });
};

export const resetPwdService = async (body) => {
  let entries;

  try {
    entries = jwt.verify(body.token, getEnvVar('JWT_SECRET'));
  } catch (err) {
    if (err instanceof Error) throw createHttpError(401, err.message);
    throw err;
  }
console.log ("ERROR", entries)
  const user = await UserModel.findOne({
    email: entries.email,
    _id: entries.sub,
  });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const encryptedPassword = await bcrypt.hash(body.password, 10);

  await UserModel.updateOne({ _id: user._id }, { password: encryptedPassword });
};
