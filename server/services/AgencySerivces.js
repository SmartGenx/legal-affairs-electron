const { prisma } = require('../utilty/prisma');
const { DatabaseError } = require('../errors/DatabaseError');
const { NotFoundError } = require('../errors/NotFoundError');
const convertEqualsToInt = require('../utilty/convertToInt');
const convertTopLevelStringBooleans = require('../utilty/convertTopLevelStringBooleans');

class AgencySerivces {
    async getAllAgencys(AgencyFilter) {
        try {
            const { page, pageSize } = AgencyFilter;
            let { include } = AgencyFilter;
            let { orderBy } = AgencyFilter;
            delete AgencyFilter.orderBy;
            delete AgencyFilter.include;
            delete AgencyFilter.page;
            delete AgencyFilter.pageSize;

            if (include) {
                include = convertTopLevelStringBooleans(include);
            } else {
                include = {};
            }

            AgencyFilter = convertEqualsToInt(AgencyFilter);

            if (page && pageSize) {
                const skip = (+page - 1) * +pageSize;
                const take = +pageSize;
                const Agencys = await prisma.agency.findMany({
                    where: { ...AgencyFilter, isDeleted: false },
                    include,
                    skip,
                    take
                });
                const total = await prisma.agency.count({
                    where: { ...AgencyFilter, isDeleted: false }
                });
                return {
                    info: Agencys,
                    total,
                    page,
                    pageSize,
                };
            }

            return await prisma.agency.findMany({
                where: { ...AgencyFilter, isDeleted: false },
                include
            });
        } catch (error) {
            throw new DatabaseError('Error retrieving Agencys.', error);
        }
    }

    async getAgencyById(id) {
        try {
            const Agency = await prisma.agency.findUnique({
                where: { id, isDeleted: false },
            });
            if (!Agency) {
                throw new NotFoundError(`Agency with id ${id} not found.`);
            }
            return Agency;
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            throw new DatabaseError('Error retrieving Agency.', error);
        }
    }

    async createAgency(AgencyData) {
        try {
           const {governmentOfficeId  } = AgencyData;
          const existingGovernmentOffice = await prisma.governmentOffice.findUnique({ where: { id: governmentOfficeId } });

            if (!existingGovernmentOffice) {
                throw new NotFoundError(`Government Office with ID ${governmentOfficeId} not found.`);
            }

            return await prisma.Agency.create({ data: AgencyData });
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            throw new DatabaseError('Error creating Agency.', error);
        }
    }

    async updateAgency(id, AgencyData) {
        try {
            const existingAgency = await prisma.agency.findUnique({ where: { id } });
            if (!existingAgency) {
                throw new NotFoundError(`Agency with id ${id} not found.`);
            }
            return await prisma.Agency.update({ where: { id }, data: AgencyData });
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            throw new DatabaseError('Error updating Agency.', error);
        }
    }

    async deleteAgency(id) {
        try {
            const existingAgency = await prisma.Agency.findUnique({ where: { id } });
            if (!existingAgency) {
                throw new NotFoundError(`Agency with id ${id} not found.`);
            }
            return await prisma.Agency.update({ where: { id }, data: { isDeleted: true } });
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            throw new DatabaseError('Error deleting Agency.', error);
        }
    }
}

module.exports = new AgencySerivces();
