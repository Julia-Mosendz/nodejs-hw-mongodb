import {
  loginUserService,
  logoutUserService,
  refreshUserService,
  registerUserService,
  resetEmailService,
  resetPwdService,
} from '../services/authService.js';

export const registerUserController = async (req, res) => {
  const user = await registerUserService(req.body);
  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
};

export const loginUserController = async (req, res) => {
  const session = await loginUserService(req.body);
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });
  res.json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: { accessToken: session.accessToken },
  });
};

export const refreshUserController = async (req, res) => {
  const session = await refreshUserService({
    sessionId: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });
  res.json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: { accessToken: session.accessToken },
  });
};

export const logoutUserController = async (req, res) => {
  if (req.cookies.sessionId) {
    await logoutUserService(req.cookies.sessionId);
  }
  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');
  res.status(204).send();
};

export const resetEmailController = async (req, res) => {
  await resetEmailService(req.body.email);
  res.json({
    status: 200,
    message: 'Reset password email has been successfully sent.',
    data: {},
  });
};

export const resetPwdController = async (req, res) => {
  await resetPwdService(req.body);
  res.json({
    status: 200,
    message: 'Password has been successfully reset.',
    data: {},
  });
};
