import createHttpError from "http-errors";
import { getAllContacts, getContactById } from "../services/contacts.js";
import { createContact } from "../services/contacts.js";
import { deleteContact } from "../services/contacts.js";
import { updateContact } from "../services/contacts.js";
import { parsePaginationParams } from "../utils/parsePaginationParams.js";
import { parseSortParams } from "../utils/parseSortParams.js";
import { parseFilterParams } from "../utils/parseFilterParams.js";
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { getEnvVar } from '../utils/getEnvVar.js';


export const getContactByIdController = async (req, res) => {
    const { contactId } = req.params;
    const userId = req.user._id.toString();
    const contact = await getContactById(contactId, userId);

    if (!contact) {
        throw createHttpError(404, 'Contact not found');
    }

    res.json({
        status: 200,
        message: 'Successfully found contact with id ${contactId}!',
        data: contact,
    });
};

export const createContactController = async (req, res, next) => {
    try {
    const userId = req.user._id.toString();
    const photo = req.file;
    let photoUrl;

    if (photo) {
      if (getEnvVar('ENABLE_CLOUDINARY') === 'true') {
        photoUrl = await saveFileToCloudinary(photo);
      } else {
        photoUrl = await saveFileToUploadDir(photo);
      }
    }

    const contactData = {
      ...req.body,
      userId,
      ...(photoUrl && { photo: photoUrl }),
    };

    const contact = await createContact(contactData);

    res.status(201).json({
      status: 201,
      message: 'Successfully created a contact!',
      data: contact,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteContactController = async (req, res, next) => {
    const { contactId } = req.params;
    const userId = req.user._id.toString();
    const contact = await deleteContact(contactId, userId);

    if (!contact) {
        next(createHttpError(404, 'Contact not found'));
        return;
    }
    res.status(204).send();
};

export const upsertContactController = async (req, res, next) => {
    const { contactId } = req.params;
    const userId = req.user._id.toString();
    const result = await updateContact(contactId, userId, req.body, {
        upsert: true,
   
    });

    if (!result) {
        next(createHttpError(404, 'Contact not found'));
        return;
    }

    const status = result.isNew ? 201 : 200;

    res.status(status).json({
        status,
        message: 'Successfully upserted a contact!',
        data: result.contact,
    });
};

export const patchContactController = async (req, res, next) => {
    const { contactId } = req.params;
    const photo = req.file;
    let photoUrl;
  
    if (photo) {
        if (getEnvVar('ENABLE_CLOUDINARY') === 'true') {
           photoUrl = await saveFileToCloudinary(photo);
        } else {
            photoUrl = await saveFileToUploadDir(photo);
        }
        req.body.photo = photoUrl;
    }
   
    const userId = req.user._id.toString();
    const result = await updateContact(contactId, userId, req.body);

    if (!result) {
        next(createHttpError(404, 'Contact not found'));
        return;
    }

    res.json({
        status: 200,
        message: 'Successfully patched a contact!',
        data: result.contact,
    });

};

export const getContactsController = async (req, res) => {
    const { page, perPage } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams(req.query);
    const filter = parseFilterParams(req.query);
    const userId = req.user._id.toString();
    const contacts = await getAllContacts({
        page,
        perPage,
        sortBy,
        sortOrder,
        filter,
        userId,
    });

    res.json({
        status: 200,
        message: 'Successfully found contacts!',
        data: contacts,
    });
};