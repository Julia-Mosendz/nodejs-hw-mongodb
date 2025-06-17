import { Router } from "express";
import { validateBody } from "../middlewares/validateBody.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { userLoginSchema, userRegisterSchema } from "../validation/userSchema.js";
import { loginUserController, logoutUserController, refreshUserController, registerUserController } from "../controllers/auth.js";


const router = Router();

router.post('/register', validateBody(userRegisterSchema), ctrlWrapper(registerUserController));
router.post('/login', validateBody(userLoginSchema), ctrlWrapper(loginUserController));
router.post('/refresh', ctrlWrapper(refreshUserController));
router.post('/logout', ctrlWrapper(logoutUserController));

export default router;
