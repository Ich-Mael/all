const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Review = require("../models/comments");
const createClubDefaultContent = require("../utilities/createClubDefaultContent");
const engClub = require("../controllers/englishClub");
const catchAsync = require("../utilities/catchAsync");

const {
  isLoggedIn,
  isVerified,
  checkRoles,
} = require("../middlewares/userController");

const {
  checkProgramOwnership,
} = require("../middlewares/courseController");

const {
  checkEnglishClubMembership,
  checkEnglishBoardMembership,
} = require("../middlewares/englishClubController");

const {
  positions,
  days,
  months
} = require("../utilities/defaultData");

const {
  englishClubHub,
  englishClubMember,
  englishClubs,
} = require("../models/englishClub");


// helper functions
function removeItemOnce(arr, value) {
  let index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}


//english for everybody
router.get("/englishlang4all", (req, res) => {
  res.render("programs/englishlang4all/home");
});

router.get("/englishlang4all/free_english_lessons", (req, res) => {
  res.render("programs/englishlang4all/free_lesson");
});




/* =================================================
 *
 * Route for English Clubs
 *
 * ================================================ */

/** English hub */
router.post('/admindashboard/newEnglishClubHub', isLoggedIn,
  isVerified,
  checkRoles("admin"),
  catchAsync(engClub.createEnglishHub));


// English clubs
router.get("/englishlang4all/clubs/home", async (req, res) => {
  res.render("programs/englishlang4all/englishClubs/home");
});

//English clubs
router.get("/englishlang4all/clubs/:country/hubs", catchAsync(engClub.showCountryHubs));

// Form for a new english club
router.get(
  "/englishlang4all/clubs/:city/:hub_id/club/new",
  isLoggedIn,
  isVerified,
  checkRoles("admin"),
  catchAsync(async (req, res) => {
   const  city = req.params.city;
   const  hub_id = req.params.hub_id;

    res.render("programs/englishlang4all/englishClubs/new", {
      city,
      hub_id
    });
  }));

// English create an Englis club
router.post(
  "/englishlang4all/clubs/:city/:hub_id/club",
  isLoggedIn,
  isVerified,
  checkRoles("admin"),
  catchAsync(engClub.createEnglishClub)
);

// English create an Englis club
router.put(
  "/englishlang4all/clubs/:city/hub/:hub_id/club/:club_id/info",
  isLoggedIn,
  isVerified,
  checkRoles("admin"),
  catchAsync(engClub.englishClubInfo)
);

//show english club home page
router.get(
  "/englishlang4all/clubs/:city/hub/:hub_id/club/:club_id/home",
  catchAsync(engClub.showClubHomePage)
);

//show english club 
router.get(
  "/englishlang4all/clubs/:city/hub/:hub_id/club/:club_id",
  isLoggedIn,
  checkEnglishClubMembership,
  catchAsync(engClub.showEnglishClub)
);

// ======================================
//
//   Admin and Board members privileges
//
//========================================

// Accessing dashboard
router.get(
  "/englishlang4all/clubs/:city/hub/:hub_id/club/:club_id/board_dashboard",
  isLoggedIn,
  checkEnglishBoardMembership,
  catchAsync(async (req, res) => {
    // hub 
    const hub = await englishClubHub.findById(req.params.hub_id);


    const club = await englishClubs.findById(req.params.club_id).populate({
      path: "members",
      populate: {
        path: "clubMember",
      }
    }).populate({
      path: "members",
      populate: {
        path: "clubMemberProgress",
      }
    });

    res.render(
      "programs/englishlang4all/englishClubs/board_members_dashboard", {
      hub,
      club
    }
    );
  })
);

