const express = require('express');
const router = express.Router();

//Model externo mongoose
    const mongoose = require('mongoose'); //Importa mongoose
    require('../models/Categoria'); //Chama arquivo do model
    const Categoria = mongoose.model('categorias'); //chama func q vai passar ref do model para uma variavel

router.get('/', (req,res)=>{
    res.render('admin/index');
});

router.get('/posts', (req, res)=>{
    res.send('Pagina de postagem')
});

router.get('/categorias', (req,res)=>{
    res.render('admin/categorias')
})
router.get('/categorias/add', (req,res)=>{
    res.render('admin/addcategorias')
})

router.post('/categorias/nova', (req,res)=>{
    const novaCategoria = {
        nome: req.body.nome,
        slug: req.body.slug
    }

    new Categoria(novaCategoria).save().then(()=>{
        console.log('Categoria adicionada com sucesso!');
    }).catch((err)=>{
        console.log('Erro ao adicionar categoria' + err);
    })
})
module.exports = router;