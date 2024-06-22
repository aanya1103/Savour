const jwt = require("jsonwebtoken");
// const otpGenerator = require("otp-generator");
// const mailService = require("../services/mailer");
const crypto = require("crypto");

const User = require("../models/userSignUp.js");
const Post = require("../models/posts.js");
const Order = require("../models/Order.jsx");
const Rating = require("../models/Ratings.jsx");
const VendorMenu = require("../models/VendorMenu.js");
const Vendor = require("../models/vendorDetails.js");
const VendorR = require("../models/vendorRequest.js");
const Payment= require("../models/Payment.js")
// const Order = require("../models/Order.jsx");
const bcrypt = require("bcryptjs");
const loginValidator = require("../validators/login-validator.js")();
const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");

const catchAsync = require("../utils/catchASync.js");

// const filterObj = require("../utils/filterObj");
// const otp = require("../Mail/otp");
const resetPassword = require("../mail/resetPassword");
// const { promisify } = require("util");

const JWT_SECRET = process.env.JWT_SECRET || "cddsfvdsfaqwderbg";

// this function will return you jwt token
const signToken = (userId) => jwt.sign({ userId }, JWT_SECRET);

// *--   HOME   --*
const home = async (req, resp) => {
  try {
    resp.status(200).send("Welcome");
  } catch (error) {
    console.log(error);
  }
};

// *--   REGISTER   --*
const register = async (req, resp, next) => {
  try {
    console.log(req.body);
    const { userid, email, contact, password } = req.body;

    // checking email existance- already registered or not

    const userExist = await User.findOne({ email });
    if (userExist) {
      console.log("user already exists");
      return resp.status(400).json({ message: "email already exists" });
    }

    // const saltRound=10;
    // const hashPassword= await bcrypt.hash(password, saltRound)

    //else creating the user
    const userCreated = await User.create({ userid, email, contact, password });

    const token = await userCreated.generateToken();

    //send mail
    const transporter = nodemailer.createTransport({
      service: "gmail", // Use `true` for port 465, `false` for all other ports
      auth: {
        user: "savour.ha@gmail.com",
        pass: "hgzu gvcm fogs kcnu",
        // "epgw tgsm lywb jdle"
      },
    });

    const message = {
      from: "savour.ha@gmail.com",
      to: email, // list of receivers
      subject: "Thank You for Registration", // Subject line
      text: "Thank You for Registering yourself at SAVOUR", // plain text body
      html: "<p>Thank You for Registering yourself at SAVOUR. <b>You can login to your account using your userid and password that you entered.</b></p>", // html body
    };
    transporter.sendMail(message, (err, info) => {
      if (err) {
        console.error("Error occurred while sending email:", err);
      } else {
        console.log("Mail Sent:", info.response);
      }
    });
    //send mail

    resp
      .status(201)
      .json({
        message: "Thank you for registering!",
        token,
        userId: userCreated._id.toString(),
      });
  } catch (er) {
    console.log(er);
  }
};

//FORGOT PASSWORD

const forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  console.log("here");
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    console.log("user exists");
    return res.status(404).json({
      status: "error",
      message: "There is no user with email address.",
    });
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  console.log(resetToken);
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
  try {
    const resetURL = `http://localhost:5000/new-password?token=${resetToken}`;
    // TODO => Send Email with this Reset URL to user's email address

    console.log(resetURL);

    let config = {
      service: "gmail",
      auth: {
        user: "savour.ha@gmail.com",
        pass: "hgzu gvcm fogs kcnu",
      },
    };
    let transporter = nodemailer.createTransport(config);
    let MailGenerator = new Mailgen({
      theme: "default",
      product: {
        name: "Mailgen",
        link: "https://mailgen.js/",
      },
    });

    let message = {
      from: "savour.ha@gmail.com",
      to: user.email,
      subject: "Reset Password",
      html: resetPassword(user.name, resetURL),
      attachments: [],
    };

    transporter.sendMail(message).then(() => {
      return res.status(201).json({
        status: "success",
        message: "Token sent to email!",
      });
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return res.status(500).json({
      message: "There was an error sending the email. Try again later!",
    });
  }
});

const resetPasswordd = catchAsync(async (req, res, next) => {
  const token = req.query.token; // Extract token from URL parameter

  // const { token} = req.body;
  // if (!token) {
  //   return res.status(400).json({
  //     status: "error",
  //     message: "Token not provided",
  //   });
  // }
  // 1) Get user based on the token
  console.log("token is:" + token);
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  console.log("hashed token" + hashedToken);
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  console.log("user found for reset:" + user);

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return res.status(400).json({
      status: "error",
      message: "Token is Invalid or Expired",
    });
  }
  // console.log("before password change"+req.body)
  console.log("Request Body:", JSON.stringify(req.body));
  user.password = req.body.newPassword;
  user.passwordConfirm = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  console.log("password check" + `${req.body.password}`);

  // 3) Update changedPasswordAt property for the user
  // 4) Log the user in, send JWT
  const newToken = signToken(user._id);

  res.status(200).json({
    status: "success",
    message: "Password Reseted Successfully",
    token: newToken,
  });
});