// Adding a student to an english club
router.post(
  "/admindashboard/englishlang4all/clubs/:city/hub/:hub_id/club/:club_id/new_member",
  isLoggedIn,
  isVerified,
  checkRoles(["admin", "account-manager"]),
  catchAsync(async (req, res) => {
    const {
      newMember,
      level,
    } = req.body;
    const user = await User.findOne({
      username: newMember
    });


    // create a new english club member
    const englishClub = await englishClubs.findById(req.params.club_id);

    const checkingMember = await englishClubMember.findOne({
      clubMember: user._id
    })

    try {
      if (checkingMember) {

        const newEngClubMember = checkingMember;

        if (englishClub.members.includes(newEngClubMember._id)) {
          req.flash("error", `${user.username} is already a member of this English club`);
          res.redirect('back');
        } else {

          englishClub.members.push(newEngClubMember._id);
          newEngClubMember.memberEnglishClubs.push(englishClub._id);

          await englishClub.save();
          await newEngClubMember.save();

          req.flash("success", `${user.username} is successfully added to this English club`);
          res.redirect('back');
        }

      } else {

        const newEngClubMember = new englishClubMember({
          clubMember: user._id,
          level,
          memberUsername: newMember
        });

        user.clubMember_id = newEngClubMember._id;

        user.isClubMember = true;
        await user.save();


        if (englishClub.members.includes(newEngClubMember._id)) {
          req.flash("error", `${user.username} is already a member of this English club`);
          res.redirect('back');
        } else {

          englishClub.members.push(newEngClubMember._id);
          newEngClubMember.memberEnglishClubs.push(englishClub._id);

          await englishClub.save();
          await newEngClubMember.save();

          req.flash("success", `${user.username} is successfully added to this English club`);
          res.redirect('back');
        }
      }
    } catch (err) {
      res.send("Something went wrong");
    }
  })
);

// Removing a member from the club 
router.post(
  "/englishlang4all/clubs/:city/hub/:hub_id/club/:club_id/member/:member_id/remove_member",
  isLoggedIn,
  isVerified,
  checkRoles(["admin", "account-manager"]),
  catchAsync(async (req, res) => {

    // Find the club
    const englishClub = await englishClubs.findById(req.params.club_id);

    // Find Club member
    const clubMember = await englishClubMember.findById(req.params.member_id);

    // Removing the member
    removeItemOnce(englishClub.members, req.params.member_id);

    removeItemOnce(clubMember.memberEnglishClubs, englishClub._id);


    await englishClub.save();
    await clubMember.save();
    res.send("Member successfuly removed!!");
  }));

// mute member
router.post(
  "/englishlang4all/clubs/:city/hub/:hub_id/club/:club_id/member/:member_id/mute_member",
  isLoggedIn,
  isVerified,
  checkRoles(["admin", "account-manager"]),
  catchAsync(async (req, res) => {

    // Find the Club
    // englishClub = await englishClubs.findById(req.params.club_id);
    const member = await englishClubMember.findById(req.params.member_id);

    if (member) {
      member.isMuted = true;
    } else {
      res.send("Member not found!");
    }

    await member.save();

    res.send("This member sucessfully muted!")
  }));

// unmute member
router.post(
  "/englishlang4all/clubs/:city/hub/:hub_id/club/:club_id/member/:member_id/unmute_member",
  isLoggedIn,
  isVerified,
  checkRoles(["admin", "account-manager"]),
  catchAsync(async (req, res) => {

    // englishClub = await englishClubs.findById(req.params.club_id);
    const member = await englishClubMember.findById(req.params.member_id);

    if (member) {
      member.isMuted = false;
    } else {
      res.send("Member not found!");
    }

    await member.save();

    res.send("This member sucessfully unmuted!")
  }));


//new board member
router.post(
  "/admindashboard/englishlang4all/clubs/:city/hub/:hub_id/club/:club_id/new_board_member",
  isLoggedIn,
  isVerified,
  checkRoles("admin"),
  catchAsync(async (req, res) => {
    const {
      newBoardMember,
      position,
    } = req.body;

    const user = await User.findOne({
      username: newBoardMember
    });

    const board = await englishClubMember.findOne({
      clubMember: user._id
    })

    englishClub = await englishClubs.findById(req.params.club_id);

    if (englishClub.boardMembers.includes(board._id)) {
      req.flash("error", `User is already a board member of this English club`);
    } else {

      await englishClub.boardMembers.push(board._id);

      board.position = position

      await board.save();

      await englishClub.save();

      req.flash("success", `User successfully added to this English club`);
    }

    res.redirect("back");
  })
);

