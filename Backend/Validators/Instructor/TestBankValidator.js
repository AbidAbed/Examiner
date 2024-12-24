const { celebrate, Joi, Segments } = require('celebrate')

const addTestBankQuestionValidator = celebrate({
    [Segments.HEADERS]: Joi.object().keys({
        authentication: Joi.string().required().not().empty()
    }).unknown(true),
    [Segments.BODY]: Joi.object().keys({
        text: Joi.string().required().not().empty(),
        type: Joi.string().optional().valid('multiple-choice-single-answer', 'multiple-choice-multiple-answer'
            , 'true/false', 'short-answer', 'essay'),
        isAiGenerated: Joi.boolean().required().not().empty(),
        answers: Joi.array().items(Joi.object().keys({
            text: Joi.string().required().not().empty(),
            isCorrect: Joi.boolean().required().not().empty()
        }))
    })
})

const addBulkTestBankQuestionsValidator = celebrate({
    [Segments.HEADERS]: Joi.object().keys({
        authentication: Joi.string().required().not().empty()
    }).unknown(true),
    [Segments.BODY]: Joi.object().keys({
        questions: Joi.array().items(
            Joi.object().keys({
                text: Joi.string().required().not().empty(),
                type: Joi.string().optional().valid('multiple-choice-single-answer', 'multiple-choice-multiple-answer'
                    , 'true/false', 'short-answer', 'essay'),
                isAiGenerated: Joi.boolean().required().not().empty(),
                answers: Joi.array().items(Joi.object().keys({
                    text: Joi.string().required().not().empty(),
                    isCorrect: Joi.boolean().required().not().empty()
                }))
            })).required().not().empty()
    })
})

const getTestBankQuestionsValidator = celebrate({
    [Segments.HEADERS]: Joi.object().keys({
        authentication: Joi.string().required().not().empty()
    }).unknown(true),
    [Segments.QUERY]: Joi.object().keys({
        page: Joi.number().optional().min(1),
    })
})

const generateQuestionsByAiValidator = celebrate({
    [Segments.HEADERS]: Joi.object().keys({
        authentication: Joi.string().required().not().empty()
    }).unknown(true),
    [Segments.BODY]: Joi.object().keys({
        prompt: Joi.string().required().not().empty(),
    })
})

const editTestBankQuestionValidator = celebrate({
    [Segments.HEADERS]: Joi.object().keys({
        authentication: Joi.string().required().not().empty()
    }).unknown(true),
    [Segments.BODY]: Joi.object().keys({
        _id: Joi.string().required().not().empty(),
        text: Joi.string().required().not().empty(),
        type: Joi.string().optional().valid('multiple-choice-single-answer', 'multiple-choice-multiple-answer'
            , 'true/false', 'short-answer', 'essay'),
        isAiGenerated: Joi.boolean().required().not().empty(),
        answers: Joi.array().items(Joi.object().keys({
            text: Joi.string().required().not().empty(),
            isCorrect: Joi.boolean().required().not().empty()
        }))
    })
})

const deleteTestBankQuestionValidator = celebrate({
    [Segments.HEADERS]: Joi.object().keys({
        authentication: Joi.string().required().not().empty()
    }).unknown(true),
    [Segments.BODY]: Joi.object().keys({
        testBankQuestionId: Joi.string().required().not().empty()
    })
})
module.exports = {
    addTestBankQuestionValidator,
    getTestBankQuestionsValidator,
    generateQuestionsByAiValidator,
    addBulkTestBankQuestionsValidator,
    editTestBankQuestionValidator,
    deleteTestBankQuestionValidator
}