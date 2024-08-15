const { validationResult } = require('express-validator');
const RoleService = require('../services/RoleService'); // Adjust this import to match your actual service file
const { ApiError } = require('../errors/ApiError');
const { ValidationError } = require('../errors/ValidationError');
const { NotFoundError } = require('../errors/NotFoundError');

class RoleController {
    // Get all Roles
    async getAllRoles(req, res, next) {
        try {
            const roleFilter = req.query;
            const roles = await RoleService.getAllRoles(roleFilter);
            res.status(200).json(roles);
        } catch (error) {
            console.log(error);
            next(new ApiError(500, 'InternalServer', `${error}`));
        }
    }

    // Get a role by ID
    async getRoleById(req, res, next) {
        const id = Number(req.params.id);
        try {
            const role = await RoleService.getRoleById(id);
            if (!role) {
                return next(new NotFoundError(`Role with id ${id} not found.`));
            }
            res.status(200).json(role);
        } catch (error) {
            console.log(error);
            next(new ApiError(500, 'InternalServer', `${error}`));
        }
    }

    // Create a new role
    async createRole(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(new ValidationError('Validation Failed', errors.array()));
            }
            const roleData = req.body;
            const newRole = await RoleService.createRole(roleData);
            res.status(201).json(newRole);
        } catch (error) {
            next(new ApiError(500, 'InternalServer', `${error}`));
        }
    }

    // Update an existing Role
    async updateRole(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(new ValidationError('Validation Failed', errors.array()));
            }
            const id = Number(req.params.id);
            const roleData = req.body;
            const updatedRole = await RoleService.updateRole(id, roleData);
            if (!updatedRole) {
                return next(new NotFoundError(`Role with id ${id} not found.`));
            }
            res.status(200).json(updatedRole);
        } catch (error) {
            next(new ApiError(500, 'InternalServer', `${error}`));
        }
    }
}

// Create an instance of the RoleController to export
module.exports = new RoleController();
