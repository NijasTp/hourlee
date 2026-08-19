const express = require('express');
const router = express.Router();
const {
  getActivities,
  setProductivityWindow,
  getHistory,
  createActivity,
  stopActivity,
  updateActivity,
  deleteActivity
} = require('../controllers/activityController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getActivities);
router.post('/productivity-window', setProductivityWindow);
router.get('/history', getHistory);
router.post('/', createActivity);
router.post('/:id/stop', stopActivity);
router.patch('/:id', updateActivity);
router.delete('/:id', deleteActivity);

module.exports = router;
