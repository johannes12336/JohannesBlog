export const logger = (request, response, next) => {
    console.log(
        new Date().toUTCString(),
        'request from: ',
        request.ip,
        request.method,
        request.originalUrl
    )

    next()
}