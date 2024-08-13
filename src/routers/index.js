const { Router } = require('express');

const AuthRoutes = require('./AuthRouters');
const RoleRoutes = require('./RoleRoutes');
const UserRoutes = require('./userRoutes');
const PostionRoutes = require('./PostionRoutes');
const GovernmentOfficeRoutes = require('./GovernmentOfficeRoutes');
const Issue = require('./IssueRouters');
const EnumRoutes = require('./EnumValueRouters');
const IssueDetails = require('./IssueDetailsRouters');
const ComplaintRoutes =require('./ComplaintRouters');
const GeneralizationRoutes =require("./GeneralizationRoutes");
const DecisionRoutes =require('./DecisionRputers')
const LeaveTypeRoutes=require('./LeaveTypeRouters')
const EmployRoutes= require('./EmployRouters')
const LicenseTypeRoutes=require('./LicenseTypeRoutes')
const LicenseRoutes =require('./LicenseRoutes.js')
const LeaveDetailsRoutes = require('./leaveDetailsRouters');
const LeaveAllocationRoutes = require('./LeaveAllocationRouters');
const CustomerRoutes= require('./CustomerRoutes');
const BookRoutes= require('./BookRouters');
const BookOrderRoutes= require('./BookOrderRoutes');


const rootRouter = Router();

rootRouter.use('/auth', AuthRoutes);
rootRouter.use('/role', RoleRoutes);
rootRouter.use('/user', UserRoutes);
rootRouter.use('/position', PostionRoutes);
rootRouter.use('/government-office', GovernmentOfficeRoutes);
rootRouter.use('/issue', Issue);
rootRouter.use('/enum', EnumRoutes);
rootRouter.use('/issue-details', IssueDetails);
rootRouter.use('/complaint', ComplaintRoutes);
rootRouter.use('/generalization',GeneralizationRoutes)
rootRouter.use('/decision',DecisionRoutes)
rootRouter.use('/leave-type',LeaveTypeRoutes)
rootRouter.use('/employ',EmployRoutes)
rootRouter.use('/license-type',LicenseTypeRoutes)
rootRouter.use('/license',LicenseRoutes)
rootRouter.use('/leave-details',LeaveDetailsRoutes)
rootRouter.use('/leave-allocation',LeaveAllocationRoutes)
rootRouter.use('/customer',CustomerRoutes)
rootRouter.use('/book',BookRoutes)
rootRouter.use('/book-order',BookOrderRoutes)


module.exports = rootRouter;