//FORGOT PASSWORD

// *--   LOGIN   --*
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(422).json({ error: "please add email or password" });

    // Validate the login input
    // const validationResult = loginValidator.parse(req.body);

    // if (!validationResult.success) {
    //     // Return validation errors
    //     return res.status(400).json({
    //     message: "Validation Error",
    //     // errors: validationResult.error.errors.map((err) => err.message),
    //     });
    // }

    const userExist = await User.findOne({ email });
    if (!userExist) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const isValidPassword = await bcrypt.compare(password, userExist.password);
    if (isValidPassword) {
      res.status(200).json({
        msg: "LOGIN DONE",
        token: await userExist.generateToken(),
        user: {
          id: userExist._id.toString(),
          email: userExist.email,
          userid: userExist.userid,
          isVendor: "false",
        },
      });
      console.log(userExist._id.toString());
    } else {
      res.status(400).json({ error: "Invalid Email or Password" });
    }
  } catch (error) {
    console.log(error);
  }

  // const {email,password} = req.body
  // if(!email || !password){
  //    return res.status(422).json({error:"please add email or password"})
  // }
  // User.findOne({email:email})
  // .then(savedUser=>{
  //     if(!savedUser){
  //        return res.status(422).json({error:"Invalid Email or password"})
  //     }
  //     bcrypt.compare(password,savedUser.password)
  //     .then(doMatch=>{
  //         if(doMatch){
  //             // res.json({message:"successfully signed in"})
  //            const token = jwt.sign({_id:savedUser._id},JWT_SECRET)
  //            const {_id,name,email,followers,following,pic} = savedUser
  //            res.json({token,user:{_id}})
  //         }
  //         else{
  //             return res.status(422).json({error:"Invalid Email or password"})
  //         }
  //     })
  //     .catch(err=>{
  //         console.log(err)
  //     })
  // })
};

// *--   CREATE POST   --*
const createpost = (req, res) => {
  const { title, body, pic, postedBy } = req.body;
  if (!title || !body || !pic || !postedBy) {
    return res.status(422).json({ error: "Post must have a body and a title" });
  }
  // req.user.password = undefined
  const post = new Post({
    title,
    body,
    photo: pic,
    postedBy: {
      id: postedBy.id,
      username: postedBy.username,
    },
  });
  post
    .save()
    .then((result) => {
      res.json({ post: result });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: error });
    });
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findOneAndDelete({
      _id: req.params.postId,
    }).populate("postedBy", "_id");
    if (!post) {
      return res.status(422).json({ error: "Post not found" });
    }
    res.json({ message: "Successfully deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const vendorrequesting = async (req, res, next) => {
  try {
    const {
      name,
      shopname,
      contact,
      alternatecontact,
      email,
      noe,
      age,
      adhar,
      pan,
      loc,
      startTime,
      endTime,
      url1,
      url2,
      userid,
      pass,
      bankName,accountNumber,ifscCode
    } = req.body;
    console.log(req.body);
    if (
      !name ||
      !shopname ||
      !contact ||
      !alternatecontact ||
      !email ||
      !noe ||
      !age ||
      !adhar ||
      !pan ||
      !url2 ||
      !url1 ||
      !bankName||
      !accountNumber||
      !ifscCode
    ) {
      return res.status(422).json({ error: "Please fill all the details" });
    }
    // req.user.password = undefined
    // const vendor= new Vendor ({
    //     name:name, shopName: shopname,contact: contact, alternateContact: alternatecontact, mail:email, numberOfEmployees: noe, age: age, adharNumber: adhar, panCard: pan, location: loc, startTime: startTime, endTime: endTime, photograph: url2, certificate: url1, userid: userid, password: pass
    // })
    // vendor.save()
    // .then(result => {
    //     res.json({ post : result });
    //     console.log("DONE");
    // })
    // .catch(error => {
    //     console.log(error);
    //     res.status(500).json({ error: error });
    // });

    const userExist = await Vendor.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "email already exists" });
    }

    // const saltRound=10;
    // const hashPassword= await bcrypt.hash(password, saltRound)

    //else creating the user
    const vendor = new VendorR({
      name: name,
      shopName: shopname,
      contact: contact,
      alternateContact: alternatecontact,
      email: email,
      numberOfEmployees: noe,
      age: age,
      adharNumber: adhar,
      panCard: pan,
      location: loc,
      startTime: startTime,
      endTime: endTime,
      photograph: url2,
      certificate: url1,
      userid: userid,
      password: pass,
      bankName:bankName,
      accountNumber:accountNumber,
      ifscCode:ifscCode
    });
    vendor.save();

    const token = await userCreated.generateToken();

    res
      .status(201)
      .json({
        message: userCreated,
        token,
        userId: userCreated._id.toString(),
      });
  } catch (er) {
    next(er);
  }
};
const loginVendor = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(422).json({ error: "please add email or password" });

    // Validate the login input
    // const validationResult = loginValidator.parse(req.body);

    // if (!validationResult.success) {
    //     // Return validation errors
    //     return res.status(400).json({
    //     message: "Validation Error",
    //     // errors: validationResult.error.errors.map((err) => err.message),
    //     });
    // }

    const userExist = await Vendor.findOne({ email });
    if (!userExist) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const isValidPassword = await bcrypt.compare(password, userExist.password);
    if (isValidPassword) {
      res.status(200).json({
        msg: "LOGIN DONE",
        token: await userExist.generateToken(),
        user: {
          id: userExist._id.toString(),
          email: userExist.email,
          userid: userExist.userid,
          isVendor: "true",
        },
      });
      console.log(userExist._id.toString());
    } else {
      res.status(400).json({ error: "Invalid Email or Password" });
    }
  } catch (error) {
    console.log(error);
  }

  // const {email,password} = req.body
  // if(!email || !password){
  //    return res.status(422).json({error:"please add email or password"})
  // }
  // User.findOne({email:email})
  // .then(savedUser=>{
  //     if(!savedUser){
  //        return res.status(422).json({error:"Invalid Email or password"})
  //     }
  //     bcrypt.compare(password,savedUser.password)
  //     .then(doMatch=>{
  //         if(doMatch){
  //             // res.json({message:"successfully signed in"})
  //            const token = jwt.sign({_id:savedUser._id},JWT_SECRET)
  //            const {_id,name,email,followers,following,pic} = savedUser
  //            res.json({token,user:{_id}})
  //         }
  //         else{
  //             return res.status(422).json({error:"Invalid Email or password"})
  //         }
  //     })
  //     .catch(err=>{
  //         console.log(err)
  //     })
  // })
};

