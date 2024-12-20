const { celebrate, Joi, Segments } = require('celebrate')

const getInstructorExamStatisticsValidator = celebrate({
    [Segments.HEADERS]: Joi.object().keys({
        authentication: Joi.string().required().not().empty()
    }).unknown(true),

    [Segments.QUERY]: Joi.object().keys({
        examId: Joi.string().required().not().empty(),
    })
})


const getInstructorExamTakersStatisticsValidator = celebrate({
    [Segments.HEADERS]: Joi.object().keys({
        authentication: Joi.string().required().not().empty()
    }).unknown(true),

    [Segments.QUERY]: Joi.object().keys({
        examId: Joi.string().required().not().empty(),
        page: Joi.number().optional().min(1),
    })
})
module.exports = {
    getInstructorExamStatisticsValidator,
    getInstructorExamTakersStatisticsValidator
}