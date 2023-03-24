const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Review = require("../models/comments");
const createClubDefaultContent = require("../utilities/createClubDefaultContent");


const {
    positions,
    days,
    months
} = require("../utilities/defaultData");

const {
    englishClubMember,
    englishClubHub,
    englishClubs,
    progressTrack,
    event,
    englishClubArticles,
    dailyVocabulary,
    clubMeeting,
    onlineDebate,
    englishClubWorkersOfMonth,
    englishWeeklyLessons,
    englishWeeklyExercises,
    englishClubMedia,
} = require("../models/englishClub");

function addEngClub(club) {

    if (club.clubType === "High-school") {
        hub.clubs.High_school.push(club._id);
    }

    if (club.clubType === "University") {
        hub.clubs.University.push(club._id);
    }

    if (club.clubType === "Company") {
        hub.clubs.Company.push(club._id);
    }

    if (club.clubType === "Private") {
        hub.clubs.Private.push(club._id);
    }

    if (club.clubType === "Professional") {
        hub.clubs.Professional.push(club._id);
    }

    if (club.clubType === "Simple") {
        hub.clubs.Simple.push(club._id);
    }
}


// helper functions
function removeItemOnce(arr, value) {
    var index = arr.indexOf(value);
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
}


async function addBoardMember(boardUsername, clubname, position) {
    boardUsername = req.body;
    const englishClub = englishClubs.findOne({
        name: clubname
    });

    // adding boad members
    const boardmember = await User.findOne({
        username: boardUsername,
    });

    englishClub.boardMembers.push(boardmember._id);
    englishClub.members.push(boardmember._id);

    await englishClub.save();

}

// English club hub
module.exports.createEnglishHub = async (req, res) => {
    const newEngClubHub = new englishClubHub(req.body.engHub);
    const focalpoint = await User.findOne({
        username: req.body.focalPoint
    });
    newEngClubHub.focalPoint = focalpoint._id;

    await newEngClubHub.save();

    res.send("new hub created");
}

module.exports.showCountryHubs = async (req, res) => {
    const hubCountry = req.params.country;

    function filterByCountry(obj) {
        if (obj.country === hubCountry) {
            return true
        }
    }
    const hubs = await englishClubHub.find({}).populate("focalPoint").populate("clubs.University").populate("clubs.High_school").populate("clubs.Company").populate("clubs.Professional").populate("clubs.Private").populate("clubs.Simple");

    let countryHubs = await hubs.filter(filterByCountry);

    res.render("programs/englishlang4all/englishClubs/showClubHub", {
        countryHubs,
        hubCountry
    });
}

// English club

module.exports.createEnglishClub = async (req, res) => {
    const englishClub = new englishClubs(req.body.englishClub);

    hub = await englishClubHub.findById(req.params.hub_id);
    // adding boad members
    const president = await User.findOne({
        username: req.body.PresidentInfo,
    });

    // create a new english club member
    const newEngClubMember = new englishClubMember({
        clubMember: president._id,
        position: "Chair Person",
        level: "B1 - Intermediate",
        isBoardMember: true
    });

    await newEngClubMember.save();


    englishClub.boardMembers.push(newEngClubMember._id);
    englishClub.members.push(newEngClubMember._id);

    await englishClub.save();

    // adding the English club to the hub
    addEngClub(englishClub);

    await hub.save();

    // Creating default content
    await createClubDefaultContent(englishClub._id);

    await englishClub.save();

    // res.send("english club created!!!");
    res.redirect(`/englishlang4all/clubs/${hub.country}/hubs`);
}

// English Club info
module.exports.englishClubInfo = async (req, res) => {
    const club = await englishClubs.findByIdAndUpdate(req.params.club_id, {
        description: req.body.englishClubDescription,
        bannerImageUrlMedium: req.body.familyPictureUrl,
        clubPresentationVideoUrl: req.body.clubPresentationVideoUrl
    });

    res.redirect('back');

}

