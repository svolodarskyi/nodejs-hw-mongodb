import Joi from 'joi';

export const createContactsSchema = Joi.object({
  name: Joi.string().required(),
  phoneNumber: Joi.string().required(),
  email: Joi.string().allow(null, '').optional(),
  isFavourite: Joi.boolean().optional().default(false),
  contactType: Joi.string()
    .valid('work', 'personal', 'home')
    .required()
    .default('personal'),
});

export const updateContactsSchema = Joi.object({
  name: Joi.string(),
  phoneNumber: Joi.string(),
  email: Joi.string().allow(null, ''),
  isFavourite: Joi.boolean(),
  contactType: Joi.string()
    .valid('work', 'personal', 'home')
    .default('personal'),
});
