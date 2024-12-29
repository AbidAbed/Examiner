const { celebrate, Joi, Segments } = require('celebrate')

const getStudentExamsValidator = celebrate({

    [Segments.HEADERS]: Joi.object().keys({
        authentication: Joi.string().required().not().empty()
    }).unknown(true),

    [Segments.QUERY]: Joi.object().keys({
        page: Joi.number().optional().min(1),
    })
})

module.exports = { getStudentExamsValidator }
