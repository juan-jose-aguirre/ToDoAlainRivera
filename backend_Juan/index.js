const express = require("express");
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const noteRoutes = require('./routes/noteRoutes');
// const uri = "mongodb+srv://juanchitopapa1:juanchitopapa1@tareita.ckmps.mongodb.net/?retryWrites=true&w=majority&appName=tareita";
const uri = "mongodb+srv://juanchitopapa1:juanchitopapa1@tareita.ckmps.mongodb.net/?retryWrites=true&w=majority&appName=tareita";

const noteController = require('./controllers/noteController');


const app = express();
const PORT = 7200;

app.use(express.json());

app.use(cors({
  origin: "*",
}));

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connectToDatabase() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    console.log("Conectado a Mongo!!");
    // Send a ping to confirm a successful connection
    const db = client.db('tareita'); // Asegúrate de especificar el nombre correcto de tu base de datos
    await noteController.init(db);
  } catch (err) {
    // Ensures that the client will close when you finish/error
    console.log("Error al conectar con DB", err);
  }
}
connectToDatabase();

// Usar las rutas de notas
app.use('/api/notes', noteRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('¡Hola, mundo!');
  });
  
  // Escuchar en el puerto
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
