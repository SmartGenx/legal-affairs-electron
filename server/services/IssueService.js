const { prisma } = require('../utilty/prisma')
const { DatabaseError } = require('../errors/DatabaseError')
const { NotFoundError } = require('../errors/NotFoundError')
const convertEqualsToInt = require('../utilty/convertToInt')
const convertTopLevelStringBooleans = require('../utilty/convertTopLevelStringBooleans')

class IssueService {
  async getAllIssue(IssueFilter) {
    try {
      const { page, pageSize } = IssueFilter
      let { include } = IssueFilter
      let { orderBy } = IssueFilter
      delete IssueFilter.orderBy
      delete IssueFilter.include
      delete IssueFilter.page
      delete IssueFilter.pageSize
      if (include) {
        const convertTopLevel = convertTopLevelStringBooleans(include)
        include = convertTopLevel
      } else {
        include = {}
      }
      const convertString = convertEqualsToInt(IssueFilter)
      IssueFilter = convertString
      if (page && pageSize) {
        const skip = (+page - 1) * +pageSize
        const take = +pageSize
        const Issue = await prisma.issue.findMany({
          where: { ...IssueFilter, isDeleted: false },
          include: include,
          skip: +skip,
          take: +take
        })
        const total = await prisma.issue.count({
          where: { ...IssueFilter, isDeleted: false }
        })
        return {
          info: Issue,
          total,
          page,
          pageSize
        }
      }
      return await prisma.issue.findMany({
        where: { ...IssueFilter, isDeleted: false },
        include: include
      })
    } catch (error) {
      throw new DatabaseError('Error retrieving Role.', error)
    } finally {
      // Optional cleanup code can be added here
    }
  }
  async getIssueById(id) {
    try {
      const Issue = await prisma.issue.findUnique({
        where: { id }
      })
      if (!Issue) {
        throw new NotFoundError(`Issue with id ${id} not found.`)
      }
      const IssueData = await prisma.issue.findMany({ where: { isDeleted: false } })
      return IssueData
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error
      }

      throw new DatabaseError('Error retrieving Issue.', error)
    } finally {
      // Optional cleanup code can be added here
    }
  }
  async getIssueByGovernmentOfficeId(id, filterData) {
    try {
      let { include } = filterData
      delete filterData.include

      if (include) {
        const convertTopLevel = convertTopLevelStringBooleans(include)
        include = convertTopLevel
      } else {
        include = {}
      }
      const GovernmentOffice = await prisma.issue.findFirst({
        where: { governmentOfficeId: id, isDeleted: false },
        include: include
      })
      if (!GovernmentOffice) {
        throw new NotFoundError(`Issue with GovernmentOffice ${id} not found.`)
      }

      return GovernmentOffice
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error
      }

      throw new DatabaseError('Error retrieving Issue.', error)
    } finally {
      // Optional cleanup code can be added here
    }
  }
  async createIssue(IssueData) {
    try {
      const { name, governmentOfficeId, postionId } = IssueData
      const existingIssueName = await prisma.issue.findFirst({ where: { name: name } })
      if (existingIssueName) {
        throw new NotFoundError(`Issue with name ${name} already exists.`)
      }
      //------------------------------------------------------------------------------------------------
      const existinggovernmentOfficeId = await prisma.governmentOffice.findUnique({
        where: { id: governmentOfficeId }
      })
      if (!existinggovernmentOfficeId) {
        throw new NotFoundError(`governmentOffice with ID ${governmentOfficeId} not found`)
      }
      //-------------------------------------------------------------------------------------------------
      const existingpostionId = await prisma.postion.findUnique({ where: { id: postionId } })
      if (!existingpostionId) {
        throw new NotFoundError(`governmentOffice with ID ${postionId} not found`)
      }

      return await prisma.issue.create({ data: IssueData })
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error
      }
      throw new DatabaseError('Error creating Issue.', error)
    } finally {
      // Optional cleanup code can be added here
    }
  }

  async updateIssue(id, IssueData) {
    try {
      const { governmentOfficeId, postionId } = IssueData
      if (governmentOfficeId) {
        const existinggovernmentOfficeId = await prisma.governmentOffice.findUnique({
          where: { id: governmentOfficeId }
        })
        if (!existinggovernmentOfficeId) {
          throw new NotFoundError(`governmentOffice with ID ${governmentOfficeId} not found`)
        }
      }
      //-------------------------------------------------------------------------------------------------
      if (postionId) {
        const existingpostionId = await prisma.postion.findUnique({ where: { id: postionId } })
        if (!existingpostionId) {
          throw new NotFoundError(`governmentOffice with ID ${postionId} not found`)
        }
      }

      const existingIssue = await prisma.issue.findUnique({ where: { id } })
      if (!existingIssue) {
        throw new NotFoundError(`Issue with id ${id} not found.`)
      }
      return await prisma.issue.update({ where: { id }, data: IssueData })
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error
      }
      throw new DatabaseError('Error updating Issue.', error)
    } finally {
      // Optional cleanup code can be added here
    }
  }

  async deleteIssue(id) {
    try {
      const existingIssue = await prisma.issue.findUnique({ where: { id } })
      if (!existingIssue) {
        throw new NotFoundError(`Issue with id ${id} not found.`)
      }
      return await prisma.issue.update({ where: { id }, data: { isDeleted: true } })
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error
      }
      throw new DatabaseError('Error deleting Issue.', error)
    } finally {
      // Optional cleanup code can be added here
    }
  }
}
module.exports = new IssueService()
