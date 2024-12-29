const { celebrate, Joi, Segments } = require('celebrate')

const getInstructorRoomValidator = celebrate({
    [Segments.HEADERS]: Joi.object().keys({
        authentication: Joi.string().required().not().empty()
    }).unknown(true),
})

const changeRoomEnrollmentStatusValidator = celebrate({
    [Segments.HEADERS]: Joi.object().keys({
        authentication: Joi.string().required().not().empty()
    }).unknown(true),
    [Segments.BODY]: Joi.object().required().keys({
        roomEnrollments: Joi.array().items(
            Joi.object().required().keys({
                status: Joi.string().required().valid('approved', 'denied', 'kicked').not().empty(),
                roomEnrollmentId: Joi.string().required().not().empty()
            }))
    })
})
module.exports = {
    getInstructorRoomValidator,
    changeRoomEnrollmentStatusValidator
}