const { celebrate, Joi, Segments } = require('celebrate')


const createExamByInstructorValidator = celebrate({

    [Segments.HEADERS]: Joi.object().keys({
        authentication: Joi.string().required().not().empty()
    }).unknown(true),

    [Segments.BODY]: Joi.object().keys({
        name: Joi.string().required().not().empty(),
        description: Joi.string().required().not().empty(),
        duration: Joi.number().required().not().empty().min(10),
        scheduledTime: Joi.number().required().not().empty(),
        numberOfQuestions: Joi.number().required().not().empty().min(1),
        passScore: Joi.number().required().not().empty().min(1),
        numberOfPages: Joi.number().required().not().empty().min(1),
        // fullScore: Joi.number().required().not().empty().min(1),
        allowReview: Joi.boolean().required().not().empty(),
        showMark: Joi.boolean().required().not().empty(),
        enrolmentStatus: Joi.string().optional().valid('closed', 'open'),
        questions: Joi.array().items(Joi.object().keys({
            _id: Joi.string().optional(),
            text: Joi.string().optional(),
            type: Joi.string().optional().valid(
                'true/false',
                'short-answer',
                'essay',
                'multiple-choice-single-answer',
                'multiple-choice-multiple-answer'),
            isTestBank: Joi.boolean().required().not().empty(),
            isAiGenerated: Joi.boolean().required().not().empty(),
            order: Joi.number().required().not().empty().min(1),
            page: Joi.number().required().not().empty().min(1),
            points: Joi.number().required().not().empty().min(1),
            answers: Joi.array().items(Joi.object().keys({
                text: Joi.string().required().not().empty(),
                isCorrect: Joi.boolean().required().not().empty()
            })).optional()
        })),
        status: Joi.string().required().not().empty().valid('scheduled', 'finished'),
    })
})

const getInstructorExamsValidator = celebrate({

    [Segments.HEADERS]: Joi.object().keys({
        authentication: Joi.string().required().not().empty()
    }).unknown(true),

    [Segments.QUERY]: Joi.object().keys({
        page: Joi.number().optional().min(1),
    })
})

const getExamQuestionsValidator = celebrate({
    [Segments.HEADERS]: Joi.object().keys({
        authentication: Joi.string().required().not().empty()
    }).unknown(true),
    [Segments.QUERY]: Joi.object().keys({
        examId: Joi.string().required().not().empty(),
    })
})

const deleteExamQuestionsValidator = celebrate({
    [Segments.HEADERS]: Joi.object().keys({
        authentication: Joi.string().required().not().empty()
    }).unknown(true),
    [Segments.QUERY]: Joi.object().keys({
        examId: Joi.string().required().not().empty(),
    })
})

const updateExamByInstructorValidator = celebrate({
    [Segments.HEADERS]: Joi.object().keys({
        authentication: Joi.string().required().not().empty()
    }).unknown(true),
    [Segments.BODY]: Joi.object().keys({
        examId: Joi.string().required().not().empty(),
        name: Joi.string().required().not().empty(),
        description: Joi.string().required().not().empty(),
        duration: Joi.number().required().not().empty().min(10),
        scheduledTime: Joi.number().required().not().empty(),
        numberOfQuestions: Joi.number().required().not().empty().min(1),
        passScore: Joi.number().required().not().empty().min(1),
        numberOfPages: Joi.number().required().not().empty().min(1),
        // fullScore: Joi.number().required().not().empty().min(1),
        allowReview: Joi.boolean().required().not().empty(),
        showMark: Joi.boolean().required().not().empty(),
        enrolmentStatus: Joi.string().optional().valid('closed', 'open'),
        questions: Joi.array().items(Joi.object().keys({
            _id: Joi.string().optional(),
            text: Joi.string().optional(),
            type: Joi.string().optional().valid(
                'true/false',
                'short-answer',
                'essay',
                'multiple-choice-single-answer',
                'multiple-choice-multiple-answer'),
            isTestBank: Joi.boolean().required().not().empty(),
            isAiGenerated: Joi.boolean().required().not().empty(),
            order: Joi.number().required().not().empty().min(1),
            page: Joi.number().required().not().empty().min(1),
            points: Joi.number().required().not().empty().min(1),
            answers: Joi.array().items(Joi.object().keys({
                text: Joi.string().required().not().empty(),
                isCorrect: Joi.boolean().required().not().empty()
            })).optional()
        })),
        status: Joi.string().required().not().empty().valid('scheduled', 'finished'),
    })
})
module.exports = {
    createExamByInstructorValidator,
    getInstructorExamsValidator,
    getExamQuestionsValidator,
    deleteExamQuestionsValidator,
    updateExamByInstructorValidator
}