const { Router } = require('express')
const AuthRouter = require('./AuthRoute');
const { isCelebrateError } = require('celebrate');
const InstructorRouter = require('./Instructor/InstructorRoute');
const StudentRouter = require('./Student/StudentRouter');

const MainRouter = Router()

MainRouter.use(AuthRouter)
MainRouter.use(InstructorRouter)
MainRouter.use(StudentRouter)


async function errorHandler(err, req, res, next) {
    console.log(err);
    if (!isCelebrateError(err)) {
        return next(err);
    }

    const [arr] = err.details.entries();

    const [obj] = arr[1].details;

    const result = {
        statusCode: 400,
        error: "Bad Request",
        message: obj.message,
        validation: {
            source: err.source,
            keys: [],
        },
    };

    if (err.details) {
        for (let i = 0; i < err.details.length; i += 1) {
            const path = err.details[i].path.join(".");
            result.validation.keys.push(EscapeHtml(path));
        }
    }

    return res.status(400).send(result);
}

MainRouter.use(errorHandler);

module.exports = MainRouter 