let connection = require("./connection-wrapper");
let ErrorType = require("../errors/error-type");
let ServerError = require("../errors/server-error");


async function getAllVacations(userid) {
    let sql = `SELECT vacations.*,
    CASE WHEN user_token IS NULL THEN false ELSE true END AS isFavorite, 
    (SELECT COUNT(*) FROM favorite_vacations 
    WHERE vacation_id = vacations.id)
    AS amountOfFollowers FROM vacations LEFT JOIN favorite_vacations 
    ON vacations.id=favorite_vacations.vacation_id && favorite_vacations.user_token=?
    ORDER BY favorite_vacations.user_token DESC`
    let parameters = [userid];
    let vacation = await connection.executeWithParameters(sql, parameters);
    return vacation;
}

async function addFavoriteVacation(userid , vacationId) {
    let sql = "INSERT INTO favorite_vacations (user_token, vacation_id)  values(?,?)";
    let parameters = [userid,vacationId];
    try {
        await connection.executeWithParameters(sql, parameters);
        return vacationId;
    }
    catch (e) {
        console.log(e);
        throw new ServerError(ErrorType.GENERAL_ERROR, sql, e);
    }
  }

  async function removeFavoriteVacation(userid , vacationId) {
    let sql = "DELETE FROM favorite_vacations WHERE user_token = ? AND vacation_id = ?";
    let parameters = [userid,vacationId];
    try {
        await connection.executeWithParameters(sql, parameters);
        return vacationId;
    }
    catch (e) {
        console.log(e);
        throw new ServerError(ErrorType.GENERAL_ERROR, sql, e);
    }
  }

async function updateVacation(vacation) {
    let sql = `UPDATE vacations
    SET
    vacations.description = ?, vacations.destination = ?, vacations.image = ?, vacations.starting = ?, vacations.ending = ? , vacations.price = ?
    WHERE vacations.id = ?;`;
    let parameters = [vacation.description, vacation.destination , vacation.image, vacation.starting, vacation.ending , vacation.price, vacation.id];
    try {
        await connection.executeWithParameters(sql, parameters);
    }
    catch (e) {
        console.log(e);
        throw new ServerError(ErrorType.GENERAL_ERROR, sql, e);
    }
} 

async function addVacation(vacation) {
    let sql = `INSERT INTO vacations
    VALUES (? , ? , ? , ? , ? , ? , ?);`

    let parameters = [vacation.id, vacation.description, vacation.destination , vacation.image, vacation.starting, vacation.ending , vacation.price];
    try {
        await connection.executeWithParameters(sql, parameters);
    }
    catch (e) {
        console.log(e);
        throw new ServerError(ErrorType.GENERAL_ERROR, sql, e);
    }
} 

async function removeVacation(vacationid) {
    let sql = `DELETE FROM vacations WHERE id=?;`

    let parameters = [vacationid];
    try {
        await connection.executeWithParameters(sql, parameters);
    }
    catch (e) {
        console.log(e);
        throw new ServerError(ErrorType.GENERAL_ERROR, sql, e);
    }
} 



module.exports = {
    getAllVacations,
    addFavoriteVacation,
    removeFavoriteVacation,
    updateVacation,
    addVacation,
    removeVacation,
};