//grading a club member
router.get(
  "/englishlang4all/clubs/:city/hub/:hub_id/club/:club_id/member/:member_id/grade",
  isLoggedIn,
  checkRoles("admin"),
  catchAsync(engClub.memberGradeForm)
);

router.post(
  "/englishlang4all/clubs/:city/hub/:hub_id/club/:club_id/member/:member_id/grade",
  isLoggedIn,
  isVerified,
  checkRoles("admin"),
  catchAsync(engClub.memberGrade)
);

// show member grade
router.get(
  "/englishlang4all/clubs/:club_id/member/:member_id/myprogress",
  isLoggedIn,
  isVerified,
  catchAsync(engClub.showMemberGrade)
);

//============================================
//
//           Upcoming event 
//
//============================================

router.post(
  "/englishlang4all/clubs/:city/hub/:hub_id/club/:club_id/board_dashboard/event",
  isLoggedIn,
  isVerified,
  checkEnglishBoardMembership,
  catchAsync(engClub.createEvent)
);


router.post(
  "/englishlang4all/clubs/:city/hub/:hub_id/club/:club_id/board_dashboard/pics",
  isLoggedIn,
  isVerified,
  checkEnglishBoardMembership,
  catchAsync(engClub.eventPic)
);



//======================================
//
//              Articles
//
//======================================

router.post(
  "/englishlang4all/clubs/:city/hub/:hub_id/club/:club_id/board_dashboard/article",
  isLoggedIn,
  isVerified,
  checkEnglishBoardMembership,
  catchAsync(engClub.createArticle)
);

//View all articles
router.get(
  "/englishlang4all/clubs/:city/hub/:hub_id/club/:club_id/board_dashboard/articles",
  isLoggedIn,
  isVerified,
  checkEnglishBoardMembership,
  catchAsync(engClub.showAllArticles)
);

//Edit article

//form
router.get(
  "/englishlang4all/clubs/:city/hub/:hub_id/club/:club_id/board_dashboard/articles/:article_id/edit",
  isLoggedIn,
  isVerified,
  checkEnglishBoardMembership,
  catchAsync(engClub.editArticleForm)
);

//Updating article data
router.put(
  "/englishlang4all/clubs/:city/hub/:hub_id/club/:club_id/board_dashboard/articles/:article_id",
  isLoggedIn,
  isVerified,
  checkEnglishBoardMembership,
  catchAsync(engClub.updateArticle)
);

//Deleting an article
router.delete(
  "/englishlang4all/clubs/:city/hub/:hub_id/club/:club_id/board_dashboard/articles/:article_id",
  isLoggedIn,
  isVerified,
  checkEnglishBoardMembership,
  catchAsync(engClub.deleteArticle)
);

// **************************** Weekly activities *****************************************

//=========================================================================================
//
//                                     Daily vocabulary
//
//=========================================================================================

// Word and idiom of the day

router.post(
  "/englishlang4all/clubs/:city/hub/:hub_id/club/:club_id/board_dashboard/dailyVocab",
  isLoggedIn,
  isVerified,
  checkEnglishBoardMembership,
  catchAsync(engClub.createDailyVocabulary)
);

router.post(
  "/englishlang4all/clubs/:city/hub/:hub_id/club/:club_id/board_dashboard/latest_dailyVocab",
  isLoggedIn,
  isVerified,
  checkEnglishBoardMembership,
  catchAsync(engClub.latestDailyVocabulary)
);


