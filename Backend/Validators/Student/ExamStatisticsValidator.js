const { celebrate, Joi, Segments } = require('celebrate')

const getStudentExamsStatisticsOverViewValidator = celebrate({
    [Segments.HEADERS]: Joi.object().keys({
        authentication: Joi.string().required().not().empty()
    }).unknown(true),
})


const getExamTakerStatisticsValidator = celebrate({
    [Segments.HEADERS]: Joi.object().keys({
        authentication: Joi.string().required().not().empty()
    }).unknown(true),
    [Segments.QUERY]: Joi.object().keys({
        examId: Joi.string().required().not().empty(),
        roomId: Joi.string().required().not().empty()
    })
})

module.exports = { getStudentExamsStatisticsOverViewValidator, getExamTakerStatisticsValidator }