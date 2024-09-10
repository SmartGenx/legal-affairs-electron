const multer = require('multer')
const fs = require('fs').promises
const path = require('path')
const profileDir = 'Profiles'
require('dotenv').config()

const MAX_SIZE = 2 * 1024 * 1024
const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp']

const fileFilter = (req, file, cb) => {
  if (ALLOWED_TYPES.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Invalid file type. Only PDF, JPG, PNG, and WEBP files are allowed.'), false)
  }
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_SIZE },
  fileFilter: fileFilter
})

const copyFileToProfileDir = () => async (req, res, next) => {
  console.log('🚀 ~ copyFileToProfileDir ~  req.route:', req?.route)
  if (!req.file) {
    //  next(new Error('No file uploaded'));
    next()
    return
  }

  // Generate a filename based on upload time and original name to avoid conflicts
  const timestamp = Date.now()
  const originalName = path.parse(req?.file?.originalname)?.name
  const extension = path.extname(req?.file?.originalname)
  let fileName = ''

  switch (true) {
    case req.route.path.includes('registration'):
      fileName = `${originalName}-${timestamp}-User${extension}`
      break
    case req.route.path.includes('create_decision'):
      fileName = `${originalName}-${timestamp}-decision${extension}`
      break
    case req.route.path.includes('create_generalization'):
      fileName = `${originalName}-${timestamp}-generalization${extension}`
      break
    case req.route.path.includes('create_employ'):
      fileName = `${originalName}-${timestamp}-employ${extension}`
      break

    default:
      fileName = `${originalName}-${timestamp}${extension}`
      break
  }

  const destPath = path.join(profileDir, fileName)

  try {
    // Ensure the directory exists
    await fs.mkdir(profileDir, { recursive: true })

    // Write the buffer to a new file in the profile directory
    await fs.writeFile(destPath, req.file.buffer)

    // Attach the file path to the request object
    req.file.local = fileName
    console.log('🚀 ~ copyFileToProfileDir ~  req.file.local:', req.file.local)

    // Proceed to next middleware or route handler
    next()
  } catch (error) {
    console.error('Failed to write file in profile directory', error)
    next(error)
  }
}

module.exports = { upload, copyFileToProfileDir }
