// Modulos
    const express = require('express');
    const handlebars = require('express-handlebars');
    const bodyParser = require('body-parser');
    const path = require('path')
    const mongoose = require('mongoose');
    const session = require('express-session');
    const flash = require('connect-flash'); //Flash é um tipo de sessao q soh carrega uma vez
    const router = express.Router();
    const passport = require('passport');

    const app = express()
    const admin = require('./routes/admin');
    const usuarios = require('./routes/usuario');


    require('./models/Postagem')
    const Postagem = mongoose.model('postagens')

    require('./models/Categoria')
    const Categoria = mongoose.model('categorias')

    require('./config/auth')(passport)

//Config
    //Sessão
        app.use(session({
            secret: 'cursodenode', //chave para gerar sessao
            receive: true,
            saveUninitialized: true
        }));

        app.use(passport.initialize());
        app.use(passport.session());

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
        Postagem.find().lean().populate('categorias').sort({updatedAt: 'desc'}).then((postagens)=>{
            res.render('index', {postagens: postagens});
        }).catch((err)=>{
            req.flash('error_msg', 'Não foi possivel carregar as postagens')
            res.redirect('/404')
        })
    });

    app.get('/postagem/:slug', (req, res)=>{
        Postagem.findOne({slug: req.params.slug}).lean().then((postagem)=>{
            if(postagem){
                res.render('postagem/index', {postagem:postagem})
            }else{
                req.flash('error_msg', 'Esta postagem não existe')
                res.redirect('/')
            }
        }).catch((err)=>{
            req.flash('error_msg', 'Houve um erro interno')
            res.redirect('/')
        })
    })

    app.get('/categorias', (req, res)=>{
        Categoria.find().lean().then((categorias)=>{
            res.render('categorias/index', {categorias: categorias})
        }).catch((err)=>{
            req.flash('error_msg', 'Houve um erro interno ao listar as categorias!')
            res.redirect('/')
        })
    });

    app.get('/categorias/:slug', (req,res)=>{
        Categoria.findOne({slug: req.params.slug}).lean().then((categorias)=>{
            if(categorias){
                Postagem.find({categorias: categorias._id}).lean().then((postagens)=>{
                    res.render('categorias/postagens', {postagens:postagens, categorias:categorias})
                }).catch((err)=>{
                    req.flash('error_msg', 'Houve um erro interno ao listar as postagens!')
                    res.redirect('/categorias')
                })
            }else{
                req.flash('error_msg', 'Categoria não encontrada!')
                res.redirect('/categorias')
            }
        }).catch((err)=>{
            req.flash('error_msg', 'Houve um erro interno ao carregar a pagina da categoria')
            res.redirect('/categorias')
        })
    })

    app.get('/404',(req, res)=>{
        res.send('ERRO 404')
    })

    app.use('/admin', admin);
    app.use('/usuarios', usuarios)

//Outros
    const PORT = 5000
    app.listen(PORT, ()=>{
        console.log('Servidor rodando!')
    });
