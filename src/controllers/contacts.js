import createHttpError from 'http-errors';
import {
  createContactService,
  deleteContactByIdService,
  getAllContactsService,
  getContactByIdService,
  updateContactService,
} from '../services/contactsService.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';

export const getAllContactsController = async (req, res, next) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);

  const data = await getAllContactsService({
    page,
    perPage,
    sortBy,
    sortOrder,
  });
  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data,
  });
};

export const getContactByIdController = async (req, res, next) => {
  const data = await getContactByIdService(req.params.id);
  if (!data) {
    throw createHttpError(404, 'contact is not found');
  }
  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data,
  });
};

export const createContactController = async (req, res, next) => {
  const data = await createContactService(req.body);
  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data,
  });
};

export const updateContactController = async (req, res, next) => {
  const data = await updateContactService(req.params.id, req.body);
  if (!data) {
    throw createHttpError(404, 'contact is not found');
  }
  res.json({
    status: 200,
    message: 'Successfully patched a contact!',
    data,
  });
};

export const deleteContactByIdController = async (req, res, next) => {
  const data = await deleteContactByIdService(req.params.id);
  if (!data) {
    throw createHttpError(404, 'contact is not found');
  }
  res.status(204).send();
};
