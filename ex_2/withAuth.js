const jwt = require('jsonwebtoken')


function withAuth(req, res, next){
    const headers = req.headers;
    try {
        const payload = jwt.verify(headers.authorization, process.env.JWT_SECRET);

        req.payload = payload;

        next();

    } catch(err) {
        console.log(err);
        res.status(401).json({err, msg: "invalid token"})
    }
}

module.exports = withAuth;