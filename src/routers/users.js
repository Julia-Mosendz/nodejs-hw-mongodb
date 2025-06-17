import { Router } from "express";
import { validateBody } from "../middlewares/validateBody.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { userLoginSchema, userRegisterSchema, userResetSchema } from "../validation/userSchema.js";
import { loginUserController, logoutUserController, refreshUserController, registerUserController, resetEmailController } from "../controllers/auth.js";


const router = Router();

router.post('/register', validateBody(userRegisterSchema), ctrlWrapper(registerUserController));
router.post('/login', validateBody(userLoginSchema), ctrlWrapper(loginUserController));
router.post('/refresh', ctrlWrapper(refreshUserController));
router.post('/logout', ctrlWrapper(logoutUserController));
router.post('/send-reset-email', validateBody(userResetSchema), ctrlWrapper(resetEmailController));

export default router;
