const { celebrate, Joi, Segments } = require('celebrate')

const signupUserValidator = celebrate({
    [Segments.BODY]: Joi.object().keys({
        email: Joi.string().required().not().empty().email(),
        password: Joi.string().required().not().empty(),
        tel: Joi.string().required().not().empty().length(14),
        username: Joi.string().required().not().empty(),
        role: Joi.string().required().not().empty().valid('student', 'instructor')
    })
})


const loginUserValidator = celebrate({
    [Segments.BODY]: Joi.object().keys({
        email: Joi.string().required().not().empty().email(),
        password: Joi.string().required().not().empty()
    })
})


const authUserValidator = celebrate({
    [Segments.HEADERS]: Joi.object().keys({
        authentication: Joi.string().required().not().empty()
    }).unknown(true),
})

const forgetPasswordValidator = celebrate({
    [Segments.BODY]: Joi.object().keys({
        email: Joi.string().required().not().empty().email(),
    })
})

module.exports = {
    signupUserValidator,
    loginUserValidator,
    authUserValidator,
    forgetPasswordValidator
}