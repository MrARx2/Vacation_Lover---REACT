const express = require("express");
const vacationsLogic = require("../logic/vacations-logic");
const {extractUserFromAuth} = require('../util');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');

// ---------------------------
//multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
   //YOUR PATH IN GREEN
    cb(null, './uploads')
    },
    filename: function (req, file, cb) {
    cb(null, Date.now() + '-' +file.originalname)
    }
   })
   
   const upload = multer({ storage: storage }).single('file');
// ---------------------------

// Show Vacations
router.post("/getAll", async (request, response, next) => {
    let user = await extractUserFromAuth(request);

    try {
        vacations = await vacationsLogic.getAllVacations(user.id);
        response.json(vacations);

    }
    catch (error) {
        return next(error);
    }
});


router.post("/addFavorite", async (request, response, next) => {
    let user = await extractUserFromAuth(request);
    const vacationId = request.body.vacationId;
    
    try {
        let success = await vacationsLogic.addFavoriteVacation(user.id, vacationId);
        response.json(success);
    }
    catch (error) {
        console.log(error);
        return next(error);
    }
});

router.post("/removeFavorite", async (request, response, next) => {
    let user = await extractUserFromAuth(request);
    const vacationId = request.body.vacationId;
    
    try {
        let success = await vacationsLogic.removeFavoriteVacation(user.id, vacationId);
        response.json(success);
    }
    catch (error) {
        console.log(error);
        return next(error);
    }
});

router.post("/updateVacation", async (request, response, next) => {
    let user = await extractUserFromAuth(request);

    const editedVacationObj = request.body;
    let vacation = editedVacationObj.editedVacation;
    let newImage = editedVacationObj.newImage;
    let imageToDelete = editedVacationObj.imageToDelete;
    
    try {
        if (user.type != 'Admin'){
            throw '//// user without premissions tried to UPDATE vacation! ////'
        }

        if (newImage != null) {
            let imageToDeleteRealName = await vacationsLogic.updateVacationWithImage(vacation, imageToDelete, newImage);

            //remove old image
            if (imageToDeleteRealName == 'null' || imageToDeleteRealName == null){
                response.json('vacation Updated');
                return
            }
            fs.unlinkSync("./uploads/" + imageToDeleteRealName);
        }
        else {
            await vacationsLogic.updateVacation(vacation);
        }

        response.json('vacation Updated');
    }
    catch (error) {
        return next(error);
    }
});

router.post("/addVacation", async (request, response, next) => {
    let user = await extractUserFromAuth(request);
    let vacation = request.body;
    try {
        if (user.type != 'Admin'){
            throw '//// user without premissions tried to ADD vacation! ////'
        }

        await vacationsLogic.addVacation(vacation);
        response.json('vacation Added!');
    }
    catch (error) {
        return next(error);
    }
});



router.post("/removeVacation", async (request, response, next) => {
    let user = await extractUserFromAuth(request);
    
    let vacationidObj = request.body;
    let imageToDelete = vacationidObj.imageToDelete;

    try {
        if (user.type != 'Admin'){
            throw '//// user without premissions tried to REMOVE vacation! ////'
        }

        let imageToDeleteRealName = await vacationsLogic.removeVacation(vacationidObj.vacationId, imageToDelete);
        if (imageToDeleteRealName == null || imageToDeleteRealName == 'null' || imageToDeleteRealName == undefined){
            response.json('vacation has been removed');
            return;
        }
        fs.unlinkSync("./uploads/" + imageToDeleteRealName);
        response.json('vacation and image has been removed');
    }
    catch (error) {
        return next(error);
    }
});

router.post("/uploadImage", async (request, response, next) => {       
    try {
        upload(request, response, function (error) {
            if (error instanceof multer.MulterError) {
                console.log(error);
            return;
            } else if (error) {
                console.log(error);
            return;
            }
                if (request.file != null) {
                    request.file.filename = `http://localhost:3001/${request.file.filename}`;
                    console.log('uploaded' + request.file.filename);
                }
            return response.status(200).send(request.file)
            })
    }
    catch (err) {
        response.status(500).send(err.message);
    }
});

module.exports = router;