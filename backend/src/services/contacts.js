import Contact from "../db/models/contact.js";

export async function getContacts({
  page = 1,
  perPage = 10,
  sortBy = "name",
  sortOrder = "asc",
  filter = {},
}) {
  const limit = Number(perPage) || 10;
  const p = Number(page) || 1;
  const skip = (p - 1) * limit;

  const sort = { [sortBy]: sortOrder === "desc" ? -1 : 1 };

  const totalItems = await Contact.countDocuments(filter);
  const data = await Contact.find(filter).sort(sort).skip(skip).limit(limit);

  const totalPages = Math.max(1, Math.ceil(totalItems / limit));

  return {
    data,
    page: p,
    perPage: limit,
    totalItems,
    totalPages,
    hasPreviousPage: p > 1,
    hasNextPage: p < totalPages,
  };
}

export function getContactById(contactId) {
  return Contact.findById(contactId);
}

export function createContact(payload) {
  return Contact.create(payload);
}

export function patchContact(id, payload) {
  return Contact.findByIdAndUpdate(id, payload, { new: true });
}

export function deleteContact(id) {
  return Contact.findByIdAndDelete(id);
}
