import Deal from '../models/Deal.js';

export const getDeals = async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === 'Sales Rep') {
      filter = { assignedTo: req.user._id };
    }
    const deals = await Deal.find(filter).populate('contactId accountId').sort({ updatedAt: -1 });
    res.json(deals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Update deal stage (For Kanban drag drop)
export const updateDeal = async (req, res) => {
  const { stage, value } = req.body;
  try {
    const deal = await Deal.findById(req.params.id);
    if (!deal) return res.status(404).json({ message: 'Deal not found' });

    if (stage) deal.stage = stage;
    if (value !== undefined) deal.value = value;
    
    await deal.save();
    res.json(deal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//Create a deal
export const createDeal = async (req, res) => {
  const { title, value, stage, contactId, accountId, assignedTo } = req.body;
  try {
    const deal = await Deal.create({
      title,
      value,
      stage,
      contactId,
      accountId,
      assignedTo: req.user.role === 'Sales Rep' ? req.user._id : (assignedTo || req.user._id)
    });
    res.status(201).json(deal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
