const { prisma } = require("../utilty/prisma");
const { DatabaseError } = require("../errors/DatabaseError");
const { NotFoundError } = require("../errors/NotFoundError");
const convertEqualsToInt = require("../utilty/convertToInt");
const convertTopLevelStringBooleans = require("../utilty/convertTopLevelStringBooleans");

class LeaveTypeServices {
  async getAllleaveType(LeaveTypeFiltetr) {
    try {
      const { page, pageSize } = LeaveTypeFiltetr;
      let { include } = LeaveTypeFiltetr;
      let { orderBy } = LeaveTypeFiltetr;
      delete LeaveTypeFiltetr.orderBy;
      delete LeaveTypeFiltetr.include;
      delete LeaveTypeFiltetr.page;
      delete LeaveTypeFiltetr.pageSize;
      if (include) {
        const convertTopLevel = convertTopLevelStringBooleans(include);
        include = convertTopLevel;
      } else {
        include = {};
      }
      const convertString = convertEqualsToInt(LeaveTypeFiltetr);
      LeaveTypeFiltetr = convertString;
      if (page && pageSize) {
        const skip = (+page - 1) * +pageSize;
        const take = +pageSize;
        const leaveType = await prisma.leaveType.findMany({
          where: { ...LeaveTypeFiltetr, isDeleted: false },
          include: include,
          skip: +skip,
          take: +take,
        });
        const total = await prisma.leaveType.count({
          where: { ...LeaveTypeFiltetr, isDeleted: false },
        });
        return {
          info: leaveType,
          total,
          page,
          pageSize,
        };
      }
      return await prisma.leaveType.findMany({
        where: { ...LeaveTypeFiltetr, isDeleted: false },
        include: include,
      });
    } catch (error) {
      throw new DatabaseError("Error retrieving leaveType.", error);
    } finally {
      // Optional cleanup code can be added here
    }
  }
  async getleaveTypeById(id) {
    try {
      const leaveType = await prisma.leaveType.findUnique({
        where: { id, isDeleted: false },
      });
      if (!leaveType) {
        throw new NotFoundError(`leaveType with id ${id} not found.`);
      }
      return leaveType;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError("Error retrieving leaveType.", error);
    } finally {
      // Optional cleanup code can be added here
    }
  }
  async createleaveType(leaveTypeData) {
    try {
      const { name } = leaveTypeData;
      const existingleaveType = await prisma.leaveType.findFirst({
        where: { name:name },
      });
      console.log("🚀 ~ LeaveTypeServices ~ createleaveType ~ existingleaveType:", existingleaveType)

      if (existingleaveType) {
        throw new NotFoundError(`leaveType with name ${name} already exists.`);
      }

      return await prisma.leaveType.create({ data: { ...leaveTypeData } });
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError("Error creating leaveType.", error);
    } finally {
      // Optional cleanup code can be added here
    }
  }

  async updateleaveType(id, leaveTypeData) {
    try {
      const { name } = leaveTypeData;
      const leaveType = await prisma.leaveType.findUnique({ where: { id } });
      if (!leaveType) {
        throw new NotFoundError(`leaveType with id ${id} not found.`);
      }

      const existingleaveType = await prisma.leaveType.findFirst({
        where: { name },
      });
      if (existingleaveType.id !== id) {
        throw new NotFoundError(`leaveType with name ${name} already exists.`);
      }

      // Update the leaveType
      return await prisma.leaveType.update({
        where: { id },
        data: leaveTypeData,
      });
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError("Error updating leaveType.", error);
    } finally {
      // Optional cleanup code can be added here
    }
  }

  async deleteleaveType(id) {
    try {
        const leaveType = await prisma.leaveType.findUnique({ where: { id, isDeleted: false } });
        if (!leaveType) {
          throw new NotFoundError(`leaveType with id ${id} not found.`);
        }

      return await prisma.leaveType.update({
        where: { id },
        data: { isDeleted: true },
      });
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError("Error deleting leaveType.", error);
    } finally {
      // Optional cleanup code can be added here
    }
  }
}
module.exports = new LeaveTypeServices();
