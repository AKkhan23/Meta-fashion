const errorHandler = (err, req, res, next) => {
    // Avoid double-send if headers already sent
    if (res.headersSent) return next(err)

    let responseCode = res.statusCode && res.statusCode >= 400 ? res.statusCode : 500

    res.status(responseCode)

    res.json({
        message: err.message || "Internal Server Error",
        stack: process.env.NODE_ENV === "development" ? err.stack : null
    })
}


export default errorHandler