// weekly meeting
router.post(
  "/englishlang4all/clubs/:city/hub/:hub_id/club/:club_id/board_dashboard/weeklyMeeting",
  isLoggedIn,
  isVerified,
  checkEnglishBoardMembership,
  catchAsync(engClub.createMeeting)
);

// Online debate
router.post(
  "/englishlang4all/clubs/:city/hub/:hub_id/club/:club_id/board_dashboard/onlineDebate",
  isLoggedIn,
  isVerified,
  checkEnglishBoardMembership,
  catchAsync(engClub.createOnlineDebate)
);

//==============================================================
//
//                        Weekly lessons
//
//==============================================================

router.post(
  "/englishlang4all/clubs/:city/hub/:hub_id/club/:club_id/board_dashboard/videoLesson",
  isLoggedIn,
  isVerified,
  checkRoles("admin"),
  catchAsync(engClub.postLesson)
);

//View all lessons
router.get(
  "/englishlang4all/clubs/:city/hub/:hub_id/club/:club_id/board_dashboard/videoLessons",
  isLoggedIn,
  isVerified,
  checkRoles("admin"),
  catchAsync(engClub.allLessons)
);

//edit video lesson form

router.get(
  "/englishlang4all/clubs/:city/hub/:hub_id/club/:club_id/board_dashboard/videoLessons/:lesson_id/edit",
  isLoggedIn,
  isVerified,
  checkRoles("admin"),
  catchAsync(engClub.editLessonForm)
);

//Updating video lesson data
router.put(
  "/englishlang4all/clubs/:city/hub/:hub_id/club/:club_id/board_dashboard/videoLessons/:lesson_id",
  isLoggedIn,
  isVerified,
  checkRoles("admin"),
  catchAsync(engClub.updateLesson)
);



//==============================================================
//
//                        Weekly practice
//
//==============================================================

router.post(
  "/englishlang4all/clubs/:city/hub/:hub_id/club/:club_id/board_dashboard/weeklyPractice",
  isLoggedIn,
  isVerified,
  checkRoles("admin"),
  catchAsync(engClub.postWeeklyPractice)
);

//read aloud
router.get(
  "/englishlang4all/clubs/:city/hub/:hub_id/club/:club_id/readAloud/:readAloud_id",
  isLoggedIn,
  isVerified,
  checkEnglishClubMembership,
  catchAsync(engClub.readAloud)
);



//=====================================
//
//             Workers of the Months
//
//=====================================

router.post(
  "/englishlang4all/clubs/:city/hub/:hub_id/club/:club_id/board_dashboard/leadersOfMonth",
  isLoggedIn,
  isVerified,
  checkEnglishBoardMembership,
  catchAsync(engClub.leaderOM)
);

//View all the leaders of the year
router.get(
  "/englishlang4all/clubs/:city/hub/:hub_id/club/:club_id/board_dashboard/allLeaders",
  isLoggedIn,
  isVerified,
  checkEnglishBoardMembership,
  catchAsync(engClub.allLeadersOM)
);

//Edit vips of the month

router.get(
  "/englishlang4all/clubs/:city/hub/:hub_id/club/:club_id/board_dashboard/leadersOfMonth/:leader_id/edit",
  isLoggedIn,
  isVerified,
  checkEnglishBoardMembership,
  catchAsync(engClub.editLeadersOM)
);

//Updating leaders of the month
router.put(
  "/englishlang4all/clubs/:city/hub/:hub_id/club/:club_id/board_dashboard/leadersOfMonth/:leader_id/",
  isLoggedIn,
  isVerified,
  checkEnglishBoardMembership,
  catchAsync(engClub.updateLeadersOM)
);

//===========================================================
//
//             Live practice the english club
//
//===========================================================

router.post(
  "/englishlang4all/clubs/:city/hub/:hub_id/club/:club_id/board_dashboard/clubMedia",
  isLoggedIn,
  isVerified,
  checkRoles("admin"),
  catchAsync(engClub.livePractice)
);

