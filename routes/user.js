const express = require("express");
const passport = require("passport");
const Emailer = require("../utilities/sendEmail");

const crypto = require("crypto");

const router = express.Router();
const User = require("../models/user");
const accountToken = require("../models/accountTokens");
const resetAccountToken = require("../models/resetAccountToken");
const {
  englishClubs
} = require("../models/englishClub");
const catchAsync = require("../utilities/catchAsync");

const {
  Course
} = require("../models/courses");

const {
  isLoggedIn,
  checkRoles,
  isVerified,
} = require("../middlewares/userController");

const {
  checkCourseOwnership,
  checkEnglishBoardMembership,
} = require("../middlewares/courseController");

// register a user form
router.get("/register", isLoggedIn, checkRoles(["account-manager", "admin", "super-admin"]), (req, res) => {
  res.render("user/register");
});

// register user to DB
router.post("/register", isLoggedIn, checkRoles( ["account-manager", "admin", "super-admin"]), catchAsync(async (req, res) => {

  const {
    name,
    surname,
    email,
    username,
    defP,
    phoneNumber,
    gender,
    password
  } =
  req.body;
  const user = new User({
    name,
    surname,
    defP,
    email,
    phoneNumber,
    gender,
    username,
  });

const registeredUser = await User.register(user, password);
new_user_mail = registeredUser.email;
req.flash("success", "Le nouveau compte a été créé avec success");
res.render("user/welcome", {new_user_mail});
/*
  await req.login(registeredUser, async (err) => {
    if (err) {
      res.send("Something Went Wrong");
    } else {
      const redirectUrl = (await req.session.returnTo) || "/";
      delete req.session.returnTo;
      // req.flash("success", "Votre compte a été créé avec success");
      res.render("user/welcome");
    }
    
  });
  */
}));

//sending activation mail
router.get(
  "/user/send-verification-email/:new_user_mail",
  catchAsync(async (req, res) => {
    // generate a token
    const token = crypto.randomBytes(32).toString("hex");

    // add that to database
    await accountToken({
      token: token,
      email: req.params.new_user_mail
    }).save();

    let url;
    let user = await User.findOne({email: req.params.new_user_mail});
    // let firstName = req.user.surname.split(" ")[0];
    if (process.env.NODE_ENV === "production") {
      url = "https://www.afrolanguagelab.com/user/verifyemail?token=" + token;
    } else {
      url = "http://localhost:5000/user/verifyemail?token=" + token;
    }

    console.log(url);
    // send an email for verification
    await new Emailer(user, url).sendVerifyEmail();

    res.render("user/account_handler", {
      username: user.firstName,
    });
  })
);

// Verify email
router.get("/user/verifyemail", async (req, res) => {
  // grab the token
  const token = req.query.token;
  // check if token exists
  // or just send an error
  if (token) {
    const check = await accountToken.findOne({
      token: token
    });
    if (check) {
      // token verified
      // set the property of verified to true for the user
      const userData = await User.findOne({
        email: check.email
      });
      userData.isVerified = true;
      await userData.save();
      // delete the token now itself
      await accountToken.findOneAndDelete({
        token: token
      });

      res.render("user/account_verified", {userData});
/*
      await req.login(userData, (err) => {
        if (err) {
          res.render("errorpage");
        } else {
          // const redirectUrl = (await req.session.returnTo) || "/";
          // delete req.session.returnTo;
          res.render("user/account_verified", {userData});
        }
      });
      */
    }
  };
});
//   else {
//     res.render("user/account_handler", {
//       username: req.user.username,
//       verified: req.user.isVerified,
//       err: "Le lien d’activation de compte est expiré",
//       emailsent: true,
//     });
//   }
// } else {
//   // doesnt have a token
//   // I will simply redirect to profile
//   res.redirect("/register");
// }

