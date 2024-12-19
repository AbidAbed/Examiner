const jwt = require('jsonwebtoken')
const UserModel = require('../Models/User')
const StudentModel = require('../Models/Student')
const InstructorModel = require('../Models/Instructor')

async function authToken(request, response, next) {
    try {
        const { authentication } = request.headers
        const decoded = await jwt.verify(authentication, process.env.JWT_SECRET)

        if (decoded === null) {
            response.status(401).send()
            return
        }

        const foundUser = await UserModel.findById(decoded._id)

        if (foundUser === null || foundUser.role !== decoded.role) {
            response.status(401).send()
            return
        }


        let userObject

        if (foundUser.role === 'student') {
            const foundStudent = await StudentModel.findById(foundUser._doc._id).populate({
                path: 'user',
                select: '-password',
            });
            userObject = { ...foundStudent.toObject() }
        } else if (foundUser.role === 'instructor') {
            const foundInstructor = await InstructorModel.findById(foundUser._doc._id).populate({
                path: 'user',
                select: '-password',
            });
            userObject = { ...foundInstructor.toObject() }
        } else {
            response.status(403).send()
            return
        }

        request.user = userObject

        next()
        
    } catch (error) {
        console.log(error);
        response.status(401).send()
    }
}

module.exports = authToken