const allpost = async (req, resp, next) => {
  await Post.find()
    .sort({ _id: -1 })
    .then((posts) => {
      resp.json({ posts });
    })
    .catch((err) => {
      next(err);
    });
};

const mypost = async (req, res) => {
  const { id, username } = req.body.postedBy;
  Post.find({ "postedBy.id": id, "postedBy.username": username })
    .sort({ _id: -1 })
    .then((mypost) => {
      res.json({ mypost });
      console.log(mypost);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Internal server error" });
    });
};

const searchuser = async (req, res, next) => {
  const { q } = req.query;
  try {
    const users = await User.find({
      $or: [
        { userid: { $regex: new RegExp(q, "i") } },
        { email: { $regex: new RegExp(q, "i") } },
        { contact: { $regex: new RegExp(q, "i") } },
      ],
    });
    res.json({ users });
  } catch (err) {
    next(err);
  }
};

const likepost = async (req, res, next) => {
  try {
    const result = await Post.findByIdAndUpdate(
      req.body.postId,
      {
        $push: { likes: req.body.userid },
      },
      {
        new: true,
      }
    );

    res.json(result);
  } catch (err) {
    console.error(err);
    return res.status(422).json({ error: err });
  }
};

const unlikepost = async (req, res, next) => {
  try {
    console.log("I am here");
    const post = await Post.findByIdAndUpdate(
      req.body.postId,
      { $pull: { likes: req.body.userid } },
      { new: true }
    );

    res.json(post);
  } catch (err) {
    console.error(err);
    return res.status(422).json({ error: err });
  }
};

