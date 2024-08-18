const { prisma } = require('../utilty/prisma');
const { DatabaseError } = require('../errors/DatabaseError');
const { NotFoundError } = require('../errors/NotFoundError');
const convertEqualsToInt = require('../utilty/convertToInt');
const convertTopLevelStringBooleans = require('../utilty/convertTopLevelStringBooleans');

class RoleService {
    // Retrieve all Roles
    async getAllRoles(roleFilter) {
        try {
            const { page, pageSize } = roleFilter;
            let { include } = roleFilter;
            let { orderBy } = roleFilter;
            delete roleFilter.orderBy;
            delete roleFilter.include;
            delete roleFilter.page;
            delete roleFilter.pageSize;
            if (include) {
                const convertTopLevel = convertTopLevelStringBooleans(include);
                include = convertTopLevel;
            } else {
                include = {};
            }
            const convertString = convertEqualsToInt(roleFilter);
            roleFilter = convertString;
            if (page && pageSize) {
                const skip = (+page - 1) * +pageSize;
                const take = +pageSize;
                const roles = await prisma.role.findMany({
                    where: roleFilter,
                    include: include,
                    skip: +skip,
                    take: +take
                });
                const total = await prisma.role.count({
                    where: roleFilter,
                });
                return {
                    info: roles,
                    total,
                    page,
                    pageSize,
                };
            }
            return await prisma.role.findMany({
                where: roleFilter,
                include: include
            });
        } catch (error) {
            throw new DatabaseError('Error retrieving Role.', error);
        } finally {
            // Optional cleanup code can be added here
        }
    }

    // Retrieve a Role by their ID
    async getRoleById(id) {
        try {
            const role = await prisma.role.findUnique({
                where: { id },
               
            });
            if (!role) {
                throw new NotFoundError(`Role with id ${id} not found.`);
            }
            return role;
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            throw new DatabaseError('Error retrieving role.', error);
        } finally {
            // Optional cleanup code can be added here
        }
    }

    // Create a new Role
    async createRole(roleData) {
        try {
            const { name } = roleData;
            // Ensure a role with the same name does not already exist
            const existingRole = await prisma.role.findFirst({
                where: { name: name},
            });

            if (existingRole) {
                throw new NotFoundError(`Role with name ${name} already exists.`);
            }
            return await prisma.role.create({
                data: roleData,
            });
        } catch (error) {
            console.log(error);

            if (error instanceof NotFoundError) {
                throw error;
            }
            throw new DatabaseError('Error creating new role.', error);
        } finally {
            // Optional cleanup code can be added here
        }
    }

    // Update an existing Role
    async updateRole(id, roleData) {
        try {
            const existingRole = await prisma.role.findUnique({ where: { id } });
            if (!existingRole) {
                throw new NotFoundError(`Role with id ${id} not found.`);
            }
            return await prisma.role.update({
                where: { id },
                data: roleData,
            });
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            throw new DatabaseError('Error updating role.', error);
        } finally {
            // Optional cleanup code can be added here
        }
    }
}

// Create an instance of the RoleService to export
module.exports = new RoleService();
