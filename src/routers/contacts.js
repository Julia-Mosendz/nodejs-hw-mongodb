import { Router } from 'express';
import {
  createContactController,
  deleteContactByIdController,
  getAllContactsController,
  getContactByIdController,
  updateContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { createContactSchema, updateContactSchema } from '../validation/contactSchema.js';
import { isValidId } from '../middlewares/isValidId.js';

const router = Router();

router.get('/contacts', ctrlWrapper(getAllContactsController));

router.get('/contacts/:id', isValidId, ctrlWrapper(getContactByIdController));
router.post('/contacts', validateBody(createContactSchema), ctrlWrapper(createContactController));
router.patch('/contacts/:id', isValidId, validateBody(updateContactSchema), ctrlWrapper(updateContactController));
router.delete('/contacts/:id', isValidId, ctrlWrapper(deleteContactByIdController));

export default router;
