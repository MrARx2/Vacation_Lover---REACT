let vacationDao = require("../dao/vacations-dao");
let url = 'http://localhost:3001/';

async function getAllVacations(userid) {
    let vacations = await vacationDao.getAllVacations(userid);

    for (item of vacations) {
        item.image = `${url}` + item.image;
    }

    return vacations;
}

async function addFavoriteVacation(userid , vacationId) {
    await vacationDao.addFavoriteVacation(userid, vacationId);
    return vacationId;
}

async function removeFavoriteVacation(userid , vacationId) {
    await vacationDao.removeFavoriteVacation(userid, vacationId);
    return vacationId;
}

async function updateVacation(vacation) {
    if (vacation.image != null) {
        vacation.image = vacation.image.substring(url.length, vacation.image.length);
    }
    await vacationDao.updateVacation(vacation);
    return vacation;
}

async function updateVacationWithImage(vacation, imageToDelete , newImage) {
    //new image
    if (vacation.image != null) {
        vacation.image = newImage.substring(url.length, vacation.image.length);
    }
    //image to remove
    if (imageToDelete != null){
        imageToDelete = imageToDelete.substring(url.length, imageToDelete.length);
    }
    
    await vacationDao.updateVacation(vacation);
    return imageToDelete;
}

async function addVacation(vacation) {
    if (vacation.image != null) {
        vacation.image = vacation.image.substring(url.length, vacation.image.length);
    }

    let addedVacation = await vacationDao.addVacation(vacation);
    return addedVacation;
}

async function removeVacation(vacationid, image) {
    if (image !== undefined) {
        image = image.substring(url.length, image.length);
    }
    
    await vacationDao.removeVacation(vacationid);
    return image;
}

module.exports = {
    getAllVacations,
    addFavoriteVacation,
    removeFavoriteVacation,
    updateVacation,
    updateVacationWithImage,
    addVacation,
    removeVacation,
};