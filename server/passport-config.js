const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { JWT_SECRET } = require('../server/secrets')
require('dotenv').config()

const { prisma } = require('../server/utilty/prisma')

const saltRounds = 10 // The cost factor controls how much time is needed to calculate a single bcrypt hash. The higher the cost factor, the more hashing rounds are done.

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email', // Specify that the "email" field will be used instead of "username"
      passwordField: 'password' // You can also specify the password field if it's named differently
    },
    async (email, password, done) => {
      // Here you'd typically look up the user in the database
      try {
        const user = await prisma.user.findFirst({
          where: {
            email: email
          }
        })
        if (user) {
          done(null, {
            email: user.email
          })
        } else {
          done(null, false, { message: 'Incorrect email or password.' })
        }
      } catch (error) {
        done(error)
      }
    }
  )
)

// Function to generate JWT token
const generateToken = (user) => {
  const SECRET_KEY = JWT_SECRET || 'your_secret_key' // Move to environment variable
  return jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '7d' })
}

const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(saltRounds)
    const hash = await bcrypt.hash(password, salt)
    return hash
  } catch (error) {
    console.log('Error hashing password:', error)
    throw error // Rethrow or handle error appropriately
  }
}

const verifyPassword = async (submittedPassword, storedHash) => {
  try {
    const isMatch = await bcrypt.compare(submittedPassword, storedHash)
    return isMatch // true if the password matches, false otherwise
  } catch (error) {
    console.log('Error verifying password:', error)
    throw error // Rethrow or handle error appropriately
  }
}

module.exports = {
  generateToken,
  hashPassword,
  verifyPassword
}
