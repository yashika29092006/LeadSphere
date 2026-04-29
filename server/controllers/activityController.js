import Activity from '../models/Activity.js';

//GET /api/activities/:entityType/:entityId
export const getActivities = async (req, res) => {
  try {
    //FILTER QUERY
    const activities = await Activity.find({
      relatedEntity: req.params.entityType,
      entityId: req.params.entityId
    }).sort({ createdAt: -1 });
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//POST /api/activities
export const createActivity = async (req, res) => {
  //GET DATA
  const { type, description, relatedEntity, entityId } = req.body;
  try {
    //save to db
    const activity = await Activity.create({
      type,
      description,
      relatedEntity,
      entityId,
      createdBy: req.user._id
    });
    res.status(201).json(activity);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
