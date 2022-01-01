var express = require('express');
var router = express.Router();
const adminController = require('../controllers/adminController')
const idGenerator = require('../middlewares/idGenerator')
const passport = require('passport');

/** All post request *//////////////////////////////////////////////

// register staff or student route
router.post('/register', adminController.register)

// login staff
router.post('/login', adminController.login)


// /** All get request *///////////////////////////////////////////////////////////////

// get all staff
router.get('/get-all-staff', adminController.getOnlyAdmin)

// get all student
router.get('/get-all-student', adminController.getOnlyStudent)

// get single student
router.get('/get-single-student', adminController.singleStudent)

// get single staff
router.get('/get-single-staff', adminController.singleStaff)



// /** All put request *//////////////////////////////////////////////////////////

// edit single student
router.put('/edit-single-student', adminController.editStudent)

// // passport.authenticate("jwt.admin",{session:false}),

// set profile pic
router.put('/set-profile-pic',  adminController.setProfilePic);

// activate or deactiivate a student
router.put('/activate-deactivate-student', adminController.activateDeactivateStudent)

// change password
router.post('/change-password', adminController.changePassword)



// /** All delete request *////////////////////////////////////////////////////

// delete single student
router.delete('/delete-single-student', adminController.removeStudent)

module.exports = router;