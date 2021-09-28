// Modulos
    const express = require('express');
    const handlebars = require('express-handlebars');
    const bodyParser = require('body-parser');
    const path = require('path')
    const mongoose = require('mongoose');

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
        mongoose.Promise = global.Promise;
        mongoose.connect('mongodb+srv://user-01:jhDdMqBfZzNhrmWx@cluster0.g2ws4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',{
            useNewUrlParser: true
        }).then(()=>{
            console.log('Conectado ao mongoDB com sucesso')
        }).catch((err)=>{
            console.log('Erro ao se conectar com o mongoDB' + err)
        });
    //Public
        app.use(express.static(path.join(__dirname, 'public')))

// Rotas
    app.use('/admin', admin);
// Outros
    const PORT = 5000
    app.listen(PORT, ()=>{
        console.log('Servidor rodando!')
    });
