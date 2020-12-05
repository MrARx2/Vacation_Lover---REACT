let usersDao = require("../dao/users-dao");
let ServerError = require("../errors/server-error");
let ErrorType = require("../errors/error-type");
const jwt = require('jsonwebtoken');
const crypto = require("crypto");
const config = require("../config.json");
const usersMap = require('../Model/users');


const saltRight = "sdkjfhdskajh";
const saltLeft = "--mnlcfs;@!$ ";

async function addUser(user) {
    // Validations
    if (await usersDao.isUserExistByName(user.username)){
        throw new ServerError(ErrorType.USER_NAME_ALREADY_EXIST);
    }
    
    // update parameter: the string we'd like to hide (or a buffer from a file read stream)
    // digest parameter: The output format ("binary"/"hex"/"base64"). Default - binary
    user.password = crypto.createHash("md5").update(saltLeft + user.password + saltRight).digest("hex");
    await usersDao.addUser(user);
}

async function getUser(id) {
    let user = await usersDao.getUser(id);
    return user;
}

async function deleteUser(id) {
    await usersDao.deleteUser(id);
}

async function ValidateUserByToken(token) {
    try {
        let isUserVerified = usersMap.has(token);

        if (!isUserVerified) {
            throw new ServerError(ErrorType.UNAUTHORIZED);
        }
    
        user = usersMap.get(token);
    
        return user;
    }
    catch(error) {
        console.log(`Token was Not Found in Cache`);
    }
    
}

async function login(user) {
    user.password = crypto.createHash("md5").update(saltLeft + user.password + saltRight).digest("hex");
    const saltedUsername = saltLeft + user.username + saltRight;

    let userLoginData = await usersDao.login(user);
    const token = jwt.sign({ sub: saltedUsername }, config.secret , { algorithm: 'HS256' });

    // Do something with cache and stuff.. token...
    const userInfo = {
            userFirstName: userLoginData.first_name,
            userType: userLoginData.type,
            username: userLoginData.username,
            token: token,
        }
    usersMap.set(token , userLoginData);
    
    return userInfo;
}

module.exports = {
    addUser,
    getUser,
    login,
    ValidateUserByToken,
};