// login user form
router.get("/login", (req, res) => {
  res.render("user/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  async (req, res) => {
    req.flash(
      "success",
      "Content de vous revoir " + req.user.username
    );
    const redirectUrl = (await req.session.returnTo) || "/";
    delete req.session.returnTo;
    res.redirect(redirectUrl);
  }
);

// logout
router.get("/logout", async (req, res) => {
  await req.logout();
  req.flash("success", `Au revoir 👋🏽 ! À la prochaine!!`);
  res.redirect("/");
});

// Password Reset link page
router.get("/reset-password", (req, res) => {
  res.render("user/password_reset")
});

// send resset password link 
router.post("/reset-password", catchAsync(async (req, res) => {
  const {
    email
  } = req.body;

  userData = await User.findOne({
    email: email
  });

  if (userData) {
    // generate a token
    const token = crypto.randomBytes(32).toString("hex");

    // add that to database
    await resetAccountToken({
      token: token,
      email: userData.email
    }).save();

    let url;
    // let firstName = userData.surname.split(" ")[0];
    if (process.env.NODE_ENV === "production") {
      url = "https://www.afrolanguagelab.com/userPassworLost/reset-password?token=" + token;
    } else {
      url = "http://localhost:5000/userPassworLost/reset-password?token=" + token;
    }
    // send an email for verification
    await new Emailer(userData, url).sendPasswordReset()

    req.flash("success", `Le lien de réinitialisation de votre mot de passe a été envoyé dans votre boîte mail.`);
    res.redirect("back");
  } else {
    req.flash("error", `Il n'existe pas de compte pour cette adresse mail.`);
    res.redirect("back");
  }

}));

// new password form 
router.get('/userPassworLost/reset-password', catchAsync(async (req, res) => {
  // grab the token
  const token = req.query.token;
  // check if token exists
  // or just send an error
  if (token) {
    const check = await resetAccountToken.findOne({
      token: token
    });
    if (check) {
      // token verified
      // set the property of verified to true for the user
      const userData = await User.findOne({
        email: check.email
      });


      // delete the token now itself
      await resetAccountToken.findOneAndDelete({
        token: token
      });
      res.render("user/resetPassword", {
        email: userData.email
      });

    }
  };

}));

// reset password 
router.post('/userPassworLost/reset-password', catchAsync(async (req, res) => {

  // find user 
  const userData = await User.findOne({
    email: req.body.email
  });

  await userData.setPassword(req.body.password);

  userData.save();

  req.flash("success", `Votre mot de passe a été réinitialisé.`);
  res.redirect("/login");

}));


// newsletter

// router.post("/newsletter", async(req, res)=>{
//     console.log(req.body);
//     req.flash("success", `your is email succesfully saved!`);
//     res.redirect("/");
// });

// Instructor route
router.get(
  "/instructordashboard",
  isLoggedIn,
  checkRoles(["instructor", "admin"]),
  (req, res) => {
    res.render("instructor");
  }
);

// user profile route
router.get(
  "/user/:id",
  isLoggedIn,
  isVerified,
  catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const user = await User.findById(id)
      .populate("coursesTaken")
      .populate("coursesGiven");
    res.render("user/userprofile", {
      user
    });
  })
);

//==========================//==========================
//   Admin Privileges  Managing students
//==========================//==========================

// Admin route
router.get(
  "/admindashboard",
  isLoggedIn,
  isVerified,
  checkRoles("admin"),
  (req, res) => {
    res.render("admindashboard");
  }
);

// adding a student to a course form
router.get(
  "/admindashboard/addstudent/new",
  isLoggedIn,
  isVerified,
  checkRoles("admin"),
  (req, res) => {
    res.render("courses/addNewStudent");
  }
);

// adding a student to a course
router.post(
  "/addstudent",
  isLoggedIn,
  isVerified,
  checkRoles(["admin", "student_manager"]),
  catchAsync(async (req, res) => {
    const {
      courseTitle,
      startDate,
      endDate,
      student
    } = req.body;

    const student_course_data = {
      courseTitle, startDate, endDate
    }

    const user = await User.findOne({
      username: student
    });
    const course = await Course.findOne({
      title: courseTitle
    });

    

    course.students.push(user);
    await course.save();

    user.specialProgram.push(student_course_data);
    await user.save();

    res.send("user successfully registered for the course");
  })
);

//==========================//==========================
//   Instrucctor Privileges  Managing courses
//==========================//==========================

// Instructor route
router.get(
  "/instructordashboard",
  isLoggedIn,
  checkRoles(["instructor", "admin"]),
  (req, res) => {
    res.render("instructor");
  }
);

//==========================//==========================
//   English club Board members privileges
//==========================//==========================

// Accessing dashboard



module.exports = router;