module.exports.showClubHomePage = async (req, res) => {
    const hub = await englishClubHub.findById(req.params.hub_id);
    const club = await englishClubs
        .findById(req.params.club_id).populate("clubEvents")
        .populate({
            path: "boardMembers",
            populate: {
                path: "clubMember"
            }
        })

    res.render("programs/englishlang4all/englishClubs/clubInfoPage", {
        hub,
        club,
        positions,
        days,
        months,
    });
}

module.exports.showEnglishClub = async (req, res) => {
    const hub = await englishClubHub.findById(req.params.hub_id);
    const clubMemberInfo = await englishClubMember.findOne({
        clubMember: req.user._id
    });


    const club = await englishClubs
        .findById(req.params.club_id)
        .populate("articles")
        .populate("weeklyVideoLesson")
        .populate("workersOfMonth")
        .populate({
            path: "media",
            populate: {
                path: "mediaComments",
                populate: {
                    path: "author"
                }
            },
        })
        .populate("dailyVocab")
        .populate("weeklyMeeting")
        .populate("grammarExercise")
        .populate("vocabularyExercise")
        .populate("LSC")
        .populate("readingComprehensionExercise")
        .populate("listeningExercise")
        .populate("watchingComprehensionExercise")
        .populate("readAloudExercise")
        .populate("dictationExercise")
        .populate("onlineDebates");

    // console.log(club.description);

    res.render("programs/englishlang4all/englishClubs/show", {
        club,
        clubMemberInfo,
        hub,
        positions,
        days,
        months,
    });
};


//======================================
//             Event
//======================================

module.exports.createEvent = async (req, res) => {
    const club_id = req.params.club_id;
    const city = req.params.city;
    const hub_id = req.params.hub_id;

    const englishClub = await englishClubs.findById(club_id);
    const newEvent = new event(req.body.event);

    console.log(newEvent);

    await newEvent.save();
    englishClub.clubEvents.unshift(newEvent._id);

    await englishClub.save();

    res.redirect(`/englishlang4all/clubs/${city}/hub/${hub_id}/club/${club_id}`);
}

module.exports.eventPic = async (req, res) => {
    const club_id = req.params.club_id;
    const city = req.params.city;
    const hub_id = req.params.hub_id;

    const englishClub = await englishClubs.findById(club_id);

    englishClub.clubGallery.unshift(req.body.gallery)

    await englishClub.save();

    res.redirect(`/englishlang4all/clubs/${city}/hub/${hub_id}/club/${club_id}/home`);
}


//======================================
//             Articles
//======================================

module.exports.createArticle = async (req, res) => {
    const club_id = req.params.club_id;
    const city = req.params.city;
    const hub_id = req.params.hub_id;

    const englishClub = await englishClubs.findById(club_id);
    const article = new englishClubArticles(req.body.englishClubArticle);

    await article.save();

    englishClub.articles.unshift(article);

    await englishClub.save();

    res.redirect(`/englishlang4all/clubs/${city}/hub/${hub_id}/club/${club_id}`);
}

module.exports.showAllArticles = async (req, res) => {

    // hub 
    const hub = await englishClubHub.findById(req.params.hub_id);
    const club = await englishClubs
        .findById(req.params.club_id)
        .populate("articles");
    res.render("programs/englishlang4all/englishClubs/articles/articlesShow", {
        club,
        hub
    });
}

module.exports.editArticleForm = async (req, res) => {
    const club_id = req.params.club_id;
    const city = req.params.city;
    const hub_id = req.params.hub_id;
    const article = await englishClubArticles.findById(req.params.article_id);
    // hub 
    const hub = await englishClubHub.findById(req.params.hub_id);
    const club = await englishClubs.findById(req.params.club_id);

    res.render("programs/englishlang4all/englishClubs/articles/articleEdit", {
        article,
        hub,
        club,
    });
}

module.exports.updateArticle = async (req, res) => {
    const club_id = req.params.club_id;
    const city = req.params.city;
    const hub_id = req.params.hub_id;
    // hub 
    const hub = await englishClubHub.findById(req.params.hub_id);
    const article = await englishClubArticles.findByIdAndUpdate(
        req.params.article_id, {
        ...req.body.englishClubArticle,
    }
    );

    await article.save();

    res.redirect(`/englishlang4all/clubs/${city}/hub/${hub_id}/club/${club_id}`);
}

