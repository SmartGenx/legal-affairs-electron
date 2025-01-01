const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/', // Temporary folder for uploaded files
});

const restoreDatabase = async (req, res) => {
  try {
    const dbName = 'legalDB'; // Target database
    const dbUser = 'postgres'; // Database user
    const dbPassword = '12345'; // Database password
    const dbPort = 5432; // Database port

    // Check if a file is uploaded
    if (!req.file) {
      return res.status(400).json({
        error: 'Backup file is required.',
      });
    }

    // Get the path of the uploaded file
    const backupFilePath = path.resolve(req.file.path);

    // Set the PGPASSWORD environment variable
    process.env.PGPASSWORD = dbPassword;

    // Path to the `psql` executable
    const psqlPath = 'C:\\Program Files\\PostgreSQL\\15\\bin\\psql';
    const command = `"${psqlPath}" -U ${dbUser} -d ${dbName} -p ${dbPort} -f "${backupFilePath}"`;

    // Execute the restore command
    exec(command, (error, stdout, stderr) => {
      // Clear the PGPASSWORD environment variable
      delete process.env.PGPASSWORD;

      // Delete the uploaded file after processing
      try {
        if (fs.existsSync(backupFilePath)) {
          fs.unlinkSync(backupFilePath);
        } else {
          console.warn(`File not found: ${backupFilePath}`);
        }
      } catch (unlinkError) {
        console.error(`Error deleting file: ${unlinkError}`);
      }

      if (error) {
        console.error(`Restore error: ${error}`);
        return res.status(500).json({ error: 'Restore process failed.' });
      }

      if (stderr) {
        console.error(`Restore stderr: ${stderr}`);
        return res.status(500).json({ error: 'Error during the restore process.' });
      }

      res.status(200).json({
        message: 'Backup successfully restored.',
      });
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({ error: 'An unexpected error occurred during the restore process.' });
  }
};

module.exports = { restoreDatabase, upload };
