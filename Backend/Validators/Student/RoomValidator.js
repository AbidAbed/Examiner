const { Joi, celebrate, Segments } = require('celebrate')

const getStudentRoomsValidator = celebrate({
    [Segments.HEADERS]: Joi.object().keys({
        authentication: Joi.string().required().not().empty()
    }).unknown(),
    [Segments.QUERY]: Joi.object().keys({
        page: Joi.number().optional().min(1),
    })
})

const enrollRoomStudentValidator = celebrate({
    [Segments.HEADERS]: Joi.object().keys({
        authentication: Joi.string().required().not().empty()
    }).unknown(),
    [Segments.BODY]: Joi.object().keys({
        roomInvitationCode: Joi.string().required().not().empty(),
    })
})

const getRoomExamsValidator = celebrate({
    [Segments.HEADERS]: Joi.object().keys({
        authentication: Joi.string().required().not().empty()
    }).unknown(),
    [Segments.BODY]: Joi.object().keys({
        roomId: Joi.string().required().not().empty(),
    })
})


module.exports = { getStudentRoomsValidator, enrollRoomStudentValidator, getRoomExamsValidator }