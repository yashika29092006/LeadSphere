import Contact from '../models/Contact.js';

export const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find({}).populate('accountId');
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Create a contact manually
export const createContact = async (req, res) => {
  const { name, email, phone, accountId } = req.body;
  try {
    const contact = await Contact.create({ name, email, phone, accountId });
    res.status(201).json(contact);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
