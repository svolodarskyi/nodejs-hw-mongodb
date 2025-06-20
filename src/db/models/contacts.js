 // src/db/models/contacts.js 

import { model, Schema } from 'mongoose';

const contactsSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: false,
      
    },
    isFavourite: {
      type: Boolean,
      required: false,
      default: false,
    },
    contactType: {
      type: String,
      enum: ['work', 'home', 'personal'],
      required: true,
      default: 'personal',
    },
    userId: { // нова властивість 
      type: Schema.Types.ObjectId, 
      ref: 'user',
      required: true,
    }, 
    photo: {type: String},
  },
  {
    timestamps: true,
    versionKey: false,
  },
);
export const ContactsCollection = model('contact', contactsSchema);