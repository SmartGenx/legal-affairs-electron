const { prisma } = require('../utilty/prisma')
const { DatabaseError } = require('../errors/DatabaseError')
const { NotFoundError } = require('../errors/NotFoundError')
const convertEqualsToInt = require('../utilty/convertToInt')
const convertTopLevelStringBooleans = require('../utilty/convertTopLevelStringBooleans')

class LeaveAllocationService {
  async getAllLeaveAllocations(filter) {
    try {
      const { page, pageSize } = filter
      let { include } = filter
      let { orderBy } = filter
      delete filter.orderBy
      delete filter.include
      delete filter.page
      delete filter.pageSize

      if (include) {
        include = convertTopLevelStringBooleans(include)
      } else {
        include = {}
      }

      filter = convertEqualsToInt(filter)

      if (page && pageSize) {
        const skip = (+page - 1) * +pageSize
        const take = +pageSize
        const leaveAllocations = await prisma.leaveallocation.findMany({
          where: { ...filter, isDeleted: false },
          include,
          skip,
          take
        })
        const total = await prisma.leaveallocation.count({
          where: { ...filter, isDeleted: false }
        })
        return {
          info: leaveAllocations,
          total,
          page,
          pageSize
        }
      }

      return await prisma.leaveallocation.findMany({
        where: { ...filter, isDeleted: false },
        include
      })
    } catch (error) {
      throw new DatabaseError('Error retrieving LeaveAllocations.', error)
    }
  }

  async getLeaveAllocationById(id) {
    try {
      const leaveAllocation = await prisma.leaveallocation.findUnique({
        where: { id, isDeleted: false }
      })
      if (!leaveAllocation) {
        throw new NotFoundError(`LeaveAllocation with id ${id} not found.`)
      }
      return leaveAllocation
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error
      }
      throw new DatabaseError('Error retrieving LeaveAllocation.', error)
    }
  }

  async createLeaveAllocation(leaveAllocationData) {
    try {
      const { employeeId, leavetypeId } = leaveAllocationData
      const existingAllocation = await prisma.employ.findFirst({
        where: { id: employeeId, isDeleted: false }
      })
      if (!existingAllocation) {
        throw new NotFoundError(`employ for employeeId ${employeeId} is not exist.`)
      }

      const existingLeaveType = await prisma.leaveType.findFirst({
        where: { AND: [{ id: leavetypeId }, { isDeleted: false }] }
      })
      console.log(
        '🚀 ~ LeaveAllocationService ~ createLeaveAllocation ~ existingLeaveType:',
        existingLeaveType
      )
      if (!existingLeaveType) {
        throw new NotFoundError(`leavetype for leavetypeId ${leavetypeId} is not exist.`)
      }

      return await prisma.leaveallocation.create({
        data: {
          ...leaveAllocationData,
          employeeId: +employeeId,
          leavetypeId: +leavetypeId,
          remaingDay: +leaveAllocationData.remaingDay,
          leaveYear: +leaveAllocationData.leaveYear
        }
      })
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error
      }
      throw new DatabaseError('Error creating LeaveAllocation.', error)
    }
  }

  async updateLeaveAllocation(id, leaveAllocationData) {
    try {
      const existingAllocation = await prisma.leaveallocation.findUnique({
        where: { id }
      })
      if (!existingAllocation) {
        throw new NotFoundError(`LeaveAllocation with id ${id} not found.`)
      }
      return await prisma.leaveAllocation.update({
        where: { id },
        data: leaveAllocationData
      })
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error
      }
      throw new DatabaseError('Error updating LeaveAllocation.', error)
    }
  }

  async deleteLeaveAllocation(id) {
    try {
      const existingAllocation = await prisma.leaveallocation.findUnique({
        where: { id }
      })
      if (!existingAllocation) {
        throw new NotFoundError(`LeaveAllocation with id ${id} not found.`)
      }
      return await prisma.leaveAllocation.update({
        where: { id },
        data: { isDeleted: true }
      })
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error
      }
      throw new DatabaseError('Error deleting LeaveAllocation.', error)
    }
  }
}

module.exports = new LeaveAllocationService()
