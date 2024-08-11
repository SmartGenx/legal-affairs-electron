const { prisma } = require('../utilty/prisma');
const { DatabaseError } = require('../errors/DatabaseError');
const { NotFoundError } = require('../errors/NotFoundError');
const convertEqualsToInt = require('../utilty/convertToInt');
const convertTopLevelStringBooleans = require('../utilty/convertTopLevelStringBooleans');

class PostionService {
    async getAllPostion(PostionFilter) {
        try {
            const { page, pageSize } = PostionFilter;
            let { include } = PostionFilter;
            let { orderBy } = PostionFilter;
            delete PostionFilter.orderBy;
            delete PostionFilter.include;
            delete PostionFilter.page;
            delete PostionFilter.pageSize;
            if (include) {
                const convertTopLevel = convertTopLevelStringBooleans(include);
                include = convertTopLevel;
            } else {
                include = {};
            }
            const convertString = convertEqualsToInt(PostionFilter);
            PostionFilter = convertString;
            if (page && pageSize) {
                const skip = (+page - 1) * +pageSize;
                const take = +pageSize;
                const Postion = await prisma.postion.findMany({
                    where:{ ...PostionFilter,  isDeleted: false},
                    include: include,
                    skip: +skip,
                    take: +take
                });
                const total = await prisma.postion.count({
                    where:{ ...PostionFilter,  isDeleted: false},
                });
                return {
                    info: Postion,
                    total,
                    page,
                    pageSize,
                };
            }
            return await prisma.postion.findMany({
                where: { ...PostionFilter,  isDeleted: false},
                include: include
            });
        } catch (error) {
            throw new DatabaseError('Error retrieving Role.', error);
        } finally {
            // Optional cleanup code can be added here
        }
    }
    async getPostionById(id) {
        try {
            const Postion = await prisma.postion.findUnique({
                where: { id },
            });
            if (!Postion) {
                throw new NotFoundError(`Postion with id ${id} not found.`);
            }
            const postionData=await prisma.postion.findMany({where:{isDeleted:false}});
            return postionData;
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            throw new DatabaseError('Error retrieving Postion.', error);
        } finally {
            // Optional cleanup code can be added here
        }
    }
    async createPostion(PostionData) {
        try {
            const { name } = PostionData;
            const existingPostion = await prisma.postion.findFirst({where: {name: name}});
            if (existingPostion) {
                throw new NotFoundError(`Postion with name ${name} already exists.`);
            }
            return await prisma.postion.create({data: PostionData});
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            throw new DatabaseError('Error creating Postion.', error);
        } finally {
            // Optional cleanup code can be added here
        }
    }

    async updatePostion(id, PostionData) {
        try {
            const existingPostion = await prisma.postion.findUnique({where: {id}});
            if (!existingPostion) {
                throw new NotFoundError(`Postion with id ${id} not found.`);
            }
            return await prisma.postion.update({where: {id}, data: PostionData});
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            throw new DatabaseError('Error updating Postion.', error);
        } finally {
            // Optional cleanup code can be added here
        }
    }

    async deletePostion(id) {
        try {
            const existingPostion = await prisma.postion.findUnique({where: {id}});
            if (!existingPostion) {
                throw new NotFoundError(`Postion with id ${id} not found.`);
            }
            return await prisma.postion.update({where: {id},data:{isDeleted:true}});
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            throw new DatabaseError('Error deleting Postion.', error);
        } finally {
            // Optional cleanup code can be added here
        }
    }

}
module.exports= new PostionService()