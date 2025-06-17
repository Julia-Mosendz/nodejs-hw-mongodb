import { ContactModel } from '../db/models/Contact.js';
import { calculatePaginationParams } from '../utils/calculatePaginationParams.js';

export const getAllContactsService = async ({
  page,
  perPage,
  sortBy = '_id',
  sortOrder = 'asc',
  userId,
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;
  const contactQuery = ContactModel.find({userId});
  const contactsCount = await ContactModel.find({userId})
    .merge(contactQuery)
    .countDocuments();
  const contacts = await contactQuery
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder })
    .exec();
  const paginationData = calculatePaginationParams(
    contactsCount,
    page,
    perPage,
  );
  return { data: contacts, ...paginationData };
};

export const getContactByIdService = async (id, userId) => {
  return await ContactModel.findOne({ _id: id, userId});
};

export const createContactService = async (data) => {
  return await ContactModel.create(data);
};

export const updateContactService = async (id, userId, data) => {
  return await ContactModel.findOneAndUpdate({ _id: id, userId }, data, { new: true });
};

export const deleteContactByIdService = async (id, userId) => {
  return await ContactModel.findOneAndDelete({ _id: id, userId});
};
