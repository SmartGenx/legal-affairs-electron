const { prisma } = require('../utilty/prisma')
const { DatabaseError } = require('../errors/DatabaseError')
const { NotFoundError } = require('../errors/NotFoundError')
const convertEqualsToInt = require('../utilty/convertToInt')
const convertTopLevelStringBooleans = require('../utilty/convertTopLevelStringBooleans')

class EmployServices {
  async getAllEmploy(EmployFiltetr) {
    try {
      const { page, pageSize } = EmployFiltetr
      let { include } = EmployFiltetr
      let { orderBy } = EmployFiltetr
      delete EmployFiltetr.orderBy
      delete EmployFiltetr.include
      delete EmployFiltetr.page
      delete EmployFiltetr.pageSize
      if (include) {
        const convertTopLevel = convertTopLevelStringBooleans(include)
        include = convertTopLevel
      } else {
        include = {}
      }
      const convertString = convertEqualsToInt(EmployFiltetr)
      EmployFiltetr = convertString
      if (page && pageSize) {
        const skip = (+page - 1) * +pageSize
        const take = +pageSize
        const employ = await prisma.employ.findMany({
          where: { ...EmployFiltetr, isDeleted: false },
          include: include,
          skip: +skip,
          take: +take
        })
        const total = await prisma.employ.count({
          where: { ...EmployFiltetr, isDeleted: false }
        })
        return {
          info: employ,
          total,
          page,
          pageSize
        }
      }
      return await prisma.employ.findMany({
        where: { ...EmployFiltetr, isDeleted: false },
        include: include
      })
    } catch (error) {
      throw new DatabaseError('Error retrieving Role.', error)
    } finally {
      // Optional cleanup code can be added here
    }
  }
  async getEmployById(id,EmployFiltetr) {
    try {
      let { include } = EmployFiltetr
      delete EmployFiltetr.include
      if (include) {
        const convertTopLevel = convertTopLevelStringBooleans(include)
        include = convertTopLevel
      } else {
        include = {}
      }
      const employ = await prisma.employ.findUnique({
        where: { id, isDeleted: false },include
      })
      if (!employ) {
        throw new NotFoundError(`employ with id ${id} not found.`)
      }
      return employ
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error
      }
      throw new DatabaseError('Error retrieving employ.', error)
    } finally {
      // Optional cleanup code can be added here
    }
  }
  async createEmploy(EmployData, filePath) {
    try {
      const { name, reference } = EmployData

      const existingName = await prisma.employ.findFirst({
        where: { name: name, isDeleted: false }
      })
      if (existingName) {
        throw new NotFoundError(`employ with name => ( ${name} ) is exist .`)
      }

      const existingreFerence = await prisma.employ.findFirst({
        where: { reference: reference, isDeleted: false }
      })
      if (existingreFerence) {
        throw new NotFoundError(`employ with reference => ( ${reference} ) is exist .`)
      }

      const empoy = await prisma.employ.create({
        data: {
          ...EmployData,
          megor: +EmployData.megor,
          idtype: +EmployData.idtype,
          empDgree: +EmployData.empDgree,
          currentUnit: +EmployData.currentUnit,
          legalStatus: +EmployData.legalStatus,
          employeeStatus: +EmployData.employeeStatus,
          salary: +EmployData.salary
        }
      })
      await prisma.attachment.create({
        data: {
          file: filePath.length > 0 ? filePath : '',
          emploteeId: empoy.id
        }
      })
      return empoy
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error
      }
      throw new DatabaseError('Error creating employ.', error)
    } finally {
      // Optional cleanup code can be added here
    }
  }

  async updateEmploy(id, EmployData, filePath) {
    // try {
    console.log('🚀 ~ EmployServices ~ updateEmploy ~ filePath:', EmployData);


    const existingEmploy = await prisma.employ.findUnique({
      where: { id, isDeleted: false }
    })
    if (!existingEmploy) {
      throw new NotFoundError(`employ with id ${id} not found.`)
    }
    console.log('🚀 ~ EmployServices ~ updateEmploy ~ id:', { EmployData })


    // Update the employ
    const employ = await prisma.employ.update({
      where: { id },
      data:
        EmployData


    })
    const existingattachment = await prisma.attachment.findFirst({
      where: { emploteeId: +employ.id }
    })
    if (!existingattachment && filePath) {
      await prisma.attachment.create({
        data: {
          file: filePath.length > 0 ? filePath : '',
          emploteeId: employ.id
        }
      })
      return employ
    }

    if(filePath){
      await prisma.attachment.update({
        where: { id: existingattachment.id },
        data: {
          file: filePath.length > 0 ? filePath : existingattachment.file,
          emploteeId: employ.id
        }
      })
    }
    return employ
    // } catch (error) {
    //   if (error instanceof NotFoundError) {
    //     throw error
    //   }
    //   throw new DatabaseError('Error updating employ.', error)
    // }
  }

  async deleteEmploy(id) {
    try {
      const existingEmploy = await prisma.employ.findUnique({
        where: { id, isDeleted: false }
      })
      if (!existingEmploy) {
        throw new NotFoundError(`employ with id ${id} not found.`)
      }
      return await prisma.employ.update({
        where: { id },
        data: { isDeleted: true }
      })
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error
      }
      throw new DatabaseError('Error deleting employ.', error)
    } finally {
      // Optional cleanup code can be added here
    }
  }
}
module.exports = new EmployServices()
