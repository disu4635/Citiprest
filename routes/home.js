const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('home'); // Renderiza la vista home.ejs
});

router.get('/simularPrestamo', (req, res) => {
    res.render('simularPrestamo'); // Renderiza la vista home.ejs
});

router.get('/contactanos', (req, res) => {
    res.render('contactanos'); // Renderiza la vista home.ejs
});

router.get('/404', (req, res) => {
    res.render('404'); // Renderiza la vista home.ejs
});

module.exports = router;
