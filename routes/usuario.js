const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../models/Usuario');
const Usuario = mongoose.model('usuarios');
const bcrypt = require('bcryptjs') //Criptografia hash

router.get('/registro', (req,res)=>{
    res.render('usuarios/registro')
})

router.post('/registro', (req, res)=>{ //tem o mesmo nome mas é do tipo POST
    var erros = [];
    if(!req.body.nome || !req.body.email || !req.body.senha){
        erros.push({texto: 'Favor preencher todos os campos corretamente'})
    }
    if(req.body.senha.length < 6){
        erros.push({texto: 'senha muito curta'})
    }
    if(req.body.senha != req.body.senha2){
        erros.push({texto: 'As senhas são diferentes, tente novamente!'})
    }
    if(erros.length > 0){
        res.render('usuarios/registro', {erros: erros})
    }else{
        Usuario.findOne({email: req.body.email}).then((usuario)=>{//validando email ja cadastrado
            if(usuario){
                req.flash('error_msg', 'Já existe uma conta com o e-mail informado!')
                res.redirect('/usuarios/registro')
            }else{
                const novoUsuario = new Usuario({
                    nome: req.body.nome,
                    email: req.body.email,
                    senha: req.body.senha
                })
                //Criptografando a senha
                bcrypt.genSalt(10, (erro, salt)=>{
                    bcrypt.hash(novoUsuario.senha, salt, (erro, hash)=>{
                        if(erro){
                            req.flash('error_msg', 'Houve um erro durante o salvamento do usuario!')
                            res.redirect('/')
                        }
                        novoUsuario.senha = hash

                        novoUsuario.save().then(()=>{
                            req.flash('success_msg', 'Usuário cadastrado com sucesso!')
                            res.redirect('/')
                        }).catch((err)=>{
                            req.flash('error_msg', 'Houve um erro ao criar o usuário, tente novamente')
                            res.redirect('/usuarios/registro')
                        })
                    })
                })
            }
        }).catch((err)=>{
            req.flash('error_msg', 'Houve um erro interno')
            res.redirect('/')
        })
    }
})

router.get('/login',(req, res)=>{
    res.render('usuarios/login')
})
module.exports = router;