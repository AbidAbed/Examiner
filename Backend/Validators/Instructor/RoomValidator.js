const { celebrate, Joi, Segments } = require('celebrate')

const getInstructorRoomValidator = celebrate({
    [Segments.HEADERS]: Joi.object().keys({
        authentication: Joi.string().required().not().empty()
    }).unknown(true),
})

module.exports = {
    getInstructorRoomValidator
}