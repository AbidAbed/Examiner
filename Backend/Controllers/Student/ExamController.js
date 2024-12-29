const StudentModel = require("../../Models/Student");

async function getStudentExams(request, response) {
    try {
        if (!request.query.page)
            request.query.page = 1
        const foundExams = await StudentModel.findById(request.user._id).populate({
            path: "examEnrolments",
            options: {
                select:"-roomsEnrolmentsIds"
            },
            match: { status: "approved" },
            populate: {
                path: 'exam',
                options: {
                    select: "-numberOfQuestions -examStatisticsId -examTakerStatisticsIds -questionsIds -examEnrolmentsIds -numberOfPages",
                    skip: (request.query.page - 1) * Number(process.env.PAGE_SIZE),
                    limit: Number(process.env.PAGE_SIZE),
                    sort: { scheduledTime: -1 },
                },
                populate: {
                    path: "instructor",
                    options: {
                        select: "-testBankId"
                    },
                    populate: {
                        path: "user",
                        options: {
                            select: "-password -role"
                        }
                    }
                }
            }
        })
        if (foundExams !== null)
            return response.status(200).send(foundExams.examEnrolments)
        else
            return response.status(400).send()

    } catch (error) {
        response.status(500).send()
        console.log(error);
    }
}

async function getStudentLiveExams(request, response) {
    try {
        // if (!request.query.page)
        //     request.query.page = 1
        const foundExams = await StudentModel.findById(request.user._id).populate({
            path: "examEnrolments",
            match: { status: "approved" },
            populate: {
                path: "exam",
                options: {
                    select: '-examTakerStatisticsIds -questionsIds -examEnrolmentsIds -numberOfQuestions -numberOfPages -examStatisticsId',
                    // skip: (request.query.page - 1) * Number(process.env.PAGE_SIZE),
                    // limit: Number(process.env.PAGE_SIZE),
                    match: { status: { $ne: "disabled" } },
                    sort: { scheduledTime: -1 },
                },
                populate: {
                    path: "instructor",
                    options: {
                        select: "-testBankId"
                    },
                    populate: {
                        path: "user",
                        options: {
                            select: "-password -role"
                        }
                    }
                }
            }
        })
        console.log(foundExams);

        if (foundExams !== null)
            return response.status(200).send(foundExams.examEnrolments)
        else return response.status(400).send()
    } catch (error) {
        response.status(500).send()
        console.log(error);
    }
}
module.exports = { getStudentExams, getStudentLiveExams }