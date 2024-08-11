// src/controllers/EnumController.js
const EnumServices =require("../services/EnumValueServices") ; // Adjust this import to match your actual service file
const { ApiError } =require("../errors/ApiError") ;


class EnumController {
    // Get all Enum
    async getAllEnum(req, res, next) {
        try {
            const { root, child } = req.query;
            const enums = await EnumServices.getEnum(root, child);
            res.status(200).json(enums);
        } catch (error) {
            console.log(error);
            next(new ApiError(500, 'InternalServer', `${error}`));
        }
    }
}

// Create an instance of the EnumController to export
module.exports = new EnumController();
