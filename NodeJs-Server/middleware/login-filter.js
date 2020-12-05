const expressJwt = require('express-jwt');
const config = require('../config.json');

// Extracting the text from the secret's JSON
let { secret } = config;

function authenticationJwtRequestToken() {
    return expressJwt({
        secret, algorithms: ['HS256']}).unless({
        path: [
            "/users/register",
            "/users/login",
        ]
    })

}

module.exports = authenticationJwtRequestToken;