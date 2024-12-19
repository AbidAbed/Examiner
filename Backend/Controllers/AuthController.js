const UserModel = require('../Models/User')
const StudentModel = require('../Models/Student')
const InstructorModel = require('../Models/Instructor')
const RoomModel = require('../Models/Room')
const TestBankModel = require("../Models/TestBank")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer = require("nodemailer");


async function signupUser(request, response) {
    try {

        const { email, password, role, username, tel } = request.body
        const hashedPassword = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS))
        const createdUser = await UserModel.create({ ...request.body, password: hashedPassword })

        if (createdUser === null) {
            response.status(500).send()
            return
        }

        if (role === 'student') {
            const createdStudent = await StudentModel.create({ _id: createdUser._doc._id })


            if (createdStudent === null) {
                response.status(500).send()
                return
            }

        } else if (role === 'instructor') {
            const createdInstructor = await InstructorModel.create({ _id: createdUser._doc._id })
            const roomInvitaionCode = await bcrypt.hash(toString(createdUser._doc._id), Number(process.env.SALT_ROUNDS))
            const createdRoom = await RoomModel.create({
                instructorId: createdUser._doc._id,
                roomInvitaionCode: roomInvitaionCode
            })

            const createdTestBank = await TestBankModel.create({ instructorId: createdUser._doc._id })

            await createdInstructor.updateOne({ roomId: createdRoom._doc._id, testBankId: createdTestBank._doc._id })

            if (createdInstructor === null) {
                response.status(500).send()
                return
            }
        } else {
            response.status(403).send()
            return
        }

        response.status(200).send()

    } catch (error) {
        console.error(error);
        response.status(500).send()
    }
}

async function loginUser(request, response) {
    try {
        const { email, password } = request.body
        const foundUser = await UserModel.findOne({ email: email })
        const isCorrectPassword = await bcrypt.compare(password, foundUser._doc.password)

        if (!isCorrectPassword) {
            response.status(401).send()
            return
        }

        let userObject
        // console.log(foundUser._doc);

        if (foundUser._doc.role === 'student') {

            const foundStudent = await StudentModel.findById(foundUser._doc._id).populate({
                path: 'user',
                select: '-password',
            });
            userObject = { ...foundStudent.toObject() }
        } else if (foundUser._doc.role === 'instructor') {
            const foundInstructor = await InstructorModel.findById(foundUser._doc._id).populate({
                path: 'user',
                select: '-password',
            });
            userObject = { ...foundInstructor.toObject() }
        } else {
            response.status(403).send()
            return
        }
        console.log(userObject);

        const token = await jwt.sign({ _id: userObject._id, role: userObject.user.role },
            process.env.JWT_SECRET, {
            expiresIn: '7d'
        })

        response.status(200).send({ ...userObject, token: token })

    } catch (error) {
        console.error(error);
        response.status(401).send()
    }
}

async function authUser(request, response) {
    try {
        if (request?.user && request.user !== null)
            response.status(200).send({ ...request.user })
        else
            response.status(400).send()
    } catch (error) {
        console.error(error);
        response.status(500).send()
    }
}

async function forgetPassword(request, response) {
    try {

        /*      READ AT END OF PAGE FOR SETTING UP OUTLOOK ACCOUNT      */

        const foundUser = await UserModel.findOne({ email: request.body.email })

        const resetToken = await jwt.sign({ _id: foundUser._doc._id, role: foundUser._doc.role, oldPass: foundUser._doc.password },
            process.env.JWT_SECRET
        )
        console.log("\n\n\nVISIT https://mailtrap.io/inboxes/3337436/messages TO CHECK\n\n\n");

        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: Number(process.env.MAIL_PORT),
            // secure: true,
            // secure: Boolean(process.env.EXAMINER_PASS.MAIL_IS_SECURE), // true for port 465, false for other ports
            auth: {
                user: process.env.EXAMINER_USER,
                pass: process.env.EXAMINER_PASS,
            },
        });

        const info = await transporter.sendMail({
            from: `Examiner Support Team<${process.env.EXAMINER_MAIL}>`, // sender address
            to: foundUser._doc.email, // list of receivers
            subject: "Examiner - Password Reset Request", // Subject line
            html: `<div> 
            <b>Please copy and paste this to reset your password (your reset token) : </b>
            <b>${resetToken}</b>
            </div>`, // html body
        });

        if (foundUser === null) {
            response.status(400).send()
            return
        }

        response.status(200).send()

    } catch (error) {
        console.error(error);
        response.status(500).send()
    }
}

async function resetPassword(request, response) {
    try {

    } catch (error) {
        console.error(error);
        response.status(500).send()
    }
}

module.exports = {
    signupUser,
    loginUser,
    authUser,
    forgetPassword,
    resetPassword
}







/* 
        RESETING PASSWORD USING OUTLOOK ACCOUNT



                .env : 
                EXAMINER_MAIL = "example@outlook.com"
                EXAMINER_PASS = "*********"
                MAIL_HOST = "smtp-mail.outlook.com"
                MAIL_PORT = 587



                AAD security defaults may block this. I had:

                Get-TransportConfig | Format-List SmtpClientAuthenticationDisabled
                SmtpClientAuthenticationDisabled : False
                But still got 535 5.7.139 authentication unsuccessful

                It turned out it was Security defaults in AAD that was the problem

                Turn off Security Defaults in Azure Active Directory

                Start by logging into the Azure Active Directory (https://aad.portal.azure.com/). 


                Select Azure Active Directory

                In left menu click: Azure Active Directory

                Select Properties from the menu under Manage

                AAD properties

                Select Manage security defaults at the very bottom of the properties page

                Managing security defaults

                Move the slider to No and click Save

                save security defaults
                You may then check:

                Next login to or navigate to the Microsoft 365 Admin Center https://admin.microsoft.com/

                Select Settings > Org Settings

                Under Services, select Modern Authentication 

                Ensure Authentication SMTP is checked

*/