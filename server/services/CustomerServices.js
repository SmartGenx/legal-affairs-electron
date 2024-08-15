const { prisma } = require('../utilty/prisma');
const { DatabaseError } = require('../errors/DatabaseError');
const { NotFoundError } = require('../errors/NotFoundError');
const convertEqualsToInt = require('../utilty/convertToInt');
const convertTopLevelStringBooleans = require('../utilty/convertTopLevelStringBooleans');

class CustomerService {
    async getAllCustomers(CustomerFilter) {
        try {
            const { page, pageSize } = CustomerFilter;
            let { include } = CustomerFilter;
            let { orderBy } = CustomerFilter;
            delete CustomerFilter.orderBy;
            delete CustomerFilter.include;
            delete CustomerFilter.page;
            delete CustomerFilter.pageSize;

            if (include) {
                include = convertTopLevelStringBooleans(include);
            } else {
                include = {};
            }

            CustomerFilter = convertEqualsToInt(CustomerFilter);

            if (page && pageSize) {
                const skip = (+page - 1) * +pageSize;
                const take = +pageSize;
                const customers = await prisma.customer.findMany({
                    where: { ...CustomerFilter, isDeleted: false },
                    include,
                    skip,
                    take
                });
                const total = await prisma.customer.count({
                    where: { ...CustomerFilter, isDeleted: false }
                });
                return {
                    info: customers,
                    total,
                    page,
                    pageSize,
                };
            }

            return await prisma.customer.findMany({
                where: { ...CustomerFilter, isDeleted: false },
                include
            });
        } catch (error) {
            throw new DatabaseError('Error retrieving Customers.', error);
        }
    }

    async getCustomerById(id) {
        try {
            const customer = await prisma.customer.findUnique({
                where: { id, isDeleted: false },
            });
            if (!customer) {
                throw new NotFoundError(`Customer with id ${id} not found.`);
            }
            return customer;
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            throw new DatabaseError('Error retrieving Customer.', error);
        }
    }

    async createCustomer(customerData) {
        try {
            const { name } = customerData;
            const existingCustomer = await prisma.customer.findFirst({ where: { name, isDeleted: false } });
            if (existingCustomer) {
                throw new NotFoundError(`Customer with name ${name} already exists.`);
            }
            return await prisma.customer.create({ data: customerData });
        } catch (error) {
            if(error instanceof NotFoundError) {
                throw error;
            }
            throw new DatabaseError('Error creating Customer.', error);
        }
    }

    async updateCustomer(id, customerData) {
        try {
            const { name } = customerData;
            const existCustomer = await prisma.customer.findFirst({ where: { name, isDeleted: false } });
            if (existCustomer) {
                throw new NotFoundError(`Customer with name ${name} already exists.`);
            }
            const existingCustomer = await prisma.customer.findUnique({ where: { id } });
            if (!existingCustomer) {
                throw new NotFoundError(`Customer with id ${id} not found.`);
            }
            return await prisma.customer.update({ where: { id }, data: customerData });
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            throw new DatabaseError('Error updating Customer.', error);
        }
    }

    async deleteCustomer(id) {
        try {
            const existingCustomer = await prisma.customer.findUnique({ where: { id } });
            if (!existingCustomer) {
                throw new NotFoundError(`Customer with id ${id} not found.`);
            }
            return await prisma.customer.update({ where: { id }, data: { isDeleted: true } });
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            throw new DatabaseError('Error deleting Customer.', error);
        }
    }
}

module.exports = new CustomerService();
