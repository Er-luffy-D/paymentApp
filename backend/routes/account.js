const express=require('express')
const { authMiddleware } = require('../middlewares/AuthMiddleware')
const { Account } = require('../db')
const mongoose = require('mongoose')
const router=express.Router()

router.get("/balance",authMiddleware,async(req,res)=>{
    const account=await Account.findOne({
        user_Id:req.userId
    }) 
    res.status(200).json({
        balance: account.balance
    })
})

router.post("/transfer",authMiddleware,async (req,res)=>{
    // creating/Intializing the session
    const session= await mongoose.startSession()
    session.startTransaction()      // starts the session
    const {amount,to}=req.body

    // Check the sender account and balance before transaction
    const account=await Account.findOne({user_Id:req.userId}).session(session);     // .session is used in chaining 
    if(!account || account.balance<amount){
        await session.abortTransaction()        // Aborts the transaction if account is fraud or balance is low
        res.status(400).json({
                message: "Insufficient balance"
        })
    }

    // Checking the recievers account if it exists
    const toAccount = await Account.findOne({user_Id:to}).session(session)

    if(!toAccount){
        await session.abortTransaction()
        res.status(400).json({
                message: "Invalid account"
        })
    }
    // Now doing transactions

    await Account.updateOne({user_Id:req.userId},{$inc: {balance:-amount}} ).session(session)
    await Account.updateOne({user_Id:to},{$inc: {balance:amount}} ).session(session)

    // Commit the transaction
    await session.commitTransaction()
    res.status(200).json({
        message: "Transfer successful"
    });
})

module.exports=router


// jwt->
// Piyush-> eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjc2MWE4ODhkOWYxZTAwOTQzZmZiYmI5IiwiaWF0IjoxNzM0NDUzMzg0fQ.2MbKMWr16DRILXSOaSyqIC_GckNPwfbKz7M1_lXHfs0

// raske-> eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjc2MWE4YWRkOWYxZTAwOTQzZmZiYmJlIiwiaWF0IjoxNzM0NDUzNDIxfQ.UWxJVeOx1v-vDEa2gvio9jtPvKquY0_Fz4bSVdN4Npw