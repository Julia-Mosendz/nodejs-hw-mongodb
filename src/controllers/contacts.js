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
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { getEnvVar } from '../utils/getEnvVar.js';

export const getAllContactsController = async (req, res, next) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);

  const userId = req.user._id;
  const data = await getAllContactsService({
    page,
    perPage,
    sortBy,
    sortOrder,
    userId,
  });
  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data,
  });
};

export const getContactByIdController = async (req, res, next) => {
  const userId = req.user._id;
  const data = await getContactByIdService(req.params.id, userId);
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
  const userId = req.user._id;

  const photo = req.file;

  let photoUrl;

  if (photo) {
    if (getEnvVar('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }

  const data = await createContactService({
    ...req.body,
    userId,
    photo: photoUrl,
  });
  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data,
  });
};

export const updateContactController = async (req, res, next) => {
  const userId = req.user._id;

  const photo = req.file;

  let photoUrl;

  if (photo) {
    if (getEnvVar('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }

  const data = await updateContactService(req.params.id, userId, {
    ...req.body,
    photo: photoUrl,
  });
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
  const userId = req.user._id;
  const data = await deleteContactByIdService(req.params.id, userId);
  if (!data) {
    throw createHttpError(404, 'contact is not found');
  }
  res.status(204).send();
};
