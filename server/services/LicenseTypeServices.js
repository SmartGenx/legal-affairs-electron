const { prisma } = require('../utilty/prisma')
const { DatabaseError } = require('../errors/DatabaseError')
const { NotFoundError } = require('../errors/NotFoundError')
const convertEqualsToInt = require('../utilty/convertToInt')
const convertTopLevelStringBooleans = require('../utilty/convertTopLevelStringBooleans')

class LicenseTypeService {
  async getAllLicenseTypes(LicenseTypeFilter) {
    try {
      const { page, pageSize } = LicenseTypeFilter
      let { include } = LicenseTypeFilter
      let { orderBy } = LicenseTypeFilter
      delete LicenseTypeFilter.orderBy
      delete LicenseTypeFilter.include
      delete LicenseTypeFilter.page
      delete LicenseTypeFilter.pageSize

      if (include) {
        include = convertTopLevelStringBooleans(include)
      } else {
        include = {}
      }

      LicenseTypeFilter = convertEqualsToInt(LicenseTypeFilter)

      if (page && pageSize) {
        const skip = (+page - 1) * +pageSize
        const take = +pageSize
        const licenseTypes = await prisma.licenseType.findMany({
          where: { ...LicenseTypeFilter, isDeleted: false },
          include,
          skip,
          take
        })
        const total = await prisma.licenseType.count({
          where: { ...LicenseTypeFilter, isDeleted: false }
        })
        return {
          info: licenseTypes,
          total,
          page,
          pageSize
        }
      }

      return await prisma.licenseType.findMany({
        where: { ...LicenseTypeFilter, isDeleted: false },
        include
      })
    } catch (error) {
      throw new DatabaseError('Error retrieving LicenseTypes.', error)
    }
  }

  async getLicenseTypeById(id) {
    try {
      const licenseType = await prisma.licenseType.findUnique({
        where: { id, isDeleted: false }
      })
      if (!licenseType) {
        throw new NotFoundError(`LicenseType with id ${id} not found.`)
      }
      return licenseType
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error
      }
      throw new DatabaseError('Error retrieving LicenseType.', error)
    }
  }

  async createLicenseType(licenseTypeData) {
    try {
      const { name } = licenseTypeData
      const existingLicenseType = await prisma.licenseType.findFirst({
        where: { name, isDeleted: false }
      })
      if (existingLicenseType) {
        throw new NotFoundError(`LicenseType with name ${name} already exists.`)
      }
      return await prisma.licenseType.create({ data: licenseTypeData })
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error
      }
      throw new DatabaseError('Error creating LicenseType.', error)
    }
  }

  async updateLicenseType(id, licenseTypeData) {
    try {
      const { name } = licenseTypeData
      const existLicenseType = await prisma.licenseType.findFirst({
        where: { name, isDeleted: false }
      })
      if (existLicenseType.id !== id) {
        throw new NotFoundError(`LicenseType with name ${name} already exists.`)
      }
      const existingLicenseType = await prisma.licenseType.findUnique({ where: { id } })
      if (!existingLicenseType) {
        throw new NotFoundError(`LicenseType with id ${id} not found.`)
      }
      return await prisma.licenseType.update({ where: { id }, data: licenseTypeData })
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error
      }
      throw new DatabaseError('Error updating LicenseType.', error)
    }
  }

  async deleteLicenseType(id) {
    try {
      const existingLicenseType = await prisma.licenseType.findUnique({ where: { id } })
      if (!existingLicenseType) {
        throw new NotFoundError(`LicenseType with id ${id} not found.`)
      }
      return await prisma.licenseType.update({ where: { id }, data: { isDeleted: true } })
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error
      }
      throw new DatabaseError('Error deleting LicenseType.', error)
    }
  }
}

module.exports = new LicenseTypeService()