module.exports.deleteArticle = async (req, res) => {
    const club_id = req.params.club_id;
    const city = req.params.city;
    const hub_id = req.params.hub_id;
    const article = await englishClubArticles.findByIdAndDelete(
        req.params.article_id
    );

    res.redirect(`/englishlang4all/clubs/${city}/hub/${hub_id}/club/${club_id}`);
}



//======================================
//          Weekly Activity
//======================================

module.exports.createDailyVocabulary = async (req, res) => {
    const club_id = req.params.club_id;
    const city = req.params.city;
    const hub_id = req.params.hub_id;
    const englishClub = await englishClubs.findById(req.params.club_id);
    const newDailyVocabulary = new dailyVocabulary({
        wordOfDay: {
            ...req.body.wordOfDay,
        },
        IdiomDay: {
            ...req.body.IdiomDay,
        },
    });

    await newDailyVocabulary.save();

    englishClub.dailyVocab.unshift(newDailyVocabulary);

    await englishClub.save();

    res.redirect(`/englishlang4all/clubs/${city}/hub/${hub_id}/club/${club_id}`);
}

module.exports.createMeeting = async (req, res) => {
    const club_id = req.params.club_id;
    const city = req.params.city;
    const hub_id = req.params.hub_id;
    const englishClub = await englishClubs.findById(req.params.club_id);
    const newClubMeeting = new clubMeeting(req.body.englishClubMeeting);

    await newClubMeeting.save();

    englishClub.weeklyMeeting.unshift(newClubMeeting);

    await englishClub.save();

    res.redirect(`/englishlang4all/clubs/${city}/hub/${hub_id}/club/${club_id}`);
}

module.exports.createOnlineDebate = async (req, res) => {
    const club_id = req.params.club_id;
    const city = req.params.city;
    const hub_id = req.params.hub_id;

    const englishClub = await englishClubs.findById(club_id);
    const newOnlineDebate = new onlineDebate(req.body.OnlineDebate);

    await newOnlineDebate.save();

    englishClub.onlineDebates.unshift(newOnlineDebate);

    await englishClub.save();

    res.redirect(`/englishlang4all/clubs/${city}/hub/${hub_id}/club/${club_id}`);
}



//======================================
//       Weekly Lessons 
//======================================

module.exports.postLesson = async (req, res) => {
    const club_id = req.params.club_id;
    const city = req.params.city;
    const hub_id = req.params.hub_id;


    const englishClub = await englishClubs.findById(club_id);

    const newVideoLesson = new englishWeeklyLessons(req.body.weeklyLesson);
    await newVideoLesson.save();

    englishClub.weeklyVideoLesson.unshift(newVideoLesson);

    await englishClub.save();

    res.redirect(`/englishlang4all/clubs/${city}/hub/${hub_id}/club/${club_id}`);
};

module.exports.allLessons = async (req, res) => {
    const club_id = req.params.club_id;
    const hub = await englishClubHub.findById(req.params.hub_id);

    const club = await englishClubs
        .findById(club_id)
        .populate("weeklyVideoLesson");
    res.render(
        "programs/englishlang4all/englishClubs/videoLessons/videoLessonsShow", {
        club,
        hub,
    }
    );
};

module.exports.editLessonForm = async (req, res) => {
    const hub = await englishClubHub.findById(req.params.hub_id);
    const videoLesson = await englishWeeklyLessons.findById(
        req.params.lesson_id
    );
    const club = await englishClubs.findById(req.params.club_id);

    res.render(
        "programs/englishlang4all/englishClubs/videoLessons/weeklyLessonEdit", {
        videoLesson,
        club,
        hub
    }
    );
};

module.exports.updateLesson = async (req, res) => {
    const club_id = req.params.club_id;
    const city = req.params.city;
    const hub_id = req.params.hub_id;

    const videoLesson = await englishWeeklyLessons.findByIdAndUpdate(
        req.params.lesson_id, {
        ...req.body.weeklyLesson,
    }
    );

    await videoLesson.save();

    res.redirect(`/englishlang4all/clubs/${city}/hub/${hub_id}/club/${club_id}`);
}


