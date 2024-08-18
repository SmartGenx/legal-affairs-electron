const Router = require('express').Router;
const CustomerController = require('../controllers/CustomerControllers');
const isAuthenticated = require('../middlewares/isAuthenticated');

const CustomerRoutes = Router();

CustomerRoutes.get('/', isAuthenticated, CustomerController.getAllCustomers);
CustomerRoutes.get('/:id', isAuthenticated, CustomerController.getCustomerById);
CustomerRoutes.post('/', isAuthenticated, CustomerController.createCustomer);
CustomerRoutes.patch('/:id', isAuthenticated, CustomerController.updateCustomer);
CustomerRoutes.delete('/:id', isAuthenticated, CustomerController.deleteCustomer);

module.exports = CustomerRoutes;
