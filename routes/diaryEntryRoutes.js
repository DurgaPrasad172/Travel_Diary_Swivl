//routes/diaryEntryRoutes.js
const express = require('express');
const router = express.Router();
const diaryEntryController = require('../controllers/diaryEntryController');
const authMiddleware = require('../middleware/authMiddleware');

// Route for creating a new diary entry
router.post('/', authMiddleware, diaryEntryController.createDiaryEntry);

// Route for fetching a diary entry by ID
router.get('/:id',authMiddleware, diaryEntryController.getDiaryEntry);

// Route for updating a diary entry by ID
router.put('/:id', authMiddleware, diaryEntryController.updateDiaryEntry);

// Route for deleting a diary entry by ID
router.delete('/:id', authMiddleware, diaryEntryController.deleteDiaryEntry);

module.exports = router;
