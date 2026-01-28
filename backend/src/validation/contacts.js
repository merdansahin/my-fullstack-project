import * as yup from "yup";

const str = yup.string().min(3).max(20);

export const createContactSchema = yup.object({
  name: str.required(),
  phoneNumber: str.required(),
  email: yup.string().email().optional(),
  isFavourite: yup.boolean().optional(),
  contactType: yup.mixed().oneOf(["work", "home", "personal"]).required(),
});

export const patchContactSchema = yup.object({
  name: str.optional(),
  phoneNumber: str.optional(),
  email: yup.string().email().optional(),
  isFavourite: yup.boolean().optional(),
  contactType: yup.mixed().oneOf(["work", "home", "personal"]).optional(),
});
