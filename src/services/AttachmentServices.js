const { prisma } = require('../utilty/prisma');
const { DatabaseError } = require('../errors/DatabaseError');
const { NotFoundError } = require('../errors/NotFoundError');

class AttachmentService {
    async getAllAttachments(AttachmentFilter) {
        try {
            const { page, pageSize } = AttachmentFilter;
            let { include } = AttachmentFilter;
            let { orderBy } = AttachmentFilter;
            delete AttachmentFilter.orderBy;
            delete AttachmentFilter.include;
            delete AttachmentFilter.page;
            delete AttachmentFilter.pageSize;

            if (include) {
                include = convertTopLevelStringBooleans(include);
            } else {
                include = {};
            }

            AttachmentFilter = convertEqualsToInt(AttachmentFilter);

            if (page && pageSize) {
                const skip = (+page - 1) * +pageSize;
                const take = +pageSize;
                const attachments = await prisma.attachment.findMany({
                    where: { ...AttachmentFilter, isDeleted: false },
                    include,
                    skip,
                    take
                });
                const total = await prisma.attachment.count({
                    where: { ...AttachmentFilter, isDeleted: false }
                });
                return {
                    info: attachments,
                    total,
                    page,
                    pageSize,
                };
            }

            return await prisma.attachment.findMany({
                where: { ...AttachmentFilter, isDeleted: false },
                include
            });
        } catch (error) {
            throw new DatabaseError('Error retrieving Attachments.', error);
        }
    }

    async getAttachmentById(id) {
        try {
            const attachment = await prisma.attachment.findUnique({
                where: { id, isDeleted: false },
            });
            if (!attachment) {
                throw new NotFoundError(`Attachment with id ${id} not found.`);
            }
            return attachment;
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            throw new DatabaseError('Error retrieving Attachment.', error);
        }
    }

    async createAttachment(AttachmentData, filePath) {
        try {
            const { emploteeId } = AttachmentData;
            const existingEmployee = await prisma.employ.findUnique({ where: { id: emploteeId } });
            if (!existingEmployee) {
                throw new NotFoundError(`Employee with id ${emploteeId} not found.`);
            }
            return await prisma.attachment.create({
                data: {
                    ...AttachmentData,
                    file: filePath,
                },
            });
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            throw new DatabaseError('Error creating Attachment.', error);
        }
    }

    async updateAttachment(id, AttachmentData, filePath) {
        try {
            const existingAttachment = await prisma.attachment.findUnique({ where: { id } });
            if (!existingAttachment) {
                throw new NotFoundError(`Attachment with id ${id} not found.`);
            }

            return await prisma.attachment.update({
                where: { id },
                data: {
                    ...AttachmentData,
                    file: filePath.length > 0 ? filePath : existingAttachment.file,
                },
            });
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            throw new DatabaseError('Error updating Attachment.', error);
        }
    }

    async deleteAttachment(id) {
        try {
            const existingAttachment = await prisma.attachment.findUnique({ where: { id } });
            if (!existingAttachment) {
                throw new NotFoundError(`Attachment with id ${id} not found.`);
            }
            return await prisma.attachment.update({ where: { id }, data: { isDeleted: true } });
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            throw new DatabaseError('Error deleting Attachment.', error);
        }
    }
}

module.exports = new AttachmentService();
