// Modulos
    const express = require('express');
    const handlebars = require('express-handlebars');
    const bodyParser = require('body-parser');
    const path = require('path')
    const mongoose = require('mongoose');
    const session = require('express-session');
    const flash = require('connect-flash'); //Flash é um tipo de sessao q soh carrega uma vez
    const router = express.Router();

    const app = express()
    const admin = require('./routes/admin');
    // const inicio = require('./views/layouts')

//Config
    //Sessão
        app.use(session({
            secret: 'cursodenode', //chave para gerar sessao
            receive: true,
            saveUninitialized: true
        }));
        app.use(flash()) //Flash tem que ficar abaixo da sessao
    //Middleware
        app.use((req, res, next)=>{
            res.locals.success_msg = req.flash('success_msg') //Variavel Global
            res.locals.error_msg = req.flash('error_msg') //Variavel Global
            next()
        })
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
//Rotas

app.get('/', (req,res)=>{
    res.render('layouts/index');
});
    app.use('/admin', admin);
//Outros
    const PORT = 5000
    app.listen(PORT, ()=>{
        console.log('Servidor rodando!')
    });
