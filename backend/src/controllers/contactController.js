import {
  createContact,
  getContacts,
  getContactById,
  deleteContact,
} from "../services/contacts.js";

// Yeni bir iletişim mesajı gönder
export const createContactMessage = async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const newContact = await createContact({
    // contacts servisindeki createContact'ı kullan
    name,
    email,
    message,
  });

  res
    .status(201)
    .json({ message: "Message received successfully", data: newContact });
};

// Tüm iletişim mesajlarını listele
export const getAllContactMessages = async (req, res) => {
  const contacts = await getAllContactMessagesService();
  res.status(200).json(contacts);
};

// Belirli bir iletişim mesajını getir
export const getContactMessageById = async (req, res) => {
  const contact = await getContactMessageByIdService(req.params.contactId);
  if (!contact) {
    return res.status(404).json({ message: "Contact message not found" });
  }
  res.status(200).json(contact);
};

// Bir iletişim mesajını sil
export const deleteContactMessage = async (req, res) => {
  const contact = await deleteContactMessageService(req.params.contactId);
  if (!contact) {
    return res.status(404).json({ message: "Contact message not found" });
  }
  res.status(200).json({ message: "Contact message deleted successfully" });
};
