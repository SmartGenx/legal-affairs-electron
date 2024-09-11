/* eslint-disable no-undef */
const { prisma } = require('../utilty/prisma')
const { DatabaseError } = require('../errors/DatabaseError')
const { NotFoundError } = require('../errors/NotFoundError')
const convertEqualsToInt = require('../utilty/convertToInt')
const LeaveAllocationServices = require('../services/LeaveAllocationServices')
const LeaveTypeServices = require('../services/LeaveTypeServices')

const convertTopLevelStringBooleans = require('../utilty/convertTopLevelStringBooleans')

class LeaveDetailsService {
  async getAllLeaveDetails(LeaveDetailsFilter) {
    try {
      const { page, pageSize } = LeaveDetailsFilter
      let { include } = LeaveDetailsFilter
      let { orderBy } = LeaveDetailsFilter
      delete LeaveDetailsFilter.orderBy
      delete LeaveDetailsFilter.include
      delete LeaveDetailsFilter.page
      delete LeaveDetailsFilter.pageSize

      if (include) {
        include = convertTopLevelStringBooleans(include)
      } else {
        include = {}
      }

      LeaveDetailsFilter = convertEqualsToInt(LeaveDetailsFilter)

      if (page && pageSize) {
        const skip = (+page - 1) * +pageSize
        const take = +pageSize
        const leaveDetails = await prisma.leaveDetails.findMany({
          where: { ...LeaveDetailsFilter, isDeleted: false },
          include,
          skip,
          take
        })
        const total = await prisma.leaveDetails.count({
          where: { ...LeaveDetailsFilter, isDeleted: false }
        })
        return {
          info: leaveDetails,
          total,
          page,
          pageSize
        }
      }

      return await prisma.leaveDetails.findMany({
        where: { ...LeaveDetailsFilter, isDeleted: false },
        include
      })
    } catch (error) {
      throw new DatabaseError('Error retrieving LeaveDetails.', error)
    }
  }

  async getLeaveDetailsById(id) {
    try {
      const leaveDetails = await prisma.leaveDetails.findUnique({
        where: { id, isDeleted: false }
      })
      if (!leaveDetails) {
        throw new NotFoundError(`LeaveDetails with id ${id} not found.`)
      }
      return leaveDetails
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error
      }
      throw new DatabaseError('Error retrieving LeaveDetails.', error)
    }
  }

  async createLeaveDetails(leaveDetailsData) {
    try {
      const { employeeeId, leaveTypeId } = leaveDetailsData
      const date = new Date()
      const year = date.getFullYear()
      const existingemployeee = await prisma.employ.findFirst({
        where: {
          id: employeeeId,
          isDeleted: false
        }
      })
      if (!existingemployeee) {
        throw new NotFoundError(`employeee with id ${employeeeId} not found.`)
      }
      const existingLeaveType = await prisma.leaveType.findFirst({
        where: {
          id: leaveTypeId,
          isDeleted: false
        }
      })
      if (!existingLeaveType) {
        throw new NotFoundError(`leaveType with id ${leaveTypeId} not found.`)
      }

      const leaveDetails = await prisma.leaveDetails.create({
        data: {
          ...leaveDetailsData,
          employeeeId: +employeeeId,
          leaveTypeId: +leaveTypeId,
          year: +year,
          dayNumber: +leaveDetailsData.dayNumber
        }
      })
      const result = await prisma.leaveDetails.aggregate({
        _sum: {
          dayNumber: true
        },
        where: {
          employeeeId: employeeeId,
          leaveTypeId: leaveTypeId,
          year: +year,
          isDeleted: false
        }
      })


      const leaveType = await LeaveTypeServices.getleaveTypeById(leaveDetailsData.leaveTypeId)
      console.log(leaveType.defaultDay + 'sum' + result._sum.dayNumber)
      if (leaveType.defaultDay < result._sum.dayNumber) {
        throw new NotFoundError(`لا يمكنك اخذ اجازه `)
      }
      const dayNumber =  leaveType.defaultDay-result._sum.dayNumber
      const existingAllocation = await prisma.leaveallocation.findFirst({
        where: {
          employeeId: employeeeId,
          leavetypeId: leaveTypeId
        }
      })
      if (existingAllocation) {
        await prisma.leaveallocation.update({
          where: {
            id: existingAllocation.id
          },
          data: {
            remaingDay: dayNumber
          }
        })
      } else {
        await LeaveAllocationServices.createLeaveAllocation({
          employeeId: employeeeId,
          leavetypeId: leaveTypeId,
          remaingDay: dayNumber,
          leaveYear: +year
        })
      }

      return leaveDetails
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error
      }
      throw new DatabaseError('Error creating LeaveDetails.', error)
    }
  }

  async updateLeaveDetails(id, leaveDetailsData) {
    try {
      const existingLeaveDetails = await prisma.leaveDetails.findUnique({
        where: { id }
      })
      if (!existingLeaveDetails) {
        throw new NotFoundError(`LeaveDetails with id ${id} not found.`)
      }
      return await prisma.leaveDetails.update({
        where: { id },
        data: leaveDetailsData
      })
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error
      }
      throw new DatabaseError('Error updating LeaveDetails.', error)
    }
  }

  async deleteLeaveDetails(id) {
    try {
      const existingLeaveDetails = await prisma.leaveDetails.findUnique({
        where: { id }
      })
      if (!existingLeaveDetails) {
        throw new NotFoundError(`LeaveDetails with id ${id} not found.`)
      }
      return await prisma.leaveDetails.update({
        where: { id },
        data: { isDeleted: true }
      })
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error
      }
      throw new DatabaseError('Error deleting LeaveDetails.', error)
    }
  }
}

module.exports = new LeaveDetailsService()
