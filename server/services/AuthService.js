const { prisma } = require('../utilty/prisma')
const { DatabaseError } = require('../errors/DatabaseError')
const { NotFoundError } = require('../errors/NotFoundError')
const passport = require('passport')
const { generateToken, hashPassword, verifyPassword } = require('../passport-config')

module.exports = class AuthService {
  static login(req, res, next) {
    try {
      passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err || !user) {
          console.log(err)

          return res.status(400).json({
            message: info ? info.message : 'Login failed',
            user: user
          })
        }

        req.login(user, { session: false }, async (err) => {
          try {
            if (err) {
              res.send(err)
            }
            const auth = await prisma.user.findFirst({
              where: {
                email: user.email
              }
            })
            if (!auth) {
              return res.status(404).json({ message: 'User not found.' })
            }
            if (auth.isDeleted) {
              return res.status(404).json({ message: 'User was deleted.' })
            }
            const password = req.body.password
            const isPasswordCorrect = await verifyPassword(password, auth.password)
            console.log(isPasswordCorrect)

            if (isPasswordCorrect) {
              // generate a signed json web token with the contents of user object and return it in the response
              const token = generateToken(user)
              const currentDate = new Date()
              await prisma.user.update({
                where: { id: auth.id },
                data: {
                  token: token,
                  restToken: new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000)
                }
              })
              let role=[]
              const userRole=await prisma.userRole.findMany({where:{userId:auth.id}})

              for (let index = 0; index < userRole.length; index++) {
               role.push(userRole[index].roleId)

              }




              return res.json({
                user: {
                  username: auth.username,
                  email: auth.email
                },
                role:role,
                token
              })
            } else {
              return res.status(400).json({
                message: info ? info.message : 'Login failed1',
                user: user
              })
            }
          } catch (error) {
            next(error)
          } finally {
            // Add any necessary cleanup code here
          }
        })
      })(req, res)
    } catch (error) {
      if (error instanceof NotFoundError) {
        next(error)
      } else {
        next(new DatabaseError('Error creating new Activity.', error))
      }
    }
  }
}