//======================================
//       Weekly Practice 
//======================================
module.exports.postWeeklyPractice = async (req, res) => {
    const club_id = req.params.club_id;
    const city = req.params.city;
    const hub_id = req.params.hub_id;

    const englishClub = await englishClubs.findById(club_id);

    const newPractice = new englishWeeklyExercises(req.body.practice)
    await newPractice.save();

    if (newPractice.exerciseType === "Grammar") {
        englishClub.grammarExercise.push(newPractice._id);
        await englishClub.save();
    }

    if (newPractice.exerciseType === "Vocabulary") {
        englishClub.vocabularyExercise.push(newPractice._id);
        await englishClub.save();
    }

    if (newPractice.exerciseType === "Listening Comprehension") {
        englishClub.listeningExercise.push(newPractice._id);
        await englishClub.save();
    }


    if (newPractice.exerciseType === "Dictation") {
        englishClub.dictationExercise.push(newPractice._id);
        await englishClub.save();
    }


    if (newPractice.exerciseType === "Reading Comprehension") {
        englishClub.readingComprehensionExercise.push(newPractice._id);
        await englishClub.save();
    }

    if (newPractice.exerciseType === "Watching Comprehension") {
        englishClub.watchingComprehensionExercise.push(newPractice._id);
        await englishClub.save();
    }

    if (newPractice.exerciseType === "Read Aloud") {
        englishClub.readAloudExercise.push(newPractice._id);
        await englishClub.save();
    }

    if (newPractice.exerciseType === "LSC") {
        englishClub.LSC.push(newPractice._id);
        await englishClub.save();
    }

    res.send("New exercise posted");
}

module.exports.readAloud = async (req, res) => {
    const club_id = req.params.club_id;
    const city = req.params.city;
    const hub = await englishClubHub.findById(req.params.hub_id);

    const club = await englishClubs.findById(club_id);
    const readAloudExercise = await englishWeeklyExercises.findById(req.params.readAloud_id);


    res.render("programs/englishlang4all/englishClubs/activities/readAloud", {
        club,
        readAloudExercise,
        hub,

    });
}




//======================================
//        Leaders of the month
//======================================
module.exports.leaderOM = async (req, res) => {
    const club_id = req.params.club_id;
    const city = req.params.city;
    const hub_id = req.params.hub_id;
    const englishClub = await englishClubs.findById(req.params.club_id);

    const newWorkersOfMonth = new englishClubWorkersOfMonth({
        studentOfMonth: {
            ...req.body.studentOfMonth,
        },
        instructorOfMonth: {
            ...req.body.instructorOfMonth,
        },
    });

    await newWorkersOfMonth.save();

    englishClub.workersOfMonth.unshift(newWorkersOfMonth);

    await englishClub.save();

    res.redirect(`/englishlang4all/clubs/${city}/hub/${hub_id}/club/${club_id}`);
}

module.exports.allLeadersOM = async (req, res) => {
    const hub = await englishClubHub.findById(req.params.hub_id);
    const club = await englishClubs
        .findById(req.params.club_id)
        .populate("workersOfMonth");
    res.render("programs/englishlang4all/englishClubs/vips/vipsShow", {
        club,
        hub,
        days,
        months,
    });
}

module.exports.editLeadersOM = async (req, res) => {
    const hub = await englishClubHub.findById(req.params.hub_id);
    const leader = await englishClubWorkersOfMonth.findById(
        req.params.leader_id
    );
    const club = await englishClubs.findById(req.params.club_id);

    res.render("programs/englishlang4all/englishClubs/vips/vipsEdit", {
        leader,
        hub,
        club,
    });
}

module.exports.updateLeadersOM = async (req, res) => {
    const club_id = req.params.club_id;
    const city = req.params.city;
    const hub_id = req.params.hub_id;
    const leader = await englishClubWorkersOfMonth.findByIdAndUpdate(
        req.params.leader_id, {
        studentOfMonth: {
            ...req.body.studentOfMonth,
        },
        instructorOfMonth: {
            ...req.body.instructorOfMonth,
        },
    }
    );
    leader.save();

    res.redirect(`/englishlang4all/clubs/${city}/hub/${hub_id}/club/${club_id}`);
}


