// src/index.js or src/app.js
const express = require('express')
const rootRouter = require('./routers/index')
const { errorMiddleware } = require('./middlewares/errorMiddleware')
const bodyParser = require('body-parser')
const passport = require('passport')
const { hashPassword } = require('./passport-config')
const util = require('util')
const fs = require('fs')
const { prisma } = require('./utilty/prisma')
const path = require('path')
const cors = require('cors')
require('dotenv').config()
const mkdir = util.promisify(fs.mkdir)
const profileDir = path.join('D:', 'ledal')
class App {
  constructor() {
    this.app = express()
    this.setMiddlewares()
    this.setRoutes()
    this.setErrorMiddlewares()
    this.setPassport()
    this.setcreateAdmin()
    this.ensureProfileDirExists(profileDir)
  }
  setPassport() {
    this.app.use(bodyParser.urlencoded({ extended: false }))
    this.app.use(bodyParser.json())

    this.app.use(passport.initialize())
  }
  async ensureProfileDirExists(profileDir) {
    try {
      await mkdir(profileDir)
    } catch (error) {
      if (error.code !== 'EEXIST') {
        throw error
      }
    }
  }

  async setcreateAdmin() {
    try {
      const userAdmin = await prisma.user.findFirst({
        where: {
          email: 'admin@example.com'
        }
      })

      if (!userAdmin) {
        const hashPass = await hashPassword('123456789')

        const user = await prisma.user.create({
          data: {
            username: 'admin',
            email: 'admin@example.com',
            password: hashPass
          }
        })

        console.log(`User created with ID: ${user.id}`)

        const rolesData = [
          'admin',
          'state-affairs',
          'the-department-of-al-lfta ',
          'decisions',
          'official-journal',
          'generalization',
          'Agency',
          'personnel-affairs',
          'settings'
        ]

        for (const roleName of rolesData) {
          const role = await prisma.role.create({
            data: {
              name: roleName
            }
          })

          console.log(`Role created with ID: ${role.id}`)

          await prisma.userRole.create({
            data: {
              roleId: role.id,
              userId: user.id // تأكد من أن لديك معرف المستخدم
            }
          })
        }

        console.log('Admin role assigned to user.')
      } else {
        console.log('user is exist')
      }
    } catch (error) {
      console.error('Error creating admin user:', error)
    }
  }

  setMiddlewares() {
    // It's good to have a middleware that parses incoming requests with JSON payloads.
    this.app.use(express.json())
    this.app.use(cors())
    this.app.use(express.urlencoded({ extended: true })) // `true` allows for rich objects and arrays to be encoded into the URL-encoded format.
    // CORS and other security-related middleware would also go here.
    const corsOptions = {
      origin: ['*'], // Specify the allowed origin
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], // Specify which methods are allowed
      allowedHeaders: ['Content-Type', 'Authorization'] // Specify which headers are allowed
    }

    this.app.use(cors(corsOptions))
  }

  setRoutes() {
    // Prefixing the routes with '/api' is a common convention for indicating that this is an API endpoint.
    this.app.use('/api', rootRouter)
    // Here you would add the other routes in a similar manner.
    // Example: this.app.use('/api/users', userRoutes);
  }

  setErrorMiddlewares() {
    // Error handling middleware should be the last middleware added.
    this.app.use(errorMiddleware)
  }

  listen() {
    const PORT = process.env.PORT || 5050 // Good use of environment variable for the PORT with a fallback.
    this.app.listen(PORT, async () => {
      console.log(`Server is running on http://localhost:${PORT}`) // Informative startup log is useful.
    })
  }
}

// This part initiates your app listening, so it makes sense to be outside of the App class.


// If you want to start the server directly from this file
if (require.main === module) {
  const app = new App()
  app.listen()
}
