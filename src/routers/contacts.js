// src/routers/students.js

import { Router } from 'express';
import {
  createContactController,
  deleteContactController,
  getContactByIdController,
  getContactsController,
  patchContactController,
  upsertContactController,
} from '../controllers/contacts.js';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const contactRouter = Router();

contactRouter.get('/contacts', ctrlWrapper(getContactsController));

contactRouter.get(
  '/contacts/:contactId',
  ctrlWrapper(getContactByIdController),
);

contactRouter.post('/contacts', ctrlWrapper(createContactController));

contactRouter.delete('/contacts', ctrlWrapper(deleteContactController));

contactRouter.put('/contacts/:contactId', ctrlWrapper(upsertContactController));

//Від PUT методу PATCH відрізняється якраз тим, що
// ми можемо оновити якесь окреме поле, а не весь ресурс в цілому.
contactRouter.patch(
  '/contacts/:contactId',
  ctrlWrapper(patchContactController),
);

export default contactRouter;
