const express = require('express');
const router = express.Router();

const mongoose = require('mongoose'); //Importa mongoose

//MODEL EXTERNO MONGOOSE
    //CATEGORIAS
        require('../models/Categoria'); //Chama arquivo do model
        const Categoria = mongoose.model('categorias'); //chama func q vai passar ref do model para uma variavel
    //POSTAGENS
        require('../models/Postagem');
        const Postagem = mongoose.model('postagens')

//ROTA INDEX ADM
    router.get('/', (req,res)=>{
        res.render('admin/index');
    });


// ## CATEGORIAS ##
    //ROTA CATEGORIAS / LISTAR
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

            //VALIDACAO MANUAL
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

//## POSTAGENS ##
    //ROTA  POSTAGENS / LISTAR
        router.get('/postagens', (req,res)=>{
            //populate recupera valores da collection categorias
            Postagem.find().lean().populate('categorias').sort({updatedAt: 'desc'}).then((postagens)=>{
                res.render('admin/postagens', {postagens: postagens})
            }).catch((err)=>{
                req.flash('error_msg', 'Houve um erro ao registrar postagem!')
                res.render('admin/postagens')
            })
            
        });

    //CARREGAR FORMULARIO POSTAGENS
        router.get('/postagens/add', (req, res)=>{
            Categoria.find().lean().then((categorias)=>{
                res.render('admin/addpostagens', {categorias: categorias})
            }).catch((err)=>{
                req.flash('error_msg', 'Houve um erro ao carregar o formulário')
                res.redirect('/admin')
            })
        });
    //ADICIONAR POSTAGENS
        router.post('/postagens/nova',(req, res)=>{

            var erros = []
            if(req.body.categoria = 0){
                erros.push({texto: 'Categoria inválida, registre uma categoria!'})
            }
            if(erros.length > 0){
                res.render('admin/addpostagens', {erros: erros})
            }else{
                const novaPostagem = {
                    titulo: req.body.titulo,
                    slug: req.body.slug,
                    descricao: req.body.descricao,
                    conteudo: req.body.conteudo,
                    categorias: req.body.categorias
                };
                new Postagem(novaPostagem).save().then(()=>{
                    req.flash('success_msg', 'Postagem criada com sucesso!')
                    res.redirect('/admin/postagens')
                }).catch((err)=>{
                    req.flash('error_msg', 'Houve um erro ao registrar postagem, tente novamente!')
                    res.redirect('/admin/postagens')
                })
            }
        });
    //EDITAR POSTAGENS
        router.get('/postagens/edit/:id', (req,res)=>{
            Postagem.findOne({_id:req.params.id}).lean().then((postagens) =>{ //Busca em sequencia 
                Categoria.find().lean().then((categorias)=>{
                    res.render('admin/editpostagens', {postagens: postagens, categorias: categorias})
                }).catch(()=>{
                    req.flash('error_msg', 'Houve um erro ao listar as categorias!')
                    res.redirect('/admin/postagens')
                })
            }).catch((err)=>{
                req.flash('error_msg', 'Houve um erro ao carregar formulário de edição')
                res.redirect('/admin/postagens')
            })

        });
        router.post('/postagens/edit',(req,res)=>{
            
            Postagem.findOne({_id: req.body.id}).then((postagens)=>{
                postagens.titulo= req.body.titulo
                postagens.slug= req.body.slug
                postagens.descricao= req.body.descricao
                postagens.conteudo= req.body.conteudo
                postagens.categorias = req.body.categorias

                postagens.save().then(()=>{
                    req.flash('success_msg', 'Postagem editada com sucesso!')
                    res.redirect('/admin/postagens')
                }).catch((err)=>{
                    req.flash('error_msg', 'Houve um erro ao editar postagem')
                    res.redirect('/admin/postagens')
                })

            }).catch((err)=>{
                req.flash('error_msg', 'Houve um erro ao editar a postagens!')
                res.redirect('/admin/postagens')
            })
        });
// ## FIM POSTAGENS ##

 module.exports = router;