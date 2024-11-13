const { prisma } = require('../utilty/prisma');
const { DatabaseError } = require('../errors/DatabaseError');
const { NotFoundError } = require('../errors/NotFoundError');
const convertEqualsToInt = require('../utilty/convertToInt');
const convertTopLevelStringBooleans = require('../utilty/convertTopLevelStringBooleans');

class IssueDetailsService {
    async getAllIssueDetails(IssueDetailsFilter) {
        try {
            const { page, pageSize } = IssueDetailsFilter;
            let { include } = IssueDetailsFilter;
            let { orderBy } = IssueDetailsFilter;
            delete IssueDetailsFilter.orderBy;
            delete IssueDetailsFilter.include;
            delete IssueDetailsFilter.page;
            delete IssueDetailsFilter.pageSize;

            if (include) {
                const convertTopLevel = convertTopLevelStringBooleans(include);
                include = convertTopLevel;
            } else {
                include = {};
            }

            const convertString = convertEqualsToInt(IssueDetailsFilter);
            IssueDetailsFilter = convertString;

            if (page && pageSize) {
                const skip = (+page - 1) * +pageSize;
                const take = +pageSize;
                const issueDetails = await prisma.issueDetails.findMany({
                    where: { ...IssueDetailsFilter, isDeleted: false },
                    include: include,
                    skip: +skip,
                    take: +take
                });
                const total = await prisma.issueDetails.count({
                    where: { ...IssueDetailsFilter, isDeleted: false }
                });
                return {
                    info: issueDetails,
                    total,
                    page,
                    pageSize,
                };
            }

            return await prisma.issueDetails.findMany({
                where: { ...IssueDetailsFilter, isDeleted: false },
                include: include
            });
        } catch (error) {
            throw new DatabaseError('Error retrieving IssueDetails.', error);
        } finally {
            // Optional cleanup code can be added here
        }
    }

    async getIssueDetailsById(id) {
        try {
            const issueDetails = await prisma.issueDetails.findUnique({
                where: { id, isDeleted: false },
            });
            if (!issueDetails) {
                throw new NotFoundError(`IssueDetails with id ${id} not found.`);
            }
            return issueDetails;
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            throw new DatabaseError('Error retrieving IssueDetails.', error);
        } finally {
            // Optional cleanup code can be added here
        }
    }

    async createIssueDetails(issueDetailsData) {
        try {
            const { issueId } = issueDetailsData;
            const existingIssueDetails = await prisma.issueDetails.findFirst({ where: {  issueId:issueId , isDeleted: false} });
            if (existingIssueDetails) {
                throw new NotFoundError(`IssueDetails with issueId ${issueId} already exists.`);
            }
            const existingIssue = await prisma.issue.findFirst({ where: { id: issueId, isDeleted: false } });
            if (!existingIssue) {
                throw new NotFoundError(`Issue with id ${issueId} not found.`);
            }
            return await prisma.issueDetails.create({ data: issueDetailsData });
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            throw new DatabaseError('Error creating IssueDetails.', error);
        } finally {
            // Optional cleanup code can be added here
        }
    }

    async updateIssueDetails(id, issueDetailsData) {
        try {
            return await prisma.issueDetails.update({ where: { id }, data: issueDetailsData });
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            throw new DatabaseError('Error updating IssueDetails.', error);
        } finally {
            // Optional cleanup code can be added here
        }
    }

    async deleteIssueDetails(id) {
        try {
            const existingIssueDetails = await prisma.issueDetails.findUnique({ where: { id } });
            if (!existingIssueDetails) {
                throw new NotFoundError(`IssueDetails with id ${id} not found.`);
            }
            return await prisma.issueDetails.update({ where: { id }, data: { isDeleted: true } });
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            throw new DatabaseError('Error deleting IssueDetails.', error);
        } finally {
            // Optional cleanup code can be added here
        }
    }
}

module.exports = new IssueDetailsService();
