import { Router } from "express";
import { validateBody } from "../middlewares/validateBody.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { userLoginSchema, userRegisterSchema } from "../validation/userSchema.js";
import { loginUserController, refreshUserController, registerUserController } from "../controllers/auth.js";


const router = Router();

router.post('/register', validateBody(userRegisterSchema), ctrlWrapper(registerUserController));
router.post('/login', validateBody(userLoginSchema), ctrlWrapper(loginUserController));
router.post('/refresh', ctrlWrapper(refreshUserController));

export default router;
