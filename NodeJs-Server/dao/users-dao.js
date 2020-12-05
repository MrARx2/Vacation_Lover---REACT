const { v4: uuidv4 } = require('uuid');
let connection = require("./connection-wrapper");
let ErrorType = require("./../errors/error-type");
let ServerError = require("./../errors/server-error");

async function addUser(user) {
    user.type = 'User';
    let sql = "INSERT INTO users (username, password, type, first_name, last_name)  values(?, ?, ?, ?, ?)";
    let parameters = [user.username, user.password, user.type, user.firstName, user.lastName];
    try {
        await connection.executeWithParameters(sql, parameters);
    }
    catch (e) {
        console.log(e);
        throw new ServerError(ErrorType.GENERAL_ERROR, sql, e);
    }
}

async function getUser(id) {
    let sql = "select * from users where id=?";
    let parameters = [id];
    let user = await connection.executeWithParameters(sql, parameters);
    return user;
}

async function isUserExistByName(name) {
    let sql = "select * from users where username=?";
    let parameters = [name];
    let user = await connection.executeWithParameters(sql, parameters);
    if (user.length == 0)
        return false;

    return true;
}

async function login(user) {
    // UNCOMMENT IN ORDER TO SEE A GENERAL ERROR EXAMPLE
    // let sql = "SELECT * FROM users where username =? and password =?";
    let sql = "SELECT * FROM users where username =? and password =?";

    let parameters = [user.username, user.password];

    let usersLoginResult;
    try {
        usersLoginResult = await connection.executeWithParameters(sql, parameters);
    }
    catch (e) {
        // This is an example, for a situation where a TECHNICAL ERROR HAD OCCURED
        // that error threw an exception - WHICH WE WANT TO WRAP with a ServerError
        throw new ServerError(ErrorType.GENERAL_ERROR, JSON.stringify(user), e);
    }

    // A functional (!) issue which means - the userName + password do not match
    if (usersLoginResult == null || usersLoginResult.length == 0) {
        throw new ServerError(ErrorType.UNAUTHORIZED);
    }
    return usersLoginResult[0];
}

module.exports = {
    addUser,
    getUser,
    login,
    isUserExistByName,
};