const { prisma } = require('../utilty/prisma');
const { DatabaseError } = require('../errors/DatabaseError');
const { NotFoundError } = require('../errors/NotFoundError');
const convertEqualsToInt = require('../utilty/convertToInt');
const convertTopLevelStringBooleans = require('../utilty/convertTopLevelStringBooleans');

class BookService {
    async getAllBooks(BookFilter) {
        try {
            const { page, pageSize } = BookFilter;
            let { include } = BookFilter;
            let { orderBy } = BookFilter;
            delete BookFilter.orderBy;
            delete BookFilter.include;
            delete BookFilter.page;
            delete BookFilter.pageSize;

            if (include) {
                include = convertTopLevelStringBooleans(include);
            } else {
                include = {};
            }

            BookFilter = convertEqualsToInt(BookFilter);

            if (page && pageSize) {
                const skip = (+page - 1) * +pageSize;
                const take = +pageSize;
                const books = await prisma.book.findMany({
                    where: { ...BookFilter, isDeleted: false },
                    include,
                    skip,
                    take
                });
                const total = await prisma.book.count({
                    where: { ...BookFilter, isDeleted: false }
                });
                return {
                    info: books,
                    total,
                    page,
                    pageSize,
                };
            }

            return await prisma.book.findMany({
                where: { ...BookFilter, isDeleted: false },
                include
            });
        } catch (error) {
            throw new DatabaseError('Error retrieving Books.', error);
        }
    }

    async getBookById(id) {
        try {
            const book = await prisma.book.findUnique({
                where: { id, isDeleted: false },
            });
            if (!book) {
                throw new NotFoundError(`Book with id ${id} not found.`);
            }
            return book;
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            throw new DatabaseError('Error retrieving Book.', error);
        }
    }

    async createBook(bookData) {
        try {
            const { name } = bookData;
            const existingBook = await prisma.book.findFirst({ where: { name, isDeleted: false } });
            if (existingBook) {
                throw new NotFoundError(`Book with name ${name} already exists.`);
            }
            return await prisma.book.create({ data: bookData });
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            throw new DatabaseError('Error creating Book.', error);
        }
    }

    async updateBook(id, bookData) {
        try {
            const existingBook = await prisma.book.findUnique({ where: { id } });
            if (!existingBook) {
                throw new NotFoundError(`Book with id ${id} not found.`);
            }
            return await prisma.book.update({ where: { id }, data: bookData });
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            throw new DatabaseError('Error updating Book.', error);
        }
    }

    async deleteBook(id) {
        try {
            const existingBook = await prisma.book.findUnique({ where: { id } });
            if (!existingBook) {
                throw new NotFoundError(`Book with id ${id} not found.`);
            }
            return await prisma.book.update({ where: { id }, data: { isDeleted: true } });
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            throw new DatabaseError('Error deleting Book.', error);
        }
    }
}

module.exports = new BookService();
