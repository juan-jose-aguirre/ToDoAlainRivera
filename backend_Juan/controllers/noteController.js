const { MongoClient, ObjectId } = require('mongodb');


// Suponiendo que ya tienes el cliente de MongoDB configurado
let client;
let notesCollection;

// Inicializa la colección de notas
async function init(db) {
  notesCollection = db.collection('notas');
}

// Crear una nota ********************************
const createNote = async (req, res) => {
    const { title, content, status } = req.body;
    // console.log("AQUIIII");
    // return;
    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required." });
    }
    try {
      const note = { title, content, status, createdAt: new Date() };
      const result = await notesCollection.insertOne(note);
      // console.log("Resultado de la inserción:", result);
      res.status(201).json({ id: result.insertedId, title, content, status });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  };

// Obtener todas las notas *******
const getNotes = async (req, res) => {
    try {
      const notes = await notesCollection.find().toArray();
      res.status(200).json(notes);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

// Obtener una nota por ID
// exports.getNoteById = async (req, res) => {
//   const id = req.params.id;
//   try {
//     const note = await notesCollection.findOne({ _id: new MongoClient.ObjectID(id) });
//     if (!note) return res.status(404).json({ message: 'Nota no encontrada' });
//     res.status(200).json(note);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// Actualizar una nota
const updateNote = async (req, res) => {
  const id = req.params.id;

  try {
    // Obtener la nota existente
    const note = await notesCollection.findOne({ _id: new ObjectId(id) });
    
    // Si no se encuentra la nota, retornar 404
    if (!note) {
      return res.status(404).json({ message: 'Nota no encontrada' });
    }

    // Cambiar el estado de la nota
    const updatedStatus = !note.status; // Cambiar de true a false o viceversa

    const result = await notesCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: updatedStatus } }
    );

    // Verificar si se realizó la actualización
    if (result.modifiedCount === 0) {
      return res.status(400).json({ message: 'No se pudo actualizar la nota' });
    }

    const updatedNote = await notesCollection.findOne({ _id: new ObjectId(id) });
    res.status(200).json(updatedNote);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Eliminar una nota ***************
const deleteNote = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await notesCollection.deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 1) {
      res.status(200).json({ message: "Nota eliminada con éxito." });
    } else {
      res.status(404).json({ message: "Nota no encontrada." });
    }
  } catch (err) {
    console.error("Error al eliminar la nota:", err);
    res.status(500).json({ message: err.message });
  }
  };

// module.exports = { init, createNote, getNotes, getNoteById, updateNote, deleteNote };
module.exports = { init, createNote, getNotes, updateNote, deleteNote };
