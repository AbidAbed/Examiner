const { celebrate, Joi, Segments } = require('celebrate')

const getStudentExamsStatisticsOverViewValidator = celebrate({
    [Segments.HEADERS]: Joi.object().keys({
        authentication: Joi.string().required().not().empty()
    }).unknown(true),
})

module.exports = { getStudentExamsStatisticsOverViewValidator }