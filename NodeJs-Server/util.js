const usersLogic = require('./logic/users-logic');
  
  extractUserFromAuth = async (request) => {
    let userToken = request.headers.authorization.split(" ").pop();
    user = await usersLogic.ValidateUserByToken(userToken);

    if (user == null) {
      return null
    }
    return user;
  }

module.exports = {extractUserFromAuth}