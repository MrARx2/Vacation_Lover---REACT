let usersLogic = require("../logic/users-logic");
const express = require("express");
const {extractUserFromAuth} = require('../util');
const router = express.Router();

router.post("/login", async (request, response, next) => {
    // Extracting the JSON from the packet's BODY
    let user = request.body;
    try {
        let successfullLoginData = await usersLogic.login(user);
        response.json(successfullLoginData);
    }
    catch (error) {
        return next(error);
    }
});

// ADD USER
router.post("/register", async (request, response, next) => {

    // Extracting the JSON from the packet's BODY
    let user = request.body;

    try {
        await usersLogic.addUser(user);
        response.json('user created!');
    }
    catch (error) {
        console.log(error);
        return next(error);
    }
});

router.post("/ValidateUserByToken", async (request, response, next) => {
    let user = await extractUserFromAuth(request);
    if (user != null) {
        try {
            let userInfo = {
                userType: user.type,
                userFirstName: user.first_name,
                username: user.username,
            }
            response.json(userInfo);
        }
        catch (error) {
            console.log('cannot found autologin user' + user.id);
            return next(error);
        }
    }
    return;
});

module.exports = router;