///==========================================
//      Live Practice 
//==========================================

module.exports.livePractice = async (req, res) => {
    const club_id = req.params.club_id;
    const city = req.params.city;
    const hub_id = req.params.hub_id;

    const englishClub = await englishClubs.findById(req.params.club_id);

    const newMedia = new englishClubMedia(req.body);

    await newMedia.save();

    englishClub.media.unshift(newMedia);

    await englishClub.save();


    res.redirect(`/englishlang4all/clubs/${city}/hub/${hub_id}/club/${club_id}`);
}

module.exports.allLivePractice = async (req, res) => {
    // hub 
    const hub = await englishClubHub.findById(req.params.hub_id);
    const club = await englishClubs
        .findById(req.params.club_id)
        .populate("media");
    res.render("programs/englishlang4all/englishClubs/clubMedia/mediaShow", {
        club,
        hub,
        days,
        months,
    });
}

module.exports.livePraticeEditForm = async (req, res) => {
    const hub = await englishClubHub.findById(req.params.hub_id);
    const media = await englishClubMedia.findById(req.params.media_id);
    const club = await englishClubs.findById(req.params.club_id);

    res.render("programs/englishlang4all/englishClubs/clubMedia/mediaEdit", {
        media,
        club,
        hub
    });
}

module.exports.updateLivePractice = async (req, res) => {
    const club_id = req.params.club_id;
    const city = req.params.city;
    const hub_id = req.params.hub_id;
    const media = await englishClubMedia.findByIdAndUpdate(
        req.params.media_id,
        req.body
    );
    media.save();

    res.redirect(`/englishlang4all/clubs/${city}/hub/${hub_id}/club/${club_id}`);
}

module.exports.postComment = async (req, res) => {
    const club_id = req.params.club_id;
    const city = req.params.city;
    const hub_id = req.params.hub_id;
    const media = await englishClubMedia.findById(req.params.media_id);

    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    await newReview.save();

    media.mediaComments.push(newReview);

    await media.save();

    req.flash("success", `Comment successfully posted`);
    res.redirect(`/englishlang4all/clubs/${city}/hub/${hub_id}/club/${club_id}`);
}

module.exports.deleteComment = async (req, res) => {
    const club_id = req.params.club_id;
    const city = req.params.city;
    const hub_id = req.params.hub_id;
    const media = await englishClubMedia.findById(req.params.media_id);


    removeItemOnce(media.mediaComments, req.params.comment_id);

    await Review.findByIdAndDelete(req.params.comment_id);

    req.flash("success", `Comment successfully deleted`);
    res.redirect(`/englishlang4all/clubs/${city}/hub/${hub_id}/club/${club_id}`);
}


///==========================================
//      Grading a new member
//==========================================

module.exports.memberGradeForm = async (req, res) => {
    const hub = await englishClubHub.findById(req.params.hub_id);
    const club = await englishClubs.findById(req.params.club_id);
    const member_id = req.params.member_id;
    const user = await englishClubMember.findById(req.params.member_id).populate("clubMember");
    res.render("programs/englishlang4all/englishClubs/grading/englishClubGradeForm", {
        hub,
        member_id,
        club,
        user
    });
}

module.exports.memberGrade = async (req, res) => {

    const member = await englishClubMember.findById(req.params.member_id);

    const memberGrade = new progressTrack(req.body.grade);

    await memberGrade.save();

    member.clubMemberProgress.unshift(memberGrade._id);

    await member.save();

    res.send("English member has been successfully graded");
}

module.exports.showMemberGrade = async (req, res) => {
    const clubMember = await englishClubMember.findById(req.params.member_id).populate("clubMemberProgress").populate("clubMember");


    const club = await englishClubs.findById(req.params.club_id);
    if (clubMember) {
        res.render("programs/englishlang4all/englishClubs/grading/memberGradeShow", {
            clubMember,
            club
        })
    } else {
        req.flash("error", "Vous n’êtes pas membre de ce club d’Anglais");
    };
}