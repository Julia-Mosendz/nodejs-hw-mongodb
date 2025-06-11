import { ContactModel } from '../db/models/Contact.js';

export const getAllContactsService = async () => {
  return await ContactModel.find();
};

export const getContactByIdService = async (id) => {
  return await ContactModel.findOne({ _id: id });
};

export const createContactService = async (data) => {
  return await ContactModel.create(data);
};

export const updateContactService = async (id, data) => {
  return await ContactModel.findOneAndUpdate({_id: id }, data, {new:true});
};

export const deleteContactByIdService = async (id) => {
  return await ContactModel.findOneAndDelete({_id: id });
};