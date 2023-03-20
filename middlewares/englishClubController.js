const User = require("../models/user");

const {
    Course,
    Module,
    Evaluation,
    Grade
} = require("../models/courses");

const {
    englishClubs,
    englishClubMember
} = require("../models/englishClub");

const catchAsync = require("../utilities/catchAsync");



module.exports.checkEnglishClubMembership = catchAsync(async (req, res, next) => {
    const {
        club_id
    } = req.params;

    const englishClub = await englishClubs.findById(club_id);

    const checkingMember = await englishClubMember.findOne({
        clubMember: req.user._id
    })

    if (checkingMember) {
        if (englishClub.members.includes(checkingMember._id) || req.user.role == "admin" || req.user.role == "account-manager") {
            next();
        } else {
            req.flash("error", "Vous n’êtes pas membre de ce club d’Anglais");
            res.redirect(`back`);
        }
    } else {
        req.flash("error", "Vous n’avez pas le statut de membre de club d'Anglais. Contactez-nous");
        res.redirect(`back`);
    }


});

module.exports.checkEnglishBoardMembership = catchAsync(async (req, res, next) => {
    const {
        club_id
    } = req.params;
    const englishClub = await englishClubs.findById(club_id);
    if (
        englishClub.boardMembers.indexOf(req.user._id) > -1 ||
        req.user.role == "admin" || req.user.role == "account-manager"
    ) {
        next();
    } else {
        req.flash("error", "You are not a board member.");
        res.redirect(`back`);
    }
});