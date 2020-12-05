let ErrorType = {
    
    GENERAL_ERROR : {id: 1, httpCode: 600, message : "A big fuck up which we'll never tell you of had just happend. And now : A big fat lie....'A general error ....'", isShowStackTrace: true},
    USER_NAME_ALREADY_EXIST : {id: 2, httpCode: 601, message : "User name already exist", isShowStackTrace: false},
    UNAUTHORIZED : {id: 3, httpCode: 401, message : "Login failed, invalid user name or password", isShowStackTrace: false},
    SQL_SERVER_DOWN : {id: 4, httpCode: 600, message : "SQL SERVER IS DOWN, Forward to Shraga", isShowStackTrace: false},
}

module.exports = ErrorType;