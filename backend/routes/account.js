const express=require('express')
const { authMiddleware } = require('../middleware')
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
    console.log(req.userId," and ",to);
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
// Piyush-> eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjc2MDliMzU0NDNjY2VhODY0ZWE2ZTY1IiwiaWF0IjoxNzM0Mzg0NDM3fQ.y3s8EqsnuKkGcCn-G8t5A_kajb_36oQqJAX0Y1i_I30

// Abhi-> eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjc2MDliYWM0NDNjY2VhODY0ZWE2ZTZhIiwiaWF0IjoxNzM0Mzg0NTU2fQ.EVLTKfLhY-JrwPrbq0XCNgcbkz1r7QjHD9OasOxGpYk