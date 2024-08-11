const { prisma } = require('../utilty/prisma');
const { DatabaseError } = require('../errors/DatabaseError');
const { NotFoundError } = require('../errors/NotFoundError');
const convertEqualsToInt = require('../utilty/convertToInt');
const convertTopLevelStringBooleans = require('../utilty/convertTopLevelStringBooleans');

class DecisionServices {
    async getAllDecision(DecisionFiltetr) {
        try {
            const { page, pageSize } = DecisionFiltetr;
            let { include } = DecisionFiltetr;
            let { orderBy } = DecisionFiltetr;
            delete DecisionFiltetr.orderBy;
            delete DecisionFiltetr.include;
            delete DecisionFiltetr.page;
            delete DecisionFiltetr.pageSize;
            if (include) {
                const convertTopLevel = convertTopLevelStringBooleans(include);
                include = convertTopLevel;
            } else {
                include = {};
            }
            const convertString = convertEqualsToInt(DecisionFiltetr);
            DecisionFiltetr = convertString;
            if (page && pageSize) {
                const skip = (+page - 1) * +pageSize;
                const take = +pageSize;
                const decision = await prisma.decision.findMany({
                    where:{...DecisionFiltetr,  isDeleted: false},
                    include: include,
                    skip: +skip,
                    take: +take
                });
                const total = await prisma.decision.count({
                    where: {...DecisionFiltetr,  isDeleted: false}
                });
                return {
                    info: decision,
                    total,
                    page,
                    pageSize,
                };
            }
            return await prisma.decision.findMany({
                where: {...DecisionFiltetr,  isDeleted: false},
                include: include
            });
        } catch (error) {
            throw new DatabaseError('Error retrieving Role.', error);
        } finally {
            // Optional cleanup code can be added here
        }
    }
    async getDecisionById(id) {
        try {
            const decision = await prisma.decision.findUnique({
                where: { id,isDeleted:false },
            });
            if (!decision) {
                throw new NotFoundError(`decision with id ${id} not found.`);
            }
            return decision;
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            throw new DatabaseError('Error retrieving decision.', error);
        } finally {
            // Optional cleanup code can be added here
        }
    }
    async createDecision(DecisionData) {
        try {
            const { governmentOfficeId,decisionName } = DecisionData;
            const governmentOffice= await prisma.governmentOffice.findUnique({where: {id:governmentOfficeId}})
            if(!governmentOffice){
                throw new NotFoundError(`government Office with id ${id} not found `)

            }
            const Decision = await prisma.decision.findFirst({where: {decisionName: decisionName , governmentOfficeId:governmentOfficeId}});
            if (Decision) {
                throw new NotFoundError(`decision with name ${decisionName}  already exists.`);
            }
            return await prisma.decision.create({data: DecisionData});
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            throw new DatabaseError('Error creating decision.', error);
        } finally {
            // Optional cleanup code can be added here
        }
    }

    async updateDecision(id, DecisionData) {
        try {
            const { governmentOfficeId,decisionName } = DecisionData;

            const generalizationxistingDecision = await prisma.decision.findUnique({where: {id}});
            if (!generalizationxistingDecision) {
                throw new NotFoundError(`decision with id ${id} not found.`);
            }
            if(decisionName){
                const generalizationxistingDecision = await prisma.decision.findFirst({where: {decisionName: decisionName , governmentOfficeId:generalizationxistingDecision.governmentOfficeId}});
                if (generalizationxistingDecision) {
                    throw new NotFoundError(`decision with name ${decisionName}  already exists.`);
                }
            }
            if(governmentOfficeId){
                const generalizationxistingDecision = await prisma.decision.findFirst({where: {decisionName:generalizationxistingDecision.decisionName , governmentOfficeId:governmentOfficeId}});
                if (generalizationxistingDecision) {
                    throw new NotFoundError(`decision with name ${governmentOfficeId}  already exists.`);
                }
            }
            return await prisma.decision.update({where: {id}, data: DecisionData});
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            throw new DatabaseError('Error updating decision.', error);
        } finally {
            // Optional cleanup code can be added here
        }
    }

    async deleteDecision(id) {
        try {
            const generalizationxistingDecision = await prisma.decision.findUnique({where: {id}});
            if (!generalizationxistingDecision) {
                throw new NotFoundError(`decision with id ${id} not found.`);
            }
            return await prisma.decision.update({where: {id}, data: {isDeleted: true}});
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            throw new DatabaseError('Error deleting decision.', error);
        } finally {
            // Optional cleanup code can be added here
        }
    }

}
module.exports= new DecisionServices()