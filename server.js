const express = require('express');
var cors = require('cors');
const { initStore } = require('./utils/store');

const userRoutes = require('./modules/users');
const idojarasRoutes = require('./modules/idojaras');

const app = express();

// Middleware-ek
app.use(cors());
app.use(express.json());  // json formátum 
app.use(express.urlencoded({ extended: true })); 


app.get('/', (_req, res) => {
    res.send('Ács Norbert 13.A - Bajai SZC Türr István Technikum');
});

app.use('/users', userRoutes);
app.use('/idojaras', idojarasRoutes);

app.listen(3000, ()=>{
    console.log(`Server listening on http://localhost:3000`);
});