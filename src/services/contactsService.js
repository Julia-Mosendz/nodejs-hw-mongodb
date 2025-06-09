import { ContactModel } from '../db/models/Contact.js';

export const getAllContactsService = async () => {
  return await ContactModel.find();
};

export const getContactByIdService = async (id) => {
  return await ContactModel.findOne({_id:id});
};
