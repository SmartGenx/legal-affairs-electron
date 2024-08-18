const { validationResult } = require('express-validator');
const CustomerService = require('../services/CustomerServices');
const { ApiError } = require('../errors/ApiError');
const { ValidationError } = require('../errors/ValidationError');
const { NotFoundError } = require('../errors/NotFoundError');

class CustomerController {

    async getAllCustomers(req, res, next) {
        try {
            const CustomerFilter = req.query;
            const customers = await CustomerService.getAllCustomers(CustomerFilter);
            res.status(200).json(customers);
        } catch (error) {
            console.error(error);
            next(new ApiError(500, 'Internal Server Error', `${error.message}`));
        }
    }

    async getCustomerById(req, res, next) {
        const id = Number(req.params.id);
        try {
            const customer = await CustomerService.getCustomerById(id);
            if (!customer) {
                return next(new NotFoundError(`Customer with id ${id} not found.`));
            }
            res.status(200).json(customer);
        } catch (error) {
            console.error(error);
            next(new ApiError(500, 'Internal Server Error', `${error.message}`));
        }
    }

    async createCustomer(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(new ValidationError('Validation Failed', errors.array()));
            }
            const customerData = req.body;
            const customer = await CustomerService.createCustomer(customerData);
            res.status(201).json(customer);
        } catch (error) {
            console.error(error);
            next(new ApiError(500, 'Internal Server Error', `${error.message}`));
        }
    }

    async updateCustomer(req, res, next) {
        const id = Number(req.params.id);
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(new ValidationError('Validation Failed', errors.array()));
            }
            const customerData = req.body;
            const customer = await CustomerService.updateCustomer(id, customerData);
            if (!customer) {
                return next(new NotFoundError(`Customer with id ${id} not found.`));
            }
            res.status(200).json(customer);
        } catch (error) {
            console.error(error);
            next(new ApiError(500, 'Internal Server Error', `${error.message}`));
        }
    }

    async deleteCustomer(req, res, next) {
        const id = Number(req.params.id);
        try {
            const customer = await CustomerService.deleteCustomer(id);
            if (!customer) { 
                return next(new NotFoundError(`Customer with id ${id} not found.`));
            }
            res.status(200).json(customer);
        } catch (error) {
            console.error(error);
            next(new ApiError(500, 'Internal Server Error', `${error.message}`));
        }
    }
}

module.exports = new CustomerController();
