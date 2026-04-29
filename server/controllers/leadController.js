import Lead from '../models/Lead.js';
import Contact from '../models/Contact.js';
import Account from '../models/Account.js';
import Deal from '../models/Deal.js';

//Get all leads
export const getLeads = async (req, res) => {
  try {
    let filter = {};
    // Sales Reps only see their OWN leads
    if (req.user.role === 'Sales Rep') {
      filter = { assignedTo: req.user._id };
    }
    // Admins and Managers see EVERYTHING
    const leads = await Lead.find(filter).sort({ createdAt: -1 });
    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Create a new lead
export const createLead = async (req, res) => {
  const { name, email, phone, company, source, website, industry, annualRevenue, assignedTo } = req.body;
  try {
    const lead = new Lead({ 
      name, email, phone, company, source, website, industry, 
      annualRevenue: annualRevenue || 0, 
      status: 'New',
      assignedTo: req.user.role === 'Sales Rep' ? req.user._id : (assignedTo || req.user._id)
    });
    const createdLead = await lead.save();
    res.status(201).json(createdLead);
  } catch (error) {
    console.error('Lead Creation Error:', error.message);
    res.status(400).json({ message: error.message });
  }
};

export const convertLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });

    if (lead.status === 'Converted') {
      return res.status(400).json({ message: 'Lead already converted' });
    }

    // 1. Create Account
    const account = await Account.create({ 
      companyName: lead.company || 'Unknown Company',
      industry: lead.industry,
      website: lead.website,
      annualRevenue: lead.annualRevenue
    });

    // 2. Create Contact linked to Account
    const contact = await Contact.create({ 
      name: lead.name, 
      email: lead.email, 
      phone: lead.phone,
      accountId: account._id 
    });

    // 3. Create Deal linked to Contact and Account
    const deal = await Deal.create({
      title: `${lead.name} (${account.companyName}) Opportunity`,
      value: lead.annualRevenue || 0, 
      stage: 'Qualification',
      contactId: contact._id,
      accountId: account._id,
      assignedTo: req.user._id
    });

    // 4. Update Lead Status
    lead.status = 'Converted';
    await lead.save();

    res.json({ message: 'Lead converted successfully', contact, account, deal });
  } catch (error) {
    console.error('Lead Conversion Error:', error.message);
    res.status(500).json({ message: error.message });
  }
};
