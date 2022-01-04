const StaffStudent = require('../models/staffStudent')
const passport = require('passport');
const multer = require('multer');
const {singleUpload,singleFileUpload} = require('../middlewares/filesMiddleware');
const { uuid } = require('uuidv4');
const jwt =require('jsonwebtoken');
const csv = require('csv-parser')
const fs = require('fs')
const msToTime = require('../middlewares/timeMiddleware')
const mailler = require('../middlewares/mailjetMiddleware')

// exports.mall = async (req,res,next) => {
//   mailler("onemusty.z@gmail.com", "Yusuf", "onemusty.z@gmail.com", "Yusuf")
//   .then((result) => {
//     console.log(result.body)
//     res.json(result.body)
//   })
//   .catch((err) => {
//     console.log(err.statusCode)
//   })
// } 

// // staff registration controller
exports.register = async (req, res, next) => {
    try {

      //create the user instance
      user = new StaffStudent(req.body)
      const password = req.body.password ? req.body.password : 'password'
      //save the user to the DB
      await StaffStudent.register(user, password, function (error, user) {
        if (error) return res.json({ success: false, error }) 
        const newUser = {
          _id: user._id,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          otherName: user.otherName,
          department: user.department,
          state: user.state,
          faculty: user.faculty,
          level: user.level,
          dob: user.dob,
          email: user.email,
          phone: user.phone,
          image: user.image,
          role: user.role,
          active: user.active,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          __v: user.__v
        }
        res.json({ success: true, newUser })
      })
    } catch (error) {
      res.json({ success: false, error })
    }
  }

  // reset password
  exports.changePassword = async (req, res, next) => {
    const {username} = req.query

      StaffStudent.findOne({ username },(err, user) => {
        // Check if error connecting
        if (err) {
          res.json({ success: false, message: err }); // Return error
        } else {
          // Check if user was found in database
          if (!user) {
            res.json({ success: false, message: 'User not found' }); // Return error, user was not found in db
          } else {
            user.changePassword(req.body.oldpassword, req.body.newpassword, function(err) {
               if(err) {
                        if(err.name === 'IncorrectPasswordError'){
                             res.json({ success: false, message: 'Incorrect password' }); // Return error
                        }else {
                            res.json({ success: false, message: 'Something went wrong!! Please try again after sometimes.' });
                        }
              } else {
                res.json({ success: true, message: 'Your password has been changed successfully' });
               }
             })
          }
        }
      });
   
    
  }

  // staff login controller
exports.login = (req, res, next) => {
  console.log(req.body)

  let payLoad = {}
  // perform authentication
  passport.authenticate('staffStudent', (error, user, info) => {
    if (error) return res.json({ success: false, error })
    if (!user)
      return res.json({
        success: false,
        message: 'username or password is incorrect'
      })
    //login the user  
    req.login(user, (error) => {
      if (error){
        res.json({ success: false, message: 'something went wrong pls try again' })
      }else {
        req.session.user = user
        payLoad.id = user.username
        
        const token = jwt.sign(payLoad, 'myVerySecret');

        const newUser = {
          token,
          _id: user._id,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          otherName: user.otherName,
          department: user.department,
          state: user.state,
          faculty: user.faculty,
          level: user.level,
          dob: user.dob,
          email: user.email,
          phone: user.phone,
          image: user.image,
          role: user.role,
          active: user.active,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          __v: user.__v
        }
        
        res.json({ success: true, message: 'user login successful', newUser})
      }
    })
  })(req, res, next)
}

 

// // logout
// exports.logout = (req, res,next) => {

//   console.log(req.session)

//   if (req.session.user.role == "admin"){

//       req.logout();
//       res.json({success: true, message: "logout successfully"});
//   }
// }


// get student only
exports.getOnlyStudent = async (req,res, next) => {

  const result = await StaffStudent.find({role: "student"});
  result.length > 0
   ? res.json({success: true, message: result,})
   : res.json({success: false, message: result,})
}

// get admin only
exports.getOnlyAdmin = async (req,res, next) => {

  const result = await StaffStudent.find({role: "admin"},{active: 0});
  result.length > 0
   ? res.json({success: true, message: result,})
   : res.json({success: false, message: result,})
}

// find single student
exports.singleStudent = async (req,res, next) => {
  const {username} = req.query

  const result = await StaffStudent.findOne({username, role:"student"});
  result
   ? res.json({success: true, message: result,})
   : res.json({success: false, message: result,})
}

// find single staff
exports.singleStaff = async (req,res, next) => {
  const {username} = req.query

  const result = await StaffStudent.findOne({username,role:"admin"},{active: 0});
  result
   ? res.json({success: true, message: result,})
   : res.json({success: false, message: result,})
}

// set profile pic
exports.setProfilePic = async (req,res, next) => {
  singleUpload(req, res, async function(err) {
    if (err instanceof multer.MulterError) {
    return res.json(err.message);
    }
    else if (err) {
      return res.json(err);
    }
    else if (!req.file) {
      return res.json({"image": req.file, "msg":'Please select an image to upload'});
    }
    if(req.file){

      // console.log(Object.keys(req.query).length)
      // try {
      //   fs.unlinkSync(req.file.path)
      //   //file removed
      // } catch(err) {
      //   console.error(err)
      // }

      if(req.query.hasOwnProperty('username') && Object.keys(req.query).length == 1){
        const result = await StaffStudent.findOne({username: req.query.username},{_id: 0,image: 1})

        try {
          fs.unlinkSync(result.image)
          //file removed
        } catch(err) {
          console.error(err)
        }
          console.log(result)
        await StaffStudent.findOneAndUpdate({username: req.query.username},{$set: {image: req.file.path}})
        const editedStaff = await StaffStudent.findOne({username: req.query.username})
        
        res.json({success: true,
          message: editedStaff,
                     },
          
      );
      }
       
    }
    });

        
  
}

// delete or remove student
exports.removeStudent = async (req,res,next) => {
  const {username} = req.query;
  await StaffStudent.findOneAndDelete({username: username, role:"student"})
  res.json({success: true, message: `student with the id ${username} has been removed`})
}

// edit student
exports.editStudent = async (req,res,next) => {
  const {username} = req.query;
  await StaffStudent.findOneAndUpdate({username: username, role:"student"}, req.body)
  res.json({success: true, message: `student with the username ${username} has been edited`})
}

// activate or deactivate student
exports.activateDeactivateStudent = async (req,res,next) => {
  const {username,active} = req.body;
  await StaffStudent.findOneAndUpdate({username: username, role:"student"}, {active:active})
  res.json({success: true, message: `student with the username ${username} has been edited`})
}


