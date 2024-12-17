const express = require("express");
const { authMiddleware } = require("../middleware");
const router = express.Router();
const {User, Account} = require("../db");
const zod = require("zod");
const JWT_SECRET = require("../config");
const jwt = require("jsonwebtoken");

const updateBody = zod.object({
  password: zod.string().optional(),
  firstName: zod.string().optional(),
  lastName: zod.string().optional(),
});

router.put("/", authMiddleware, async (req, res) => {
  const { success } = updateBody.safeParse(req.body);
  if (!success) {
    res.status(411).json({
      message: "Error while updating information",
    });
  }
  await User.updateOne({ _id: req.user_id }, req.body);
  res.json({
    message: "Updated successfully",
  });
});

router.get("/bulk",async(req,res)=>{
  const name=req.query.filter||"";
  const users=await User.find({
    $or:[{
      firstName:{
        '$regex':name
      }
    },
  {
    lastName:{
      "$regex":name
    }
  }]
  })
  res.json({
    user:users.map(user=>({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      _id: user._id
    }))
  })
})


const signupSchema = zod.object({
  username: zod.string().email(),
  password: zod.string(),
  firstName: zod.string(),
  lastName: zod.string(),
});

router.post("/signup", async (req, res) => {
  const body = req.body;
  const { success } = signupSchema.safeParse(body);
  if (!success) {
    return res.json({
      message: "Email already taken/ Incorrect inputs",
    });
  }

  const existingUser = await User.findOne({
    username: body.username,
  });
  if(existingUser) {
    return res.json({
      message: "Email already taken/ Incorrect inputs",
    });
  }

  const newUser = await User.create(body);
  const user_Id=newUser._id;
  await Account.create({
    user_Id:user_Id,
    balance:1+Math.random()*10000
  })
  const token = jwt.sign(
    {
      user_id: newUser._id,
    },
    JWT_SECRET
  );
  res.json({
    message: "User Created successfully",
    jwt: token,
  });
});

const signinSchema = zod.object({
  username: zod.string().email(),
  password: zod.string(),
});

router.post("/signin", async (req, res) => {
  const { success } = signinSchema.safeParse(req.body);
  if (!success) {
    return res.status(411).json({
      message: "Error while logging in",
    });
  }

  const user = await User.findOne({
    username: req.body.username,
  });
  if (!user) {
    return res.status(411).json({
      message: "Error while logging in",
    });
  }
  const token = jwt.sign(
    {
      user_id: user._id,
    },
    JWT_SECRET
  );
  res.json({
    token: token,
  });
});

module.exports = router;
