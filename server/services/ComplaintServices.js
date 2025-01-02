const { prisma } = require('../utilty/prisma')
const { DatabaseError } = require('../errors/DatabaseError')
const { NotFoundError } = require('../errors/NotFoundError')
const convertEqualsToInt = require('../utilty/convertToInt')
const convertTopLevelStringBooleans = require('../utilty/convertTopLevelStringBooleans')

class ComplaintService {
  async getAllComplaints(ComplaintFilter) {
    try {
      const { page, pageSize } = ComplaintFilter
      let { include } = ComplaintFilter
      let { orderBy } = ComplaintFilter
      delete ComplaintFilter.orderBy
      delete ComplaintFilter.include
      delete ComplaintFilter.page
      delete ComplaintFilter.pageSize
      if (include) {
        const convertTopLevel = convertTopLevelStringBooleans(include)
        include = convertTopLevel
      } else {
        include = {}
      }
      // const convertString = convertEqualsToInt(ComplaintFilter)
      // ComplaintFilter = convertString
      if (page && pageSize) {
        const skip = (+page - 1) * +pageSize
        const take = +pageSize
        const complaints = await prisma.complaint.findMany({
          where: { ...ComplaintFilter, isDeleted: false },
          include: include,
          skip: +skip,
          take: +take
        })
        const total = await prisma.complaint.count({
          where: { ...ComplaintFilter, isDeleted: false }
        })
        return {
          info: complaints,
          total,
          page,
          pageSize
        }
      }
      return await prisma.complaint.findMany({
        where: { ...ComplaintFilter, isDeleted: false },
        include: include
      })
    } catch (error) {
      throw new DatabaseError('Error retrieving complaints.', error)
    } finally {
      // Optional cleanup code can be added here
    }
  }

  async getComplaintById(id) {
    try {
      const complaint = await prisma.complaint.findUnique({
        where: { id, isDeleted: false }
      })
      if (!complaint) {
        throw new NotFoundError(`Complaint with id ${id} not found.`)
      }
      return complaint
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error
      }
      throw new DatabaseError('Error retrieving complaint.', error)
    } finally {
      // Optional cleanup code can be added here
    }
  }

  async createComplaint(complaintData) {
    try {
      const { governmentOfficeId, name } = complaintData
      const existingComplaint = await prisma.complaint.findFirst({
        where: { name: name, governmentOfficeId: governmentOfficeId }
      })
      if (existingComplaint) {
        throw new NotFoundError(`Complaint with name ${name} already exists.`)
      }

      const existingGovernmentOffice = await prisma.governmentOffice.findUnique({
        where: { id: governmentOfficeId }
      })
      if (!existingGovernmentOffice) {
        throw new NotFoundError(`Government Office with ID ${governmentOfficeId} not found.`)
      }

      return await prisma.complaint.create({ data: complaintData })
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error
      }
      throw new DatabaseError('Error creating complaint.', error)
    } finally {
      // Optional cleanup code can be added here
    }
  }

  async updateComplaint(id, complaintData) {
    try {
      const { governmentOfficeId } = complaintData
      const existingComplaint = await prisma.complaint.findUnique({ where: { id } })
      if (!existingComplaint) {
        throw new NotFoundError(`Complaint with id ${id} not found.`)
      }

      if (governmentOfficeId) {
        const existingGovernmentOffice = await prisma.governmentOffice.findUnique({
          where: { id: governmentOfficeId }
        })
        if (!existingGovernmentOffice) {
          throw new NotFoundError(`Government Office with ID ${governmentOfficeId}   is not exist.`)
        }
      }

      return await prisma.complaint.update({ where: { id }, data: complaintData })
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error
      }
      throw new DatabaseError('Error updating complaint.', error)
    } finally {
      // Optional cleanup code can be added here
    }
  }

  async deleteComplaint(id) {
    try {
      const existingComplaint = await prisma.complaint.findUnique({ where: { id } })
      if (!existingComplaint) {
        throw new NotFoundError(`Complaint with id ${id} not found.`)
      }
      return await prisma.complaint.update({ where: { id }, data: { isDeleted: true } })
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error
      }
      throw new DatabaseError('Error deleting complaint.', error)
    } finally {
      // Optional cleanup code can be added here
    }
  }
}

module.exports = new ComplaintService()