// Controller to fetch liked posts of the current user
const searchuserlike = async (req, res) => {
  const userId = req.body.id; // Assuming user id is available in req.user._id

  try {
    const likedPosts = await Post.find({ likes: userId });
    res.json({ likes: likedPosts });
  } catch (err) {
    console.error("Error fetching liked posts:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// const profile = (req, res) => {
//     User.findOne({ _id: req.params.id })
//         .select("-password")
//         .then(user => {
//             if (!user) {
//                 return res.status(404).json({ error: "User not found" });
//             }

//             Post.find( { 'postedBy.id': req.params.id})
//                 .populate("postedBy", "_id email")
//                 .exec()
//                 .then(posts => {
//                     res.json({ user, posts });
//                     console.log(posts)
//                 })
//                 .catch(err => {
//                     return res.status(422).json({ error: err });
//                 });
//         })
//         .catch(err => {
//             return res.status(500).json({ error: "Internal server error" });
//         });
// }

const profile = (req, res) => {
  Vendor.findOne({ _id: req.params.id })
    .select("-password")
    .then((vendor) => {
      if (!vendor) {
        User.findOne({ _id: req.params.id })
          .select("-password")
          .then((user) => {
            if (!user) {
              return res.status(404).json({ error: "User not found" });
            }

            Post.find({ "postedBy.id": req.params.id })
              .populate("postedBy", "_id email")
              .exec()
              .then((posts) => {
                res.json({ user, posts, isVendor: "false" });
                // console.log(posts)
              })
              .catch((err) => {
                return res.status(422).json({ error: err });
              });
          })
          .catch((err) => {
            return res.status(500).json({ error: "Internal server error" });
          });
      } else {
        Post.find({ "postedBy.id": req.params.id })
          .populate("postedBy", "_id email")
          .exec()
          .then((posts) => {
            res.json({ user: vendor, posts, isVendor: "true" });
            // console.log("here")
            // console.log(vendor)
          })
          .catch((err) => {
            return res.status(422).json({ error: err });
          });
      }
    })
    .catch((err) => {
      return res.status(500).json({ error: "Internal server error" });
    });
};

const allOrders = async (req, resp, next) => {
  //  .populate("postedBy", "_id name").
  await Order.find()
    .then((orders) => {
      resp.json({ orders });
    })
    .catch((err) => {
      next(err);
    });
};

// const myOrders = async (req, res) => {
//     const { id } = req.body;
//     try {
//         const myorders = await Order.find({ "vendorId": id });
//         res.json({ myorders });
//         console.log(myorders);
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({ error: "Internal server error" });
//     }
// };

const oldOrders = async (req, res) => {
  const { id } = req.body;
  try {
    const myorders = await Order.find({
      vendorId: id,
      status: { $in: ["delivered", "completed"] },
    }).sort({ _id: -1 });
    const ordersWithItemNames = await Promise.all(
      myorders.map(async (order) => {
        const itemNames = await Promise.all(
          order.itemId.map(async (itemId) => {
            const item = await VendorMenu.findById(itemId);
            return item ? item.item : null;
          })
        );
        return { ...order._doc, itemNames };
      })
    );
    res.json({ myorders: ordersWithItemNames });
    console.log(ordersWithItemNames);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const myOrders = async (req, res) => {
  const { id } = req.body;
  try {
    const myorders = await Order.find({
      vendorId: id,
      status: { $in: ["paid", "accepted"] },
    }).sort({ _id: -1 });
    const ordersWithItemNames = await Promise.all(
      myorders.map(async (order) => {
        const itemNames = await Promise.all(
          order.itemId.map(async (itemId) => {
            const item = await VendorMenu.findById(itemId);
            return item ? item.item : null;
          })
        );
        return { ...order._doc, itemNames };
      })
    );
    res.json({ myorders: ordersWithItemNames });
    console.log(ordersWithItemNames);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const myPendingOrders = async (req, res) => {
  const { id } = req.body;
  try {
    const myorders = await Order.find({ vendorId: id, status: "placed" }).sort({
      _id: -1,
    });
    const ordersWithItemNames = await Promise.all(
      myorders.map(async (order) => {
        const itemNames = await Promise.all(
          order.itemId.map(async (itemId) => {
            const item = await VendorMenu.findById(itemId);
            return item ? item.item : null;
          })
        );
        return { ...order._doc, itemNames };
      })
    );
    res.json({ myorders: ordersWithItemNames });
    console.log(ordersWithItemNames);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const myOrdersUser = async (req, res) => {
  const { userid } = req.body;
  try {
    const myorders = await Order.find({
      userId: userid,
      status: { $in: ["delivered", "completed"] },
    }).sort({ _id: -1 });
    const ordersWithItemNames = await Promise.all(
      myorders.map(async (order) => {
        const itemNames = await Promise.all(
          order.itemId.map(async (itemId) => {
            const item = await VendorMenu.findById(itemId);
            return item ? item.item : null;
          })
        );
        return { ...order._doc, itemNames };
      })
    );
    res.json({ myorders: ordersWithItemNames });
    console.log(ordersWithItemNames);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const myPendingOrdersUser = async (req, res) => {
  const { userid } = req.body;
  try {
    const myorders = await Order.find({
      userId: userid,
      status: { $in: ["accepted", "paid accepted"] },
    }).sort({ _id: -1 });
    const ordersWithItemNames = await Promise.all(
      myorders.map(async (order) => {
        const itemNames = await Promise.all(
          order.itemId.map(async (itemId) => {
            const item = await VendorMenu.findById(itemId);
            return item ? item.item : null;
          })
        );
        return { ...order._doc, itemNames };
      })
    );
    res.json({ myorders: ordersWithItemNames });
    console.log(ordersWithItemNames);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const myCancelOrdersUser = async (req, res) => {
  const { userid } = req.body;
  try {
    const myorders = await Order.find({
      userId: userid,
      status: { $in: ["canceled", "paid canceled"] },
    }).sort({ _id: -1 });
    const ordersWithItemNames = await Promise.all(
      myorders.map(async (order) => {
        const itemNames = await Promise.all(
          order.itemId.map(async (itemId) => {
            const item = await VendorMenu.findById(itemId);
            return item ? item.item : null;
          })
        );
        return { ...order._doc, itemNames };
      })
    );
    res.json({ myorders: ordersWithItemNames });
    console.log(ordersWithItemNames);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// const myPendingOrders = async (req, res) => {
//     const { id } = req.body;
//     Order.find( { 'vendorId': id, 'status': "placed"})
//         .then(myorders => {
//             res.json({ myorders });
//             console.log('here',myorders);
//         })
//         .catch(err => {
//             console.log(err);
//             res.status(500).json({ error: "Internal server error" });
//         });
// };

const postRatings = (req, res) => {
  const { ratings, comment, vendorId, userId } = req.body;
  if (!ratings || !comment || !vendorId || !userId) {
    return res.status(422).json({ error: "Please enter all the details." });
  }
  // req.user.password = undefined
  const rating = new Rating({
    ratings,
    comment,
    vendorId,
    userId,
  });
  rating
    .save()
    .then((result) => {
      // console.log("result", result)
      res.json({ post: result });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: error });
    });
};

const getRatings = async (req, res) => {
  const id = req.body.vendorId;
  try {
    console.log(id);
    const allRatings = await Rating.find({ vendorId: id }).sort({ _id: -1 });
    res.json({ allRatings: allRatings });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

//edit menu
const getMenuItems = async (req, resp, next) => {
  try {
    console.log("here", req.body)
    const id = req.body.vendorId;
    const vendor = await VendorMenu.find({ vendorId: id });
    if (!vendor || vendor.length === 0) {
      return resp.status(404).json({ message: "No items present" });
    }
    console.log("\n\n\n\n\neg3",id);
    return resp.status(200).json(vendor);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// Add a new menu item
const addItem = async (req, res) => {
  try {
    const { item, price, category, vendorId } = req.body;
    console.log(req.body);
    const newItem = new VendorMenu({
      vendorId: vendorId,
      item: item,
      category: category,
      price: price,
    });
    await newItem.save();
    res.json(newItem);
  } catch (error) {
    console.error("Error adding item:", error);
    res.status(500).json({ error: "Error adding item" });
  }
};

// Delete a menu item
const deleteItem = async (req, res) => {
  try {
    const id = req.body.id;
    const deletedItem = await VendorMenu.findByIdAndDelete(id);
    if (!deletedItem) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).json({ error: "Error deleting item" });
  }
};

const getItemById = async (req, res) => {
  try {
    const { id } = req.params; // Extract item ID from route parameters
    console.log(id);
    const item = await VendorMenu.findById(id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json(item);
  } catch (error) {
    console.error("Error fetching item by ID:", error);
    res.status(500).json({ error: "Error fetching item" });
  }
};

// Update a menu item
const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedItem = await VendorMenu.findByIdAndUpdate(
      id,
      req.body,
      { new: true } // Ensure that the updated document is returned
    );
    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json({ message: "Item updated successfully", updatedItem });
  } catch (error) {
    console.error("Error updating item:", error);
    res.status(500).json({ error: "Error updating item" });
  }
};
//edit menu

//search

// const searchController = async (req, res) => {
//   try {
//     const searchItem = req.body.searchItem;
//     // Search for the item in VendorMenu collection
//     const regex = new RegExp(searchItem, "i"); // 'i' flag for case-insensitive matching
//     const menuItems = await VendorMenu.find({ item: regex });
//     console.log(menuItems)

//     // Prepare the response array
//     const resultArray = [];
//     for (const menuItem of menuItems) {
//       const vendorId = menuItem.vendorId;
//       // Find vendor details for the current menu item
//       const vendorDe = await Vendor.findOne({ _id: vendorId });
//       if (vendorDe) {
//         resultArray.push({
//           menuItem: {
//             _id: menuItem._id,
//             vendorId: menuItem.vendorId,
//             item: menuItem.item,
//             category: menuItem.category,
//             price: menuItem.price,
//           },
//           vendorDetails: {
//             _id: vendorDe._id,
//             name: vendorDe.name,
//             shopName: vendorDe.shopName,
//             contact: vendorDe.contact,
//             email: vendorDe.email,
//             location: vendorDe.location,
//             // Add other vendor details as needed
//           },
//         });
//       }
//     }
//     // Sort resultArray to show exact matches on top and similar matches below
//     resultArray.sort((a, b) => {
//       const aItem = a.menuItem.item.toLowerCase();
//       const bItem = b.menuItem.item.toLowerCase();
//       const aIndex = aItem.indexOf(searchItem.toLowerCase());
//       const bIndex = bItem.indexOf(searchItem.toLowerCase());
//       if (aIndex === 0 && bIndex !== 0) {
//         return -1; // a is an exact match, so it should come before b
//       } else if (aIndex !== 0 && bIndex === 0) {
//         return 1; // b is an exact match, so it should come before a
//       } else {
//         return aItem.localeCompare(bItem); // sort alphabetically for similar matches
//       }
//     });

//     res.status(200).json(resultArray);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

const searchController = async (req, res) => {
  try {
    const searchItem = req.body.searchItem;
    // Search for all items in VendorMenu collection that match the searchItem
    const regex = new RegExp(searchItem, "i"); // 'i' flag for case-insensitive matching
    const menuItems = await VendorMenu.find({ item: regex }).exec();
    console.log("Menu Items Found:", menuItems);

    // Prepare the response array
    const resultArray = [];
    for (const menuItem of menuItems) {
      const vendorId = menuItem.vendorId;
      // Find vendor details for the current menu item
      const vendorDe = await Vendor.findOne({ _id: vendorId });
      if (vendorDe) {
        resultArray.push({
          menuItem: {
            _id: menuItem._id,
            vendorId: menuItem.vendorId,
            item: menuItem.item,
            category: menuItem.category,
            price: menuItem.price,
          },
          vendorDetails: {
            _id: vendorDe._id,
            name: vendorDe.name,
            shopName: vendorDe.shopName,
            contact: vendorDe.contact,
            email: vendorDe.email,
            location: vendorDe.location,
            // Add other vendor details as needed
          },
        });
      }
    }

    // Sort resultArray to show exact matches on top and similar matches below
    resultArray.sort((a, b) => {
      const aItem = a.menuItem.item.toLowerCase();
      const bItem = b.menuItem.item.toLowerCase();
      const aIndex = aItem.indexOf(searchItem.toLowerCase());
      const bIndex = bItem.indexOf(searchItem.toLowerCase());
      if (aIndex === 0 && bIndex !== 0) {
        return -1; // a is an exact match, so it should come before b
      } else if (aIndex !== 0 && bIndex === 0) {
        return 1; // b is an exact match, so it should come before a
      } else {
        return aItem.localeCompare(bItem); // sort alphabetically for similar matches
      }
    });

    res.status(200).json(resultArray);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//search

//ORDERS
const postCartData = async (req, res) => {
  const orderDataArray = req.body;
  const { AllorderId, vendorId, userId, houseNo, city, state, locality } =
    orderDataArray[0]; // Extract common data from the first order object

  // Filter out items with quantity greater than 0
  const validItems = orderDataArray.filter((item) => item.qty > 0);

  try {
    // Ensure there are valid items to create an order
    if (validItems.length === 0) {
      return res.status(400).json({ error: "No items added to the cart." });
    }

    // Extract itemId, price, and qty arrays for valid items
    const itemIdArray = validItems.map((item) => item.itemId);
    const priceArray = validItems.map((item) => item.price);
    const qtyArray = validItems.map((item) => item.qty);
    const currentDate = new Date();
    const currentTime = currentDate.toTimeString().split(" ")[0];

    let totalPrice = 0;

    for (let i = 0; i < priceArray.length; i++) {
      totalPrice = priceArray[i] * qtyArray[i] + totalPrice;
    }

    // Save the order data to the Orders collection
    const order = await Order.create({
      orderId: AllorderId,
      itemId: itemIdArray,
      price: priceArray,
      qty: qtyArray,
      vendorId: vendorId,
      userId: userId,
      status: "pending",
      totalPrice: totalPrice,
      orderDate: currentDate,
      orderTime: currentTime,
      houseNo: houseNo,
      city: city,
      state: state,
      locality: locality,
    });

    res.status(201).json({ message: "Order placed successfully!", order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to place order." });
  }
};

// Controller function to fetch order data by orderId
const getOrderById = async (req, res) => {
  const { orderId } = req.params; // Assuming orderId is passed as a route parameter

  try {
    const order = await Order.findOne({ orderId }); // Find the order by orderId using the Order model
    if (!order) {
      return res.status(404).json({ error: "Order not found." });
    }
    // Fetch item details (name and category) for each itemId in the order
    const itemDetails = [];
    for (let i = 0; i < order.itemId.length; i++) {
      const item = await VendorMenu.findById(order.itemId[i]);
      if (!item) {
        itemDetails.push({
          id: "Id not found",
          name: "Item not found",
          category: "Category not found",
          quantity: "Not found",
          price: "Not found",
          status: "Not found",
        });
      } else {
        itemDetails.push({
          id: item._id.toString(),
          name: item.item,
          category: item.category,
          quantity: order.qty[i],
          price: item.price,
          status: order.status,
        });
      }
    }
    res.status(200).json(itemDetails);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch order data." });
  }
};
// Controller function to update order data by orderId
const updateOrderById = async (req, res) => {
  const { orderId } = req.params; // Assuming orderId is passed as a route parameter
  const { houseNo, city, state, locality } = req.body; // Assuming you're sending these fields from the frontend

  try {
    const updatedOrder = await Order.findOneAndUpdate(
      { orderId },
      { $set: { houseNo, city, state, locality } },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found." });
    }

    res
      .status(200)
      .json({ message: "Order updated successfully!", updatedOrder });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update order." });
  }
};

// exports.deleteItemFromCart = async (req, res) => {
//   const { orderId, itemId } = req.params; // Assuming orderId and itemId are passed as route parameters

//   try {
//     console.log("Deleting Item from Cart...");
//     const order = await Order.findOne({ orderId }); // Find the order by orderId using the Order model
//     console.log("Order:", order);
//     console.log("ItemID", itemId);
//     if (!order) {
//       console.log("Order not found.");
//       return res.status(404).json({ error: "Order not found." });
//     }

//     // Find the item to delete within the order's items array
//     const itemToDelete = order.items.find((item) => item.itemId.toString() === itemId);
//     if (!itemToDelete) {
//       console.log("Item not found in the order.");
//       return res.status(404).json({ error: "Item not found in the order." });
//     }

//     // Remove the item from the order's items array
//     order.items = order.items.filter((item) => item.itemId.toString() !== itemId);

//     // Update totalPrice by subtracting the price of the deleted item
//     order.totalPrice -= itemToDelete.qty * itemToDelete.price;

//     console.log("Saving changes to the order...");
//     await order.save();

//     console.log("Item deleted from cart successfully!");
//     res.status(200).json({ message: "Item deleted from cart successfully!", order });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to delete item from cart." });
//   }
// };
//ORDERS

//orders update

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000);
}

const updateStatus = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const updatedStatus = req.body.status;

    // Find the order by orderId and update the isPlaced status
    const order = await Order.findOneAndUpdate(
      { orderId: orderId },
      { $set: { status: updatedStatus } },
      { new: true }
    );

    if (updatedStatus == "placed") {
      // Send email to vendor
      const order = await Order.findOne({ orderId: orderId });
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      const vendor = await Vendor.findOne({ _id: order.vendorId });
      if (!vendor) {
        return res.status(404).json({ error: "Vendor not found" });
      }

      const mailid = vendor.email;

      // Send mail
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "savour.ha@gmail.com",
          pass: "hgzu gvcm fogs kcnu",
        },
      });

      const message = {
        from: "savour.ha@gmail.com",
        to: mailid,
        subject: "IMPORTANT- Order Placed",
        text: "Order Placed",
        html: "<p>Please open your account>> Go to ORDER>> Select New Orders to view recently placed Order. <b>Hurry! Someone has placed an order.</b></p>",
      };

      transporter.sendMail(message, (err, info) => {
        if (err) {
          console.error("Error occurred while sending email:", err);
        } else {
          console.log("Mail Sent:", info.response);
        }
      });
    }

    if (updatedStatus == "canceled") {
      // Send email to user
      const order = await Order.findOne({ orderId: orderId });
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      const user = await User.findOne({ userid: order.userId });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const mailid = user.email;

      // Send mail
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "savour.ha@gmail.com",
          pass: "hgzu gvcm fogs kcnu",
        },
      });

      const message = {
        from: "savour.ha@gmail.com",
        to: mailid,
        subject: "IMPORTANT- Order Canceled",
        text: "Order Canceled",
        html: "<p>Hello! This is to inform you that your order has been canceled by the by Vendor. We apologise for the inconvenience caused. Please Check your cancel orders inbox to check the canceled order.</p>",
      };

      transporter.sendMail(message, (err, info) => {
        if (err) {
          console.error("Error occurred while sending email:", err);
        } else {
          console.log("Mail Sent:", info.response);
        }
      });
    }

    if (updatedStatus == "paid") {
      // Generate OTP
      const otp = generateOTP();

      // Update order with OTP
      const updatedOrder = await Order.findOneAndUpdate(
        { orderId: orderId },
        { $set: { otp: otp } },
        { new: true }
      );

      if (!updatedOrder) {
        return res.status(404).json({ error: "Order not found" });
      }

      const user = await User.findOne({ userid: updatedOrder.userId });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const mailid = user.email;

      // Send mail
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "savour.ha@gmail.com",
          pass: "hgzu gvcm fogs kcnu",
        },
      });

      const message = {
        from: "savour.ha@gmail.com",
        to: mailid,
        subject: "IMPORTANT- Order Canceled",
        text: "Order Confirmed!",
        html: `<p>Hello! This is to inform you that your order is being prepared by the Vendor. Kindly provide this OTP to vendor only at the time of delivery. OTP -> ${otp}</p>`,
      };

      transporter.sendMail(message, (err, info) => {
        if (err) {
          console.error("Error occurred while sending email:", err);
        } else {
          console.log("Mail Sent:", info.response);
        }
      });
    }

    if (updatedStatus == "paid canceled") {
      // Send email to user
      const order = await Order.findOne({ orderId: orderId });
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      const user = await User.findOne({ userid: order.userId });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const mailid = user.email;

      // Send mail
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "savour.ha@gmail.com",
          pass: "hgzu gvcm fogs kcnu",
        },
      });

      const message = {
        from: "savour.ha@gmail.com",
        to: mailid,
        subject: "IMPORTANT- Order Canceled",
        text: "Order Canceled",
        html: "<p>Hello! This is to inform you that your order has been canceled by the by Vendor. We apologise for the inconvenience caused. Please Check your cancel orders inbox to check the canceled order. NOTE: THE AMOUNT PAID BY YOU ON THAT ORDER WILL BE REFUNDED IN 7 WORKING DAYS, PLEASE MAKE SURE YOU HAVE ADDED YOUR BANK ACCOUNT DETAILS. To add Bank Details, Go to Profile>> Add Bank Details>> Add details>> Save</p>",
      };

      transporter.sendMail(message, (err, info) => {
        if (err) {
          console.error("Error occurred while sending email:", err);
        } else {
          console.log("Mail Sent:", info.response);
        }
      });
    }

    res.json(order);
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Failed to update order status." });
  }
};

//orders update

//save and get user's address in the database
const saveUserAddress = async (req, res) => {
  const userId = req.params.userId;
  const { houseNo, state, city, locality } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.houseNo = houseNo;
    user.state = state;
    user.city = city;
    user.locality = locality;

    await user.save();
    console.log("done");

    res.status(200).json({ message: "Address details saved successfully." });
  } catch (error) {
    console.error("Error saving address:", error);
    res.status(500).json({ message: "Failed to save address." });
  }
};

// Controller to fetch user address
const getUserAddress = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({
      houseNo: user.houseNo,
      state: user.state,
      city: user.city,
      locality: user.locality,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch address details." });
  }
};
//save and get user's address in the database

const getOrderDetailsById = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findOne({ orderId }); // Assuming your Order model has a field 'orderId'
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order details:", error);
    res.status(500).json({ error: "Failed to fetch order details" });
  }
};
//ordersupdate AANYA
const updateQuantity = async (req, res) => {
  try {
    const orderId = req.params.orderId;

    const updatedItem = req.body.cartItems;
    console.log("OrderId:", orderId);

    console.log("UpdatedItemArray:", updatedItem);

    const order = await Order.findOne({ orderId: orderId });

    if (!order) {
      console.log("order not found");
      return res.status(404).json({ message: "Order not found." });
    }

    order.itemId.forEach((item, index) => {
      const updatedCartItem = updatedItem.find(
        (updated) => updated.itemId === item.toString()
      );
      if (updatedCartItem) {
        // Update quantity and price
        order.qty[index] = updatedCartItem.qty;
        order.price[index] = updatedCartItem.price;
      } else {
        // Item not found in updatedItem, remove from order
        order.itemId.splice(index, 1);
        order.qty.splice(index, 1);
        order.price.splice(index, 1);
      }
    });

    // Recalculate total price based on updated quantities and prices
    const totalPrice = order.qty.reduce(
      (acc, qty, index) => acc + qty * order.price[index],
      0
    );
    order.totalPrice = totalPrice + 50;

    await order.save();

    res
      .status(200)
      .json({ message: "Order status and items updated successfully." });
  } catch (error) {
    console.error("Error updating order status and items:", error);
    res.status(500).json({ error: "Failed to update order status and items." });
  }
};
//orders update AANYA

