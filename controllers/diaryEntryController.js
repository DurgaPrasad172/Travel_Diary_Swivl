//contollers/diaryEntryController.js
const DiaryEntry = require('../models/DiaryEntry');

const diaryEntryController = {
  createDiaryEntry: async (req, res) => {
    try {
      // Extract necessary fields from request body
      const { title, description, date, location, photos,user } = req.body;

      // Create a new diary entry
      const newDiaryEntry = new DiaryEntry({
        title,
        description,
        date,
        location,
        photos,
        user// Assuming you have middleware to extract user ID from JWT token
      });

      // Save the diary entry to the database
      await newDiaryEntry.save();

      res.status(201).json({ message: 'Diary entry created successfully', diaryEntry: newDiaryEntry });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Creating diary Server Error' });
    }
  },

  getDiaryEntry: async (req, res) => {
    try {
      // Fetch diary entry by ID
      const diaryEntry = await DiaryEntry.findById(req.params.id);

      if (!diaryEntry) {
        return res.status(404).json({ message: 'Diary entry not found' });
      }

      res.json(diaryEntry);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Server Error' });
    }
  },

  updateDiaryEntry: async (req, res) => {
    try {
      // Fetch diary entry by ID
      let diaryEntry = await DiaryEntry.findById(req.params.id);

      if (!diaryEntry) {
        return res.status(404).json({ message: 'Diary entry not found' });
      }

      // Update diary entry fields
      diaryEntry.title = req.body.title || diaryEntry.title;
      diaryEntry.description = req.body.description || diaryEntry.description;
      diaryEntry.date = req.body.date || diaryEntry.date;
      diaryEntry.location = req.body.location || diaryEntry.location;
      diaryEntry.photos = req.body.photos || diaryEntry.photos;

      // Save updated diary entry to the database
      await diaryEntry.save();

      res.json({ message: 'Diary entry updated successfully', diaryEntry });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Server Error' });
    }
  },

  deleteDiaryEntry: async (req, res) => {
    try {
      // Fetch and delete diary entry by ID
      const diaryEntry = await DiaryEntry.findByIdAndDelete(req.params.id);

      if (!diaryEntry) {
        return res.status(404).json({ message: 'Diary entry not found' });
      }

      res.json({ message: 'Diary entry deleted successfully' });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Server Error' });
    }
  }
};

module.exports = diaryEntryController;
