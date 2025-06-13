import { Router } from 'express';
import userRouter from './users.js';
import contactsRouter from './contacts.js';

const router = Router();
router.use('/auth', userRouter);
router.use('/contacts', contactsRouter);

export default router;
