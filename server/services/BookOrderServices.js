const { prisma } = require('../utilty/prisma');
const { DatabaseError } = require('../errors/DatabaseError');
const { NotFoundError } = require('../errors/NotFoundError');
const convertEqualsToInt = require('../utilty/convertToInt');
const convertTopLevelStringBooleans = require('../utilty/convertTopLevelStringBooleans');

class BookOrderService {
    async getAllBookOrders(BookOrderFilter) {
        try {
            const { page, pageSize } = BookOrderFilter;
            let { include } = BookOrderFilter;
            let { orderBy } = BookOrderFilter;
            delete BookOrderFilter.orderBy;
            delete BookOrderFilter.include;
            delete BookOrderFilter.page;
            delete BookOrderFilter.pageSize;

            if (include) {
                include = convertTopLevelStringBooleans(include);
            } else {
                include = {};
            }

            BookOrderFilter = convertEqualsToInt(BookOrderFilter);

            if (page && pageSize) {
                const skip = (+page - 1) * +pageSize;
                const take = +pageSize;
                const bookOrders = await prisma.bookOrder.findMany({
                    where: { ...BookOrderFilter, isDeleted: false },
                    include,
                    skip,
                    take
                });
                const total = await prisma.bookOrder.count({
                    where: { ...BookOrderFilter, isDeleted: false }
                });
                return {
                    info: bookOrders,
                    total,
                    page,
                    pageSize,
                };
            }

            return await prisma.bookOrder.findMany({
                where: { ...BookOrderFilter, isDeleted: false },
                include
            });
        } catch (error) {
            throw new DatabaseError('Error retrieving BookOrders.', error);
        }
    }

    async getBookOrderById(id) {
        try {
            const bookOrder = await prisma.bookOrder.findUnique({
                where: { id, isDeleted: false },
            });
            if (!bookOrder) {
                throw new NotFoundError(`BookOrder with id ${id} not found.`);
            }
            return bookOrder;
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            throw new DatabaseError('Error retrieving BookOrder.', error);
        }
    }

    async createBookOrder(bookOrderData) {
        try {
            const customer = await prisma.customer.findUnique({
                where: { id: bookOrderData.customerId },
            })
            if (!customer) {
                throw new NotFoundError(`customer with id ${bookOrderData.customerId} not found.`);
            }
            const existingBookOrder = await prisma.book.findUnique({
                where: { id: bookOrderData.bookId },
            })
            if (!existingBookOrder) {
                throw new NotFoundError(`Book with id ${bookOrderData.bookId} not found.`);
            }
            return await prisma.bookOrder.create({ data: bookOrderData });
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            throw new DatabaseError('Error creating BookOrder.', error);
        }
    }

    async updateBookOrder(id, bookOrderData) {
        try {
            const existingBookOrder = await prisma.bookOrder.findUnique({ where: { id } });
            if (!existingBookOrder) {
                throw new NotFoundError(`BookOrder with id ${id} not found.`);
            }
            return await prisma.bookOrder.update({ where: { id }, data: bookOrderData });
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            throw new DatabaseError('Error updating BookOrder.', error);
        }
    }

    async deleteBookOrder(id) {
        try {
            const existingBookOrder = await prisma.bookOrder.findUnique({ where: { id } });
            if (!existingBookOrder) {
                throw new NotFoundError(`BookOrder with id ${id} not found.`);
            }
            return await prisma.bookOrder.update({ where: { id }, data: { isDeleted: true } });
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            throw new DatabaseError('Error deleting BookOrder.', error);
        }
    }
}

module.exports = new BookOrderService();
