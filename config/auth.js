const localStrategy = require('passport-local').Strategy;
const  mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//Model usuário
    require('../models/Usuario');
    const Usuario = mongoose.model('usuarios')

//Esquema de autenticação
    module.exports = function (passport){
        //usernamefield = chave de autenticacao q será usado na aplicação
        passport.use(new localStrategy({usernameField: 'email'},(email, senha, done)=>{
            Usuario.findOne({email: email}).then((usuario)=>{
                if(!usuario){
                    return done(null, false, {message: 'Está conta não existe'})
                }
                
                //comparando dois valores encripitados
                bcrypt.compare(senha, usuario.senha, (erro, batem)=>{
                    if(batem){
                        return done(null, user)
                    }else{
                        return done(null, false, {message: 'Senha incorreta'})
                    }
                })
            })
        }))

        //Salvar dados do usuário em uma sessão
        passport.serializeUser((usuario, done)=>{
            done(null, usuario.id)
        })

        passport.deserializeUser((id, done)=>{
            Usuario.findById(id, (err, usuario)=>{
                done(err, usuario)
            })
        })
    }