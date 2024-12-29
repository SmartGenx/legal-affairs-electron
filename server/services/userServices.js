const { DatabaseError } = require('../errors/DatabaseError')
const { NotFoundError } = require('../errors/NotFoundError')
const { hashPassword } = require('../passport-config')
const { prisma } = require('../utilty/prisma')
const convertEqualsToInt = require('../utilty/convertToInt')
const convertTopLevelStringBooleans = require('../utilty/convertTopLevelStringBooleans')

class UserService {
  // Retrieve all Users
  async getAllUsers(userFilter) {
    try {
      const { page, pageSize } = userFilter
      let { orderBy } = userFilter
      let { include } = userFilter
      delete userFilter.orderBy
      delete userFilter.page
      delete userFilter.pageSize
      delete userFilter.include

      if (include) {
        const convertTopLevel = convertTopLevelStringBooleans(include)
        include = convertTopLevel
      } else {
        include = []
      }
      console.log(include)

      const convertString = convertEqualsToInt(userFilter)
      userFilter = convertString

      if (page && pageSize) {
        const skip = (+page - 1) * +pageSize
        const take = +pageSize
        const users = await prisma.user.findMany({
          where: { ...userFilter, isDeleted: false },
          skip: +skip,
          take: +take,
          orderBy,
          include
        })
        const total = await prisma.user.count({
          where: { ...userFilter, isDeleted: false }
        })

        const content = users.map((user) => ({
          id: user.id,
          name: user.username,
          email: user.email,
          phone: user.phone,
          address: user.address,
          image: user.image,
          roles: user.UserRole
          // Add other fields you want to include
        }))

        return {
          info: content,
          total,
          page,
          pageSize
        }
      }

      const users = await prisma.user.findMany({
        where: { ...userFilter, isDeleted: false },
        orderBy,
        include
      })
      const content = users.map((user) => ({
        id: user.id,
        name: user.username,
        email: user.email,
        phone: user.phone,
        address: user.address,
        image: user.image,
        roles: user.UserRole
        // Add other fields you want to include
      }))
      return content
    } catch (error) {
      throw new DatabaseError('Error retrieving accounting entries.', error)
    }
  }

  // Retrieve a User by their ID
  async getUserById(id) {
    try {
      const user = await prisma.user.findFirst({
        where: { id, isDeleted: false },
        select: {
          id: true,
          username: true,
          email: true,
          phone: true,
          image: true
        }
      })
      if (!user) {
        throw new NotFoundError(`User with id ${id} not found.`)
      }
      return user
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error
      }
      throw new DatabaseError('Error retrieving user.', error)
    }
  }

  // Create a new User
  async createUser(userData, filePath) {
    try {
      const { email } = userData
      const roleId = userData.roleId
      delete userData.file
      delete userData.roleId

      const existingUser = await prisma.user.findFirst({
        where: { email }
      })
      if (existingUser) {
        throw new NotFoundError(`User with email ${email} already exists.`)
      }
      const hashPass = await hashPassword(userData.password)
      const NewUser = await prisma.user.create({
        data: {
          ...userData,
          image: filePath,
          password: hashPass
        },
        select: {
          id: true,
          username: true,
          email: true,
          password: true,
          phone: true,
          image: true
        }
      })
      console.log('🚀 ~ UserService ~ createUser ~ NewUser:', NewUser.username)
      roleId.map(async (role) => {
        await prisma.userRole.create({
          data: {
            roleId: +role,
            userId: NewUser.id
          }
        })
      })

      return NewUser
    } catch (error) {
      console.log(error)

      if (error instanceof NotFoundError) {
        throw error
      }
      throw new DatabaseError('Error creating new user.', error)
    }
  }

  // Update an existing User
  async updateUser(id, userData, filePath) {
    try {
      const roleId = userData.roleId
      console.log('🚀 ~ UserService ~ updateUser ~ roleId:', roleId)
      delete userData.file
      delete userData.roleId
      const existingUser = await prisma.user.findUnique({ where: { id } })
      if (!existingUser) {
        throw new NotFoundError(`User with id ${id} not found.`)
      }
      if (existingUser.isDeleted) {
        throw new NotFoundError(`User was deleted.`)
      }

      let hashPass = ''
      if (userData.password) {
        hashPass = await hashPassword(userData.password)
      }

      const updateUser = await prisma.user.update({
        where: { id },
        data: {
          ...userData,
          image: filePath.length > 0 ? filePath : existingUser.profileImage,
          password: userData.password ? hashPass : existingUser.password
        },
        select: {
          id: true,
          username: true,
          email: true,
          password: true,
          phone: true,
          image: true
        }
      })
      console.log('🚀 ~ UserService ~ updateUser ~ updateUser:', updateUser)

      if (Array.isArray(roleId)) {
        await prisma.userRole.deleteMany()

        roleId.map(async (role) => {
          await prisma.userRole.create({
            data: {
              roleId: +role,
              userId: +updateUser.id
            }
          })
        })
      } else {
        await prisma.userRole.deleteMany({})
        await prisma.userRole.create({
          data: {
            roleId: +roleId,
            userId: +updateUser.id
          }
        })
      }

      return updateUser
    } catch (error) {
      console.log(error)

      if (error instanceof NotFoundError) {
        throw error
      }
      throw new DatabaseError('Error updating User.', error)
    }
  }

  // logout
  async logout(userData) {
    try {
      const { token } = userData
      const existingUser = await prisma.user.findFirst({
        where: {
          token: token
        }
      })
      if (!existingUser) {
        throw new NotFoundError(`User with token ${token} not found.`)
      }
      if (existingUser.isDeleted) {
        throw new NotFoundError(`User was deleted.`)
      }
      const user = await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          token: null, // Reset token?
          restToken: null // Reset token?
        }
      })
      return {
        name: user.username,
        email: user.email
      }
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error
      }
      throw new DatabaseError('Error updating User.', error)
    }
  }

  async resetUser(id, password) {
    try {
      const existingUser = await prisma.user.findUnique({ where: { id } })
      if (!existingUser) {
        throw new NotFoundError(`User with id ${id} not found.`)
      }
      if (existingUser.isDeleted) {
        throw new NotFoundError(`User was deleted.`)
      }
      const hashPass = await hashPassword(password)
      return await prisma.user.update({
        where: { id },
        data: {
          password: hashPass
        },
        select: {
          username: true,
          email: true,
          password: true,
          phone: true,
          image: true
        }
      })
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error
      }
      throw new DatabaseError('Error updating User.', error)
    }
  }

  // Delete a User by their ID
  async deleteUser(id) {
    try {
      const user = await prisma.user.findUnique({ where: { id } })
      if (!user) {
        throw new NotFoundError(`User with id ${id} not found.`)
      }
      const username = user.username
      await prisma.user.update({
        where: { id },
        data: {
          isDeleted: true
        },
        select: {
          username: true,
          email: true,
          password: true,
          phone: true,
          image: true
        }
      })
      return username
    } catch (error) {
      console.log(error)

      if (error instanceof NotFoundError) {
        throw error
      }
      throw new DatabaseError('Error deleting user.', error)
    }
  }
}

// Create an instance of the UserService to export
module.exports = new UserService()
