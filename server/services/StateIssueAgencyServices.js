const { prisma } = require('../utilty/prisma');
const { DatabaseError } = require('../errors/DatabaseError');
const { NotFoundError } = require('../errors/NotFoundError');
const convertEqualsToInt = require('../utilty/convertToInt');
const convertTopLevelStringBooleans = require('../utilty/convertTopLevelStringBooleans');

class StateIssueAgencyServices {
    async getAllStateIssueAgencys(StateIssueAgencyFilter) {
        try {
            const { page, pageSize } = StateIssueAgencyFilter;
            let { include } = StateIssueAgencyFilter;
            let { orderBy } = StateIssueAgencyFilter;
            delete StateIssueAgencyFilter.orderBy;
            delete StateIssueAgencyFilter.include;
            delete StateIssueAgencyFilter.page;
            delete StateIssueAgencyFilter.pageSize;

            if (include) {
                include = convertTopLevelStringBooleans(include);
            } else {
                include = {};
            }

            StateIssueAgencyFilter = convertEqualsToInt(StateIssueAgencyFilter);

            if (page && pageSize) {
                const skip = (+page - 1) * +pageSize;
                const take = +pageSize;
                const StateIssueAgencys = await prisma.stateIssueAgency.findMany({
                    where: { ...StateIssueAgencyFilter, isDeleted: false },
                    include,
                    skip,
                    take
                });
                const total = await prisma.stateIssueAgency.count({
                    where: { ...StateIssueAgencyFilter, isDeleted: false }
                });
                return {
                    info: StateIssueAgencys,
                    total,
                    page,
                    pageSize,
                };
            }

            return await prisma.stateIssueAgency.findMany({
                where: { ...StateIssueAgencyFilter, isDeleted: false },
                include
            });
        } catch (error) {
            throw new DatabaseError('Error retrieving StateIssueAgencys.', error);
        }
    }

    async getStateIssueAgencyById(id) {
        try {
            const StateIssueAgency = await prisma.stateIssueAgency.findUnique({
                where: { id, isDeleted: false },
            });
            if (!StateIssueAgency) {
                throw new NotFoundError(`StateIssueAgency with id ${id} not found.`);
            }
            return StateIssueAgency;
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            throw new DatabaseError('Error retrieving StateIssueAgency.', error);
        }
    }

    async createStateIssueAgency(StateIssueAgencyData) {
        try {
            const { agencyId,issueId } = StateIssueAgencyData;
            const existingIssue = await prisma.issue.findFirst({ where: { id: issueId, isDeleted: false } });
            if (!existingIssue) {
                throw new NotFoundError(`Issue with id ${issueId} not found.`);
            }
            const existingAgency = await prisma.agency.findFirst({ where: { id: agencyId, isDeleted: false } });
            if (!existingAgency) {
                throw new NotFoundError(`Agency with id ${agencyId} not found.`);
            }
            const existingStateIssueAgency = await prisma.stateIssueAgency.findFirst({ where: { agencyId,issueId } });
            if (existingStateIssueAgency) {
                throw new NotFoundError(`StateIssueAgency with agencyId ${agencyId} and issueId ${issueId} already exists.`);
            }


            return await prisma.StateIssueAgency.create({ data: StateIssueAgencyData });
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            throw new DatabaseError('Error creating StateIssueAgency.', error);
        }
    }

    async updateStateIssueAgency(id, StateIssueAgencyData) {
        try {
            const { agencyId,issueId } = StateIssueAgencyData;
            const existingIssue = await prisma.issue.findFirst({ where: { id: issueId, isDeleted: false } });
            if (!existingIssue) {
                throw new NotFoundError(`Issue with id ${issueId} not found.`);
            }
            const existingAgency = await prisma.agency.findFirst({ where: { id: agencyId, isDeleted: false } });
            if (!existingAgency) {
                throw new NotFoundError(`Agency with id ${agencyId} not found.`);
            }
            const existingStateIssueAgency = await prisma.stateIssueAgency.findUnique({ where: { id } });
            if (!existingStateIssueAgency) {
                throw new NotFoundError(`StateIssueAgency with id ${id} not found.`);
            }
            return await prisma.StateIssueAgency.update({ where: { id }, data: StateIssueAgencyData });
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            throw new DatabaseError('Error updating StateIssueAgency.', error);
        }
    }

    async deleteStateIssueAgency(id) {
        try {
            const existingStateIssueAgency = await prisma.stateIssueAgency.findUnique({ where: { id } });
            if (!existingStateIssueAgency) {
                throw new NotFoundError(`StateIssueAgency with id ${id} not found.`);
            }
            return await prisma.stateIssueAgency.update({ where: { id }, data: { isDeleted: true } });
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            throw new DatabaseError('Error deleting StateIssueAgency.', error);
        }
    }
}

module.exports = new StateIssueAgencyServices();
