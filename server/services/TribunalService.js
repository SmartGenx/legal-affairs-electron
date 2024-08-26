const { prisma } = require('../utilty/prisma');
const { DatabaseError } = require('../errors/DatabaseError');
const { NotFoundError } = require('../errors/NotFoundError');
const convertEqualsToInt = require('../utilty/convertToInt');
const convertTopLevelStringBooleans = require('../utilty/convertTopLevelStringBooleans');

class TribunalService {
    async getAllTribunals(TribunalFilter) {

        try {
            const { page, pageSize } = TribunalFilter;
            let { include } = TribunalFilter;
            let { orderBy } = TribunalFilter;
            delete TribunalFilter.orderBy;
            delete TribunalFilter.include;
            delete TribunalFilter.page;
            delete TribunalFilter.pageSize;

            if (include) {
                include = convertTopLevelStringBooleans(include);
            } else {
                include = {};
            }

            TribunalFilter = convertEqualsToInt(TribunalFilter);

            if (page && pageSize) {
                const skip = (+page - 1) * +pageSize;
                const take = +pageSize;
                const Tribunals = await prisma.tribunal.findMany({
                    where: { ...TribunalFilter, isDeleted: false },
                    include,
                    skip,
                    take
                });
                const total = await prisma.tribunal.count({
                    where: { ...TribunalFilter, isDeleted: false }
                });
                return {
                    info: Tribunals,
                    total,
                    page,
                    pageSize,
                };
            }

            return await prisma.tribunal.findMany({
                where: { ...TribunalFilter, isDeleted: false },
                include
            });
        } catch (error) {
            throw new DatabaseError('Error retrieving Tribunals.', error);
        }
    }

    async getTribunalById(id) {
        try {
            const Tribunal = await prisma.tribunal.findUnique({
                where: { id, isDeleted: false },
            });
            if (!Tribunal) {
                throw new NotFoundError(`Tribunal with id ${id} not found.`);
            }
            return Tribunal;
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            throw new DatabaseError('Error retrieving Tribunal.', error);
        }
    }

    async createTribunal(TribunalData) {
        try {
            const { name } = TribunalData;
            const existingTribunal = await prisma.tribunal.findFirst({ where: { name, isDeleted: false } });
            if (existingTribunal) {
                throw new NotFoundError(`Tribunal with name ${name} already exists.`);
            }
            return await prisma.Tribunal.create({ data: TribunalData });
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            throw new DatabaseError('Error creating Tribunal.', error);
        }
    }

    async updateTribunal(id, TribunalData) {
        try {
            const existingTribunal = await prisma.tribunal.findUnique({ where: { id } });
            if (!existingTribunal) {
                throw new NotFoundError(`Tribunal with id ${id} not found.`);
            }
            return await prisma.Tribunal.update({ where: { id }, data: TribunalData });
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            throw new DatabaseError('Error updating Tribunal.', error);
        }
    }

    async deleteTribunal(id) {
        try {
            const existingTribunal = await prisma.tribunal.findUnique({ where: { id } });
            if (!existingTribunal) {
                throw new NotFoundError(`Tribunal with id ${id} not found.`);
            }
            return await prisma.Tribunal.update({ where: { id }, data: { isDeleted: true } });
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            throw new DatabaseError('Error deleting Tribunal.', error);
        }
    }
}

module.exports = new TribunalService();
