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

// ## CATEGORIAS ##
    //LISTAR CATEGORIAS
        router.get('/categorias', (req,res)=>{
            Categoria.find().lean().sort({updatedAt: 'desc'}).then((categorias) => { //listar as categorias do banco
                res.render('admin/categorias', {categorias: categorias}) //passando as categorias para a página
            }).catch((err)=>{
                req.flash('error_msg', 'Houve um erro ao listar as categorias!')
                res.redirect('/admin')
            });

        });

    //ADICIONAR CATEGORIA
        router.get('/categorias/add', (req,res)=>{
            res.render('admin/addcategorias')
        })

        router.post('/categorias/nova', (req,res)=>{

            //Validação manual
            var erros = []; //Validacao alternativa if(!req.body.nome || !req.body.slug){code...}
            if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
                erros.push({texto: 'Nome inválido!'})
            };
            if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
                erros.push({texto: 'Slug inválido!'})
            };
            if(req.body.nome.length < 2){
                erros.push({texto: 'Nome da categoria é muito pequeno!'})
            };
            if(erros.length > 0){
                res.render('admin/addcategorias', {erros: erros})
            }else{
                const novaCategoria = {
                    nome: req.body.nome,
                    slug: req.body.slug
                }
            
                new Categoria(novaCategoria).save().then(()=>{
                    req.flash('success_msg', 'Categoria criada/editada com sucesso!')
                    res.redirect('/admin/categorias')
                    console.log('Categoria adicionada com sucesso!');
                }).catch((err)=>{
                    req.flash('error_msg', 'Houve um erro ao salvar categoriaz, tente novamente!')
                    res.redirect('/admin')
                    console.log('Erro ao adicionar categoria' + err);
                }) 
            };

        });

    //EDITAR CATEGORIA
        router.get('/categorias/edit/:id', (req,res)=>{
            Categoria.findOne({_id:req.params.id}).lean().then((categoria) =>{
                res.render('admin/editcategorias', {categoria: categoria})
            }).catch((err)=>{
                req.flash('error_msg', 'Esta categoria não existe')
                res.redirect('/admin/categorias')
            })

        });
        router.post('/categorias/edit',(req,res)=>{

            Categoria.findOne({_id: req.body.id}).then((categoria)=>{
                categoria.nome = req.body.nome
                categoria.slug = req.body.slug

                categoria.save().then(()=>{
                    req.flash('success_msg', 'Categoria editada com sucesso!')
                    res.redirect('/admin/categorias')
                }).catch((err)=>{
                    req.flash('error_msg', 'Houve um erro ao editar categoria')
                    res.redirect('/admin/categorias')
                })

            }).catch((err)=>{
                req.flash('error_msg', 'Houve um erro ao editar a categoria!')
                res.redirect('/admin/categorias')
            })
        });

    //DELETAR CATEGORIA
        router.post('/categorias/deletar', (req,res)=>{
            Categoria.remove({_id: req.body.id}).lean().then(()=>{
                req.flash('success_msg', 'Categoria removida com sucesso!')
                res.redirect('/admin/categorias')
            }).catch((err)=>{
                req.flash('error_msg', 'Erro ao remover categoria, tente novamente')
                res.redirect('/admin/categorias')
            })
        });
//## FIM CATEGORIAS ##

 module.exports = router;