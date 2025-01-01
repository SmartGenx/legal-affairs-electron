const { exec } = require('child_process')
const path = require('path')
const fs = require('fs')
const multer = require('multer')

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/' // Temporary folder for uploaded files
})

const deleteUploadsFolderFiles = () => {
  const uploadsDir = path.resolve('uploads')
  fs.readdir(uploadsDir, (err, files) => {
    if (err) {
      console.error(`Error reading uploads directory: ${err}`)
      return
    }

    files.forEach((file) => {
      const filePath = path.join(uploadsDir, file)
      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) {
          console.error(`Error deleting file ${filePath}: ${unlinkErr}`)
        }
      })
    })
  })
}

const restoreDatabase = async (req, res) => {
  try {
    const dbName = 'legalDB' // Target database
    const dbUser = 'postgres' // Database user
    const dbPassword = '123' // Database password
    const dbPort = 5432 // Database port

    if (!req.file) {
      return res.status(400).json({ error: 'Backup file is required.' })
    }

    const backupFilePath = path.resolve(req.file.path)

    process.env.PGPASSWORD = dbPassword

    const psqlPath = 'C:\\Program Files\\PostgreSQL\\15\\bin\\psql'
    const pgRestorePath = 'C:\\Program Files\\PostgreSQL\\15\\bin\\pg_restore'

    // Drop the database
    const dropCommand = `"${psqlPath}" -U ${dbUser} -p ${dbPort} -c "DROP DATABASE IF EXISTS ${dbName};"`
    exec(dropCommand, (dropError) => {
      if (dropError) {
        console.error(`Error dropping database: ${dropError}`)
        deleteUploadsFolderFiles() // Cleanup uploads folder even on failure
        return res.status(500).json({ error: 'Failed to drop the database.' })
      }

      // Recreate the database
      const createCommand = `"${psqlPath}" -U ${dbUser} -p ${dbPort} -c "CREATE DATABASE ${dbName};"`
      exec(createCommand, (createError) => {
        if (createError) {
          console.error(`Error creating database: ${createError}`)
          deleteUploadsFolderFiles() // Cleanup uploads folder even on failure
          return res.status(500).json({ error: 'Failed to create the database.' })
        }

        // Restore the backup
        const restoreCommand = `"${pgRestorePath}" -U ${dbUser} -d ${dbName} -p ${dbPort} --clean --if-exists "${backupFilePath}"`
        exec(restoreCommand, (restoreError, stdout, stderr) => {
          delete process.env.PGPASSWORD

          // Cleanup uploaded backup file
          try {
            if (fs.existsSync(backupFilePath)) {
              fs.unlinkSync(backupFilePath)
            } else {
              console.warn(`File not found: ${backupFilePath}`)
            }
          } catch (unlinkError) {
            console.error(`Error deleting file: ${unlinkError}`)
          }

          // Cleanup all files in uploads folder
          deleteUploadsFolderFiles()

          if (restoreError) {
            console.error(`Restore error: ${restoreError}`)
            return res.status(500).json({ error: 'Restore process failed.' })
          }

          if (stderr) {
            console.error(`Restore stderr: ${stderr}`)
            return res.status(500).json({ error: 'Error during the restore process.' })
          }

          res.status(200).json({ message: 'Backup successfully restored.' })
        })
      })
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    deleteUploadsFolderFiles() // Cleanup uploads folder on unexpected errors
    res.status(500).json({ error: 'An unexpected error occurred during the restore process.' })
  }
}

module.exports = { restoreDatabase, upload }
