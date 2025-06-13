import { registerUserService } from '../services/authService.js';

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
  res.json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: { accessToken: session.accessToken },
  });
};