//verify otp

const verifyOtp = async (req, res) => {
  try {
    const { orderId, otp } = req.body;
    console.log("here");
    // Retrieve the stored OTP for the orderId (You need to implement this logic)
    const storedOtp = await Order.findOne({ orderId: orderId });

    if (!storedOtp) {
      return res.status(400).json({ error: "Invalid OTP" });
      console.log("no user");
    }

    // Compare the OTPs
    if (otp !== storedOtp.otp) {
      console.log("no match");
      return res.status(400).json({ error: "Invalid OTP" });
    }

    // Update the order status to "delivered" (You need to implement this logic)
    await Order.updateOne({ orderId: orderId }, { status: "delivered" });

    res.json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ error: "Failed to verify OTP" });
  }
};
//controller
const reportGenerate= async (req, res) => {
  try {
    const orderId = req.params.orderId;
    // Fetch the transaction data from your database based on the orderId
    const transactionData = await Payment.findOne({ orderId });
    if (!transactionData) {
      throw new Error("Transaction data not found.");
    }
    res.status(200).json(transactionData);
  } catch (error) {
    console.error("Error fetching transaction data:", error);
    res.status(500).json({ error: "Failed to fetch transaction data." });
  }
};

module.exports = {
  getOrderDetailsById,
  home,
  register,
  login,
  forgotPassword,
  resetPasswordd,
  createpost,
  allpost,
  mypost,
  searchuser,
  likepost,
  unlikepost,
  searchuserlike,
  vendorrequesting,
  profile,
  loginVendor,
  oldOrders,
  myOrders,
  myPendingOrders,
  myOrdersUser,
  myPendingOrdersUser,
  myCancelOrdersUser,
  allOrders,
  postRatings,
  getRatings,
  getMenuItems,
  getItemById,
  addItem,
  deleteItem,
  updateItem,
  updateQuantity,
  searchController,
  postCartData,
  getOrderById,
  saveUserAddress,
  getUserAddress,
  updateOrderById,
  updateStatus,
  deletePost,
  verifyOtp,
  reportGenerate
};
