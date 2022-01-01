const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const passport = require('passport');
const StaffStudent = require('../models/staffStudent')


const jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = 'myVerySecret'

module.exports = passport =>{
    passport.use('jwt.admin',new JwtStrategy(
        jwtOptions,(jwt_payload, done)=>{
            StaffStudent.findOne({username:jwt_payload.id,role:"admin"}).then(user =>{
                console.log(user);
                console.log(jwt_payload);
                if(user){
                    return done(null, user);
                }
                return done(null, false);
            }).catch(err =>{
                console.log(err);
            });
        }
    ));

    passport.use('jwt.student',new JwtStrategy(
        jwtOptions,(jwt_payload, done)=>{
            StaffStudent.findOne({idNumber:jwt_payload.id,role:"student"}).then(student =>{

                console.log(student);
                console.log(jwt_payload);
                if(student){
                    return done(null, student);
                }
                return done(null, false);
            }).catch(err =>{
                console.log(err);
            });
        }
    ));
}