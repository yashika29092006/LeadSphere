import Account from '../models/Account.js';
//Get all accounts
export const getAccounts = async (req, res) => {
  try {
    const accounts = await Account.find({});
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 

//Create an account
export const createAccount = async (req, res) => {
  const { companyName, industry, website } = req.body;
  try {
    const account = await Account.create({ companyName, industry, website });
    res.status(201).json(account);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
