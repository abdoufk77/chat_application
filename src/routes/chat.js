const express = require('express')
const router = express.Router()

router.get('/chat',(req,res)=>{
    res.render('chat')
})

router.post('/chat',(req,res)=>{
    const {Nom} = req.body
    
    if(Nom != ""){
        res.render('chat',{name:Nom})
    }else{
        res.redirect('back')
    }
})



module.exports = router