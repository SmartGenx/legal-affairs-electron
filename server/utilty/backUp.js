const { exec } = require('child_process')
const path = require('path')
const fs = require('fs')
const  BackUpServices  = require('../services/BackUpServices') // Adjust the import path as needed
const backupDatabase = async (req, res) => {
  try {
    const dbName = 'legalDB';
    const dbUser = 'postgres';
    const dbPassword = '12345';
    const dbPort = 5432;
    const backupPath = 'D:\\backup';
    const backupName = req.body.backupName;

    if (!backupName) {
      return res.status(400).json({
        error: 'Backup name is required.',
      });
    }

    if (!fs.existsSync(backupPath)) {
      fs.mkdirSync(backupPath, { recursive: true });
    }

    const filename = `${backupName}-${Date.now()}.backup`; // Use .backup for custom format
    const outputPath = path.join(backupPath, filename);

    process.env.PGPASSWORD = dbPassword;

    const pgDumpPath = 'C:\\Program Files\\PostgreSQL\\15\\bin\\pg_dump';
    const command = `"${pgDumpPath}" -U ${dbUser} -d ${dbName} -p ${dbPort} --format=c --blobs --no-owner --clean --if-exists -f "${outputPath}"`;

    exec(command, async (error, stdout, stderr) => {
      delete process.env.PGPASSWORD;

      if (error) {
        console.error(`Backup error: ${error}`);
        return res.status(500).json({ error: 'Backup process failed.' });
      }

      if (stderr) {
        console.error(`Backup stderr: ${stderr}`);
        return res.status(500).json({ error: 'Error during the backup process.' });
      }

      try {
        await BackUpServices.createbackup(outputPath, filename);
        res.status(200).json({
          message: `Backup successfully created at ${outputPath}`,
        });
      } catch (dbError) {
        console.error('Error saving backup info to the database:', dbError);
        res.status(500).json({
          error: 'Backup created but failed to save information to the database.',
        });
      }
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({ error: 'An unexpected error occurred.' });
  }
};

module.exports = { backupDatabase };
