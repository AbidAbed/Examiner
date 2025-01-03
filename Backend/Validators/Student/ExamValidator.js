const { celebrate, Joi, Segments } = require('celebrate')

const getStudentExamsValidator = celebrate({

    [Segments.HEADERS]: Joi.object().keys({
        authentication: Joi.string().required().not().empty()
    }).unknown(true),

    [Segments.QUERY]: Joi.object().keys({
        page: Joi.number().optional().min(1),
    })
})

const enrollExamValidator = celebrate({

    [Segments.HEADERS]: Joi.object().keys({
        authentication: Joi.string().required().not().empty()
    }).unknown(true),
    [Segments.BODY]: Joi.object().keys({
        examId: Joi.string().required().not().empty(),
        roomId: Joi.string().required().not().empty()
    })
})

const startExamValidator = celebrate({
    [Segments.HEADERS]: Joi.object().keys({
        authentication: Joi.string().required().not().empty()
    }).unknown(true),
    [Segments.BODY]: Joi.object().keys({
        examId: Joi.string().required().not().empty(),
        roomId: Joi.string().required().not().empty()
    })
})

const submitExamValidator = celebrate({
    [Segments.HEADERS]: Joi.object().keys({
        authentication: Joi.string().required().not().empty()
    }).unknown(true),
    [Segments.BODY]: Joi.object().keys({
        questions: Joi.array().items(Joi.object().keys({
            _id: Joi.string().required(),
            choosenAnswer: Joi.string().allow("")
        })),
    })
})
module.exports = { getStudentExamsValidator, enrollExamValidator, startExamValidator, submitExamValidator }
