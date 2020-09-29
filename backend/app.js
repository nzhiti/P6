const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user');
const saucesRoutes = require('./routes/pepper');

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader("Content-Type", "text/html");
    next();
});

// Mongoose MongoDB
mongoose.connect('mongodb+srv://admin:perenoel@cluster0.842x7.gcp.mongodb.net/project6?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(bodyParser.json());
app.use('/images' , express.static(path.join(__dirname, 'images')));
app.use('/api/auth' , userRoutes);
app.use('/api/sauces' , saucesRoutes);

module.exports = app;
