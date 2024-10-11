const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');

// Rutas para notas
router.post('/', noteController.createNote);
router.get('/', noteController.getNotes);
// router.get('/:id', noteController.getNoteById);
router.patch('/:id', noteController.updateNote);
router.delete('/:id', noteController.deleteNote);

module.exports = router;
