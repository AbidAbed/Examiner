async function AuthStudentOnly(request, response, next) {
    try {
        if (request.user.user.role !== "student") {
            response.status(401).send()
            return
        }
        next()
    } catch (error) {
        console.log(error);
        response.status(401).send()
    }
}

module.exports = AuthStudentOnly