//View all media of the year
router.get(
  "/englishlang4all/clubs/:city/hub/:hub_id/club/:club_id/board_dashboard/allClubMedia",
  isLoggedIn,
  isVerified,
  checkRoles("admin"),
  catchAsync(engClub.allLivePractice)
);

//Edit video
router.get(
  "/englishlang4all/clubs/:city/hub/:hub_id/club/:club_id/board_dashboard/clubMedia/:media_id/mediaEdit",
  isLoggedIn,
  isVerified,
  checkRoles("admin"),
  catchAsync(engClub.livePraticeEditForm)
);

//Updating videos
router.put(
  "/englishlang4all/clubs/:city/hub/:hub_id/club/:club_id/board_dashboard/clubMedia/:media_id",
  isLoggedIn,
  isVerified,
  checkRoles("admin"),
  catchAsync(engClub.updateLivePractice)
);


// Post english comment route
router.post(
  "/englishlang4all/clubs/:city/hub/:hub_id/club/:club_id/clubMedia/:media_id/comment",
  isLoggedIn, isVerified,
  checkEnglishClubMembership,
  catchAsync(engClub.postComment)
);

// delete english comment route
router.post(
  "/englishlang4all/clubs/:city/hub/:hub_id/club/:club_id/clubMedia/:media_id/comment/:comment_id/delete_comment",
  isLoggedIn, isVerified,
  checkEnglishClubMembership,
  catchAsync(engClub.deleteComment)
);



/* =================================================
 *
 *               Song Challenges
 *
 * ================================================ */

router.get(
  "/englishlang4all/lsc/song-1",
  catchAsync(async (req, res) => {
    res.render(
      "programs/englishlang4all/lsc/song-1"
    );
  })
);

router.get(
  "/englishlang4all/lsc/song123hg34ukk",
  catchAsync(async (req, res) => {
    res.render(
      "programs/englishlang4all/lsc/song-2"
    );
  })
);

router.get(
  "/englishlang4all/lsc/songr4442ttf",
  catchAsync(async (req, res) => {
    res.render(
      "programs/englishlang4all/lsc/song-3"
    );
  })
);




/* =================================================
 *
 *                Global Challenges
 *
 * ================================================ */
router.get(
  "/englishlang4all/Clubs/:club_id/grammar",
  isLoggedIn,
  isVerified,
  checkEnglishClubMembership,
  catchAsync(async (req, res) => {
    const club = await englishClubs.findById(req.params.club_id);

    res.render(
      "programs/englishlang4all/englishClubs/clubQuiz/grammarQuiz.ejs", {
      club
    }
    );
  })
);

/* =================================================
 *
 * Route for General English
 *
 * ================================================ */

//english for Everyone beginner
router.get(
  "/englishlang4all/general_english_beginner",
  isLoggedIn,
  isVerified,
  checkProgramOwnership("beginner_Eng"),
  (req, res) => {
    res.render("programs/englishlang4all/general_english_beginner");
  }
);

//english for everyone intermediate
router.get(
  "/englishlang4all/general_english_intermediate",
  isLoggedIn,
  checkProgramOwnership("beginner_eng"),
  (req, res) => {
    res.render("programs/englishlang4all/general_english_beginner");
  }
);

//english for everyone advance
router.get(
  "/englishlang4all/general_english_advance",
  isLoggedIn,
  checkProgramOwnership("beginner_eng"),
  (req, res) => {
    res.render("programs/englishlang4all/general_english_advance");
  }
);

/* =================================================
 *
 * Route for Professional English
 *
 * ================================================ */

//english for adults
router.get("/englishlang4all/adults", isLoggedIn, (req, res) => {
  res.render("programs/englishlang4all/adults");
});

/* =================================================
 *
 * Route for Kid's English
 *
 * ================================================ */

//english for kids
router.get("/englishlang4all/kids", isLoggedIn, (req, res) => {
  res.render("programs/englishlang4all/kids");
});

module.exports = router;