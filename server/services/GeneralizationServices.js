const { prisma } = require('../utilty/prisma')
const { DatabaseError } = require('../errors/DatabaseError')
const { NotFoundError } = require('../errors/NotFoundError')
const convertEqualsToInt = require('../utilty/convertToInt')
const convertTopLevelStringBooleans = require('../utilty/convertTopLevelStringBooleans')

class GeneralizationServices {
  async getAllgeneralization(generalizationfilter) {
    try {
      const { page, pageSize } = generalizationfilter
      let { include } = generalizationfilter
      let { orderBy } = generalizationfilter
      delete generalizationfilter.orderBy
      delete generalizationfilter.include
      delete generalizationfilter.page
      delete generalizationfilter.pageSize
      if (include) {
        const convertTopLevel = convertTopLevelStringBooleans(include)
        include = convertTopLevel
      } else {
        include = {}
      }
      const convertString = convertEqualsToInt(generalizationfilter)
      generalizationfilter = convertString
      if (page && pageSize) {
        const skip = (+page - 1) * +pageSize
        const take = +pageSize
        const generalization = await prisma.generalization.findMany({
          where: { ...generalizationfilter, isDeleted: false },
          include: include,
          skip: +skip,
          take: +take
        })
        const total = await prisma.generalization.count({
          where: { ...generalizationfilter, isDeleted: false }
        })
        return {
          info: generalization,
          total,
          page,
          pageSize
        }
      }
      return await prisma.generalization.findMany({
        where: { ...generalizationfilter, isDeleted: false },
        include: include
      })
    } catch (error) {
      throw new DatabaseError('Error retrieving Role.', error)
    } finally {
      // Optional cleanup code can be added here
    }
  }
  async getgeneralizationById(id) {
    try {
      const generalization = await prisma.generalization.findUnique({
        where: { id, isDeleted: false }
      })
      if (!generalization) {
        throw new NotFoundError(`generalization with id ${id} not found.`)
      }
      return generalization
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error
      }
      throw new DatabaseError('Error retrieving generalization.', error)
    } finally {
      // Optional cleanup code can be added here
    }
  }
  async creategeneralization(generalizationData, filePath) {
    try {
      const { title } = generalizationData
      const generalizationExist = await prisma.generalization.findFirst({ where: { title: title } })
      if (generalizationExist) {
        throw new NotFoundError(`generalization with title ${title} already exists.`)
      }
      return await prisma.generalization.create({
        data: { ...generalizationData, attachmentPath: filePath }
      })
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error
      }
      throw new DatabaseError('Error creating generalization.', error)
    } finally {
      // Optional cleanup code can be added here
    }
  }

  async updategeneralization(id, generalizationData, filePath) {
    try {
      const generalizationExist = await prisma.generalization.findUnique({ where: { id } })
      if (!generalizationExist) {
        throw new NotFoundError(`generalization with id ${id} not found.`)
      }
      return await prisma.generalization.update({
        where: { id },
        data: {
          ...generalizationData,
          attachmentPath: filePath.length > 0 ? filePath : generalizationExist.attachmentPath
        }
      })
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error
      }
      throw new DatabaseError('Error updating generalization.', error)
    } finally {
      // Optional cleanup code can be added here
    }
  }

  async deletegeneralization(id) {
    try {
      const generalizationExist = await prisma.generalization.findUnique({ where: { id } })
      if (!generalizationExist) {
        throw new NotFoundError(`generalization with id ${id} not found.`)
      }
      return await prisma.generalization.update({ where: { id }, data: { isDeleted: true } })
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error
      }
      throw new DatabaseError('Error deleting generalization.', error)
    } finally {
      // Optional cleanup code can be added here
    }
  }
}
module.exports = new GeneralizationServices()
