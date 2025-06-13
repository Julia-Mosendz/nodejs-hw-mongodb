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

router.get('/', ctrlWrapper(getAllContactsController));

router.get('/:id', isValidId, ctrlWrapper(getContactByIdController));
router.post('/', validateBody(createContactSchema), ctrlWrapper(createContactController));
router.patch('/:id', isValidId, validateBody(updateContactSchema), ctrlWrapper(updateContactController));
router.delete('/:id', isValidId, ctrlWrapper(deleteContactByIdController));

export default router;
