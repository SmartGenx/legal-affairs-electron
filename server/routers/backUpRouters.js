const Router = require('express').Router
const BackUpControllers = require('../controllers/BackUpControllers')
const isAuthenticated = require('../middlewares/isAuthenticated')
const { backupDatabase } = require('../utilty/backUp')
const { restoreDatabase, upload } = require('../utilty/restoreDatabase ')

const backUpRouters = Router()

backUpRouters.get('/', isAuthenticated, BackUpControllers.getbackup)
backUpRouters.post('/', isAuthenticated, backupDatabase)
backUpRouters.post('/restore', upload.single('file'), restoreDatabase)
module.exports = backUpRouters
