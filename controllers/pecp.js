const User = require("../models/user");
const {
    Course,
    EngCourseVideo,
    Module,
    Evaluation,
    Grade
} = require("../models/courses");
const {
    pecpStudent,
    pecpCoach,
    pecpStudentCv,
    pecpConvFeedback,
    pecpStudentProgressTrack,
} = require("../models/pecp");

// new pecp student
module.exports.addNewPecpStudent = async (req, res) => {
    const user = await User.findOne({
        username: req.body.pecpUser
    });


    //Checking if user alreasdy has pecp status
    const checkPecpStudent = await pecpStudent.findOne({
        pecpStudentBasicInfo: user._id
    });

    if (checkPecpStudent) {
        req.flash('error', `${user.surname} ${user.name} a déjà enrollé pour le PECP`);
        res.redirect("back");
    } else {
        // create a new pecp account
        const newPecpStudent = new pecpStudent({
            pecpStudentBasicInfo: user._id,
            level: req.body.level,
            learningGoal: req.body.learningGoal
        })

        await newPecpStudent.save();

        // Adding pecp status to user

        user.isPecpStudent = true
        user.pecpStudent_id = `${newPecpStudent._id}`

        await user.save();

        req.flash('success', `${user.surname} ${user.name} a été enrollé avec succès au PECP`);
        res.redirect("back");
    }
}

// new coach 
module.exports.addNewPecpCoach = async (req, res) => {
    const user = await User.findOne({
        username: req.body.pecpUser
    });


    //Checking if user alreasdy has pecp status
    const checkPecpCoach = await pecpCoach.findOne({
        pecpCoachBasicInfo: user._id
    });

    if (checkPecpCoach) {
        req.flash('error', `${user.surname} ${user.name} a déjà le statut de PECP Coah`);
        res.redirect("back");
    } else {
        // create a new pecp account
        const newPecpCoach = new pecpCoach({
            pecpCoahBasicInfo: user._id,
            level: req.body.level
        })

        await newPecpCoach.save();


        // Adding pecp status to user

        user.isPecpCoach = true
        user.pecpCoach_id = `${newPecpCoach._id}`

        await user.save();

        req.flash('success', `Status PECP Coach activé pour ${user.surname} ${user.name}`);
        res.redirect("back");
    }
}

//Pecp student dashboard
module.exports.pecpStudentDashboard = async (req, res) => {
    const student = await pecpStudent.findById(req.params.pecpStudent_id).populate("pecpStudentProgress").populate("assignedCoach").populate("pecpStudentConvFeedback").populate("myCv");

    const user = await User.findById(req.params.user_id)

    let studentSpecial_courses = [];
    
    for(course_Data of user.specialProgram){
        const course = await Course.findOne({
            title: course_Data.courseTitle
          });

          studentSpecial_courses.push(course);
    }

    res.render("programs/pecp/myPecpSpace", {
        student,
        user,
        studentSpecial_courses
    })
}

//Pecp Coach dashboard
module.exports.pecpCoachDashboard = async (req, res) => {

    const coach = await pecpCoach.findById(req.params.pecpCoach_id).populate({
        path: "students",
        populate: {
            path: "pecpStudentBasicInfo",
        }
    }).populate({
        path: "students",
        populate: {
            path: "pecpStudentConvFeedback"
        }
    });
    /*

    const coach = await pecpCoach.findById(req.params.pecpCoach_id);

    const coach_students = coach.students;

    let Students_details = [];
    for (student of coach_students) {
        let full_student_details = await pecpStudent.findById(student).populate("pecpStudentBasicInfo").populate("assignedCoach").populate("pecpStudentConvFeedback");
        Students_details.push(full_student_details);
    }
  console.log(Students_details);
*/

    const user = await User.findById(req.params.user_id)

    res.render("programs/pecp/myPecpCoachingSpace", {
        coach,
        user
    })

}

// Assign a coach to a student
module.exports.pecpCoachAssignment = async (req, res) => {
    const coach = await User.findOne({
        username: req.body.coach
    });

    const student = await User.findOne({
        username: req.body.student
    });

    const pecp_Coach = await pecpCoach.findById(coach.pecpCoach_id);

    const pecp_Student = await pecpStudent.findById(student.pecpStudent_id);

    pecp_Coach.students.push(pecp_Student._id);

    pecp_Student.assignedCoach.push(pecp_Coach._id);

    await pecp_Coach.save();
    await pecp_Student.save();

    res.redirect("back");
}

// Schedule Conversation
module.exports.pecpCoachST = async (req, res) => {

    const student = await pecpStudent.findById(req.params.pecpStudent_id);

    const coach = await pecpCoach.findById(req.params.pecpCoach_id);

    const newConv = new pecpConvFeedback(req.body.conversation);

    await newConv.save();

    student.pecpStudentConvFeedback.unshift(newConv._id);

    await student.save();

    req.flash('success', `Conversation practice succesfully, scheduled for this learner. The conversation details and call information is sent to his/her dashboard.`);

    res.redirect("back");

}

// conversation topic feedback form
module.exports.pecpConvFeedbackForm = async (req, res) => {

    const student = await pecpStudent.findById(req.params.pecpStudent_id).populate("pecpStudentBasicInfo");

    const coach = await pecpCoach.findById(req.params.pecpCoach_id);

    const conv = await pecpConvFeedback.findById(req.params.conv_id);


    res.render("programs/pecp/convFeedbackForm", {
        student,
        coach,
        conv
    })
}

// conversation topic feedback  
module.exports.pecpConvFeedback = async (req, res) => {

    const student = await pecpStudent.findById(req.params.pecpStudent_id).populate("pecpStudentBasicInfo");

    const coach = await pecpCoach.findById(req.params.pecpCoach_id);

    const conv = await pecpConvFeedback.findByIdAndUpdate(req.params.conv_id, {
        feedback: req.body.feedback,
        recommendation: req.body.recommendation,
        suggested_exercise: req.body.suggested_exercise
    });

    req.flash('success', `Feedback has been succesfully transmitted to the learner`);
    res.redirect('back');
}

// pecp grade
module.exports.pecpGrade = async (req, res) => {
    //
    const student = await pecpStudent.findById(req.params.pecpStudent_id)

    //
    const coach = await pecpCoach.findById(req.params.pecpCoach_id);

    //creating new grade
    const studentGrade = new pecpStudentProgressTrack(req.body.grade);

    await studentGrade.save();

    student.pecpStudentProgress.unshift(studentGrade._id);
    student.save();

    req.flash('success', `This Learner has been succesfully graded`);
    res.redirect('back');
}

//pecp student cv
module.exports.pecpStudentCv = async (req, res) => {
    //
    const student = await pecpStudent.findById(req.params.pecpStudent_id)

    //
    const coach = await pecpCoach.findById(req.params.pecpCoach_id);

    const student_cv = new pecpStudentCv(req.body.cv);

    await student_cv.save()

    student.myCv.unshift(student_cv._id);
    student.save();

    req.flash('success', `This learner's Cv Interview practice files has been succesfully submitted. `);
    res.redirect('back');

}