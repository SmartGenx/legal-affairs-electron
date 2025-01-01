const { prisma } = require('../utilty/prisma');
const { DatabaseError } = require('../errors/DatabaseError');
const { NotFoundError } = require('../errors/NotFoundError');
const convertEqualsToInt = require('../utilty/convertToInt');
const convertTopLevelStringBooleans = require('../utilty/convertTopLevelStringBooleans');

class BackUpServices {
  async getbackup(dataFillter) {
    try {
      const page = dataFillter?.page
      const pageSize = dataFillter?.pageSize
      delete dataFillter?.page
      delete dataFillter?.pageSize
      let include = dataFillter?.include
      let orderBy = dataFillter?.orderBy
      delete dataFillter?.include
      delete dataFillter?.orderBy
      if (include) {
        const convertTopLevel = convertTopLevelStringBooleans(include)
        include = convertTopLevel
      } else {
        include = {}
      }
      if (dataFillter) {
        dataFillter = convertEqualsToInt(dataFillter)
      } else {
        dataFillter = {}
      }
      if (page && pageSize) {
        const skip = (+page - 1) * +pageSize
        const take = +pageSize
        const applicant = await prisma.backUp.findMany({
          where: { ...dataFillter },
          include,
          skip: +skip,
          take: +take,
          orderBy
        })
        const total = await prisma.backUp.count({
          where: { ...dataFillter }
        })
        return {
          info: applicant,
          total,
          page,
          pageSize
        }
      }
      return await prisma.backUp.findMany({
        where: {
          ...dataFillter
        },
        include,
        orderBy
      })
    } catch (error) {
      throw new DatabaseError('Error retrieving applicants.', error)
    }
  }
  async createbackup(path, name) {
    try {

      // Construct the globalId by combining the local database ID, a UUID, and the current timestamp

      return await prisma.backUp.create({
        data: {
          path: path,
          name: name,
        }
      })
    } catch (error) {
      throw new DatabaseError('Error creating applicant.', error)
    }
  }
}

module.exports = new BackUpServices();
