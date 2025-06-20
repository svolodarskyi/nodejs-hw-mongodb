import { ContactsCollection } from '../models/contactModel.js';

const getAllContacts = async (userId, page, perPage, sortBy, sortOrder, filter) => {
    const { contactType, isFavourite } = filter;
  
    const query = { userId };
    if (contactType) query.contactType = contactType;
    if (isFavourite !== null) query.isFavourite = isFavourite;
  
    const totalItems = await ContactsCollection.countDocuments(query);
    const contacts = await ContactsCollection.find(query)
      .sort({ [sortBy]: sortOrder })
      .skip((page - 1) * perPage)
      .limit(perPage);
  
    return { contacts, totalItems };
  };
  
  const getContactById = async (contactId, userId) => {
    return ContactsCollection.findOne({ _id: contactId, userId });
  };
  
  const createContact = async (contactData) => {
    const newContact = await ContactsCollection.create(contactData);

    return newContact.toObject();
  };
  
  const updateContactById = async (contactId, userId, updateData) => {
    const updatedContact = await ContactsCollection.findOneAndUpdate(
        { _id: contactId, userId },
        updateData,
        {
          new: true,
        },
      ).lean();
    
      return updatedContact;
  };
  
  const deleteContactById = async (contactId, userId) => {
    return ContactsCollection.findByIdAndDelete({ _id: contactId, userId });
  };
  
  export default {
    getAllContacts,
    getContactById,
    createContact,
    updateContactById,
    deleteContactById,
  };