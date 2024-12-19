async function AuthInstructorOnly(request, response, next) {
    try {
        if (request.user.user.role !== "instructor") {
            response.status(401).send()
            return
        }
        next()
    } catch (error) {
        console.log(error);
        response.status(401).send()
    }
}

module.exports = AuthInstructorOnly