// Modulos
    const express = require('express');
    const handlebars = require('express-handlebars');
    const bodyParser = require('body-parser');
    // const mongoose = require('mongoose');

    const app = express()
    const admin = require('./routes/admin');

// Config
    //Body Parser
        app.use(bodyParser.urlencoded({extended: true}));
        app.use(bodyParser.json());
    //Handlebars
        app.engine('handlebars', handlebars({defaultLayout: 'main'}));
        app.set('view engine', 'handlebars')
    //Mongoose

// Rotas
    app.use('/admin', admin);
// Outros
    const PORT = 5000
    app.listen(PORT, ()=>{
        console.log('Servidor rodando!')
    });
