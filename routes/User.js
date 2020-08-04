const express = require('express');
const userRouter = express.Router();
const passport = require('passport');
const passportConfig = require('../passport');
const JWT = require('jsonwebtoken');
const User = require('../models/User');
// const Userproducts (do it later)**

const signToken = userID => {
    return JWT.sign({
        iss : "awesomeshijie",
        sub: userID 
    }, "awesomeshijie", {expiresIn: "1h"})
}

userRouter.post('/register', (req, res) => {
    const {username, password} = req.body
    console.log(req.body)
    User.findOne({username}, (err,user) => {
        if (err){
            res.status(500).json({message: {msgbody: "Error has occured!", msgError: true}})
        } else if (user){
            res.status(500).json({message: {msgbody: "Username is already taken!", msgError: true}})
        } else {
            const newUser = new User({username, password});
            newUser.save(err=> {
                if (err){
                    res.status(500).json({message: {msgbody: "Username is already taken!", msgError: true}})
                } else{
                    res.status(201).json({message: {msgbody: "Account successfully create", msgError: false}})
                }
            })
        }
    })
})

userRouter.post('/login', passport.authenticate('local', {session: false}), (req, res) => {
    if(req.isAuthenticated()){
        const {_id, username} = req.user;
        const token = signToken(_id);
        res.cookie('access_token', token, {httpOnly: true, sameSite: true});
        res.status(200).json({isAuthenticated: true, user: {username}});
    }
})

userRouter.get('/logout', passport.authenticate('jwt', {session: false}), (req, res) => {
    res.clearCookie('access_token');
    res.json({user:{username: ""}, success: true})
    
})

//user edit the items he has posted
// userRouter.post('/todo',passport.authenticate('jwt',{session : false}),(req,res)=>{
//     const todo = new Todo(req.body);
//     todo.save(err=>{
//         if(err)
//             res.status(500).json({message : {msgBody : "Error has occured", msgError: true}});
//         else{
//             req.user.todos.push(todo);
//             req.user.save(err=>{
//                 if(err)
//                     res.status(500).json({message : {msgBody : "Error has occured", msgError: true}});
//                 else
//                     res.status(200).json({message : {msgBody : "Successfully created todo", msgError : false}});
//             });
//         }
//     })
// });


// userRouter.get('/todos',passport.authenticate('jwt',{session : false}),(req,res)=>{
//     User.findById({_id : req.user._id}).populate('todos').exec((err,document)=>{
//         if(err)
//             res.status(500).json({message : {msgBody : "Error has occured", msgError: true}});
//         else{
//             res.status(200).json({todos : document.todos, authenticated : true});
//         }
//     });
// });



// userRouter.get('/admin',passport.authenticate('jwt',{session : false}),(req,res)=>{
//     if(req.user.role === 'admin'){
//         res.status(200).json({message : {msgBody : 'You are an admin', msgError : false}});
//     }
//     else
//         res.status(403).json({message : {msgBody : "You're not an admin,go away", msgError : true}});
// });

//ensures that user is still logged in if he is still autneticated. 

userRouter.get('/authenticated',passport.authenticate('jwt',{session : false}),(req,res)=>{
    const {username} = req.user;
    res.status(200).json({isAuthenticated: true, user: {username}})
});

module.exports = userRouter;