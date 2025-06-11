import { Router } from 'express';
import {
  createContactController,
  deleteContactByIdController,
  getAllContactsController,
  getContactByIdController,
  updateContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = Router();

router.get('/contacts', ctrlWrapper(getAllContactsController));

router.get('/contacts/:id', ctrlWrapper(getContactByIdController));
router.post('/contacts', ctrlWrapper(createContactController));
router.patch('/contacts/:id', ctrlWrapper(updateContactController));
router.delete('/contacts/:id', ctrlWrapper(deleteContactByIdController));

export default router;
