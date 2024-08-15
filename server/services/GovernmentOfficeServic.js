const { prisma } = require('../utilty/prisma');
const { DatabaseError } = require('../errors/DatabaseError');
const { NotFoundError } = require('../errors/NotFoundError');
const convertEqualsToInt = require('../utilty/convertToInt');
const convertTopLevelStringBooleans = require('../utilty/convertTopLevelStringBooleans');

class GovernmentOfficeService {
    async getAllGovernmentOffice(GovernmentOfficeFilter) {
        try {
            const { page, pageSize } = GovernmentOfficeFilter;
            let { include } = GovernmentOfficeFilter;
            let { orderBy } = GovernmentOfficeFilter;
            delete GovernmentOfficeFilter.orderBy;
            delete GovernmentOfficeFilter.include;
            delete GovernmentOfficeFilter.page;
            delete GovernmentOfficeFilter.pageSize;
            if (include) {
                const convertTopLevel = convertTopLevelStringBooleans(include);
                include = convertTopLevel;
            } else {
                include = {};
            }
            const convertString = convertEqualsToInt(GovernmentOfficeFilter);
            GovernmentOfficeFilter = convertString;
            if (page && pageSize) {
                const skip = (+page - 1) * +pageSize;
                const take = +pageSize;
                const governmentOffice = await prisma.governmentOffice.findMany({
                    where:{...GovernmentOfficeFilter,  isDeleted: false},
                    include: include,
                    skip: +skip,
                    take: +take
                });
                const total = await prisma.governmentOffice.count({
                    where: {...GovernmentOfficeFilter,  isDeleted: false}
                });
                return {
                    info: governmentOffice,
                    total,
                    page,
                    pageSize,
                };
            }
            return await prisma.governmentOffice.findMany({
                where: {...GovernmentOfficeFilter,  isDeleted: false},
                include: include
            });
        } catch (error) {
            throw new DatabaseError('Error retrieving Role.', error);
        } finally {
            // Optional cleanup code can be added here
        }
    }
    async getGovernmentOfficeById(id) {
        try {
            const governmentOffice = await prisma.governmentOffice.findUnique({
                where: { id },
            });
            if (!governmentOffice) {
                throw new NotFoundError(`governmentOffice with id ${id} not found.`);
            }
            return governmentOffice;
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            throw new DatabaseError('Error retrieving governmentOffice.', error);
        } finally {
            // Optional cleanup code can be added here
        }
    }
    async createGovernmentOffice(governmentOfficeData) {
        try {
            const { name } = governmentOfficeData;
            const generalizationxistingGovernmentOffice = await prisma.governmentOffice.findFirst({where: {name: name}});
            if (generalizationxistingGovernmentOffice) {
                throw new NotFoundError(`governmentOffice with name ${name} already exists.`);
            }
            return await prisma.governmentOffice.create({data: governmentOfficeData});
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            throw new DatabaseError('Error creating governmentOffice.', error);
        } finally {
            // Optional cleanup code can be added here
        }
    }

    async updateGovernmentOffice(id, governmentOfficeData) {
        try {
            const generalizationxistingGovernmentOffice = await prisma.governmentOffice.findUnique({where: {id}});
            if (!generalizationxistingGovernmentOffice) {
                throw new NotFoundError(`governmentOffice with id ${id} not found.`);
            }
            return await prisma.governmentOffice.update({where: {id}, data: governmentOfficeData});
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            throw new DatabaseError('Error updating governmentOffice.', error);
        } finally {
            // Optional cleanup code can be added here
        }
    }

    async deleteGovernmentOffice(id) {
        try {
            const generalizationxistingGovernmentOffice = await prisma.governmentOffice.findUnique({where: {id}});
            if (!generalizationxistingGovernmentOffice) {
                throw new NotFoundError(`governmentOffice with id ${id} not found.`);
            }
            return await prisma.governmentOffice.update({where: {id}, data: {isDeleted: true}});
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            throw new DatabaseError('Error deleting governmentOffice.', error);
        } finally {
            // Optional cleanup code can be added here
        }
    }

}
module.exports= new GovernmentOfficeService()