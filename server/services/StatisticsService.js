const { prisma } = require('../utilty/prisma')
const { DatabaseError } = require('../errors/DatabaseError')
const { NotFoundError } = require('../errors/NotFoundError')
const convertEqualsToInt = require('../utilty/convertToInt')
const convertTopLevelStringBooleans = require('../utilty/convertTopLevelStringBooleans')

class StatisticsService {
  async getDashboardStatistics() {
    try {
      const invitationType = await prisma.issue.groupBy({
        by: ['invitationType'],
        _count: {
          invitationType: true
        }
      })
      let arr = []
      for (let index = 0; index < invitationType.length; index++) {
        switch (invitationType[index].invitationType) {
          case 1:
            arr.push({
              جنائية: invitationType[index]._count.invitationType
            })
            break
          case 2:
            arr.push({
              مدنية: invitationType[index]._count.invitationType
            })
            break
          case 3:
            arr.push({
              تجارية: invitationType[index]._count.invitationType
            })
            break
          case 4:
            arr.push({
              إدارية: invitationType[index]._count.invitationType
            })
            break

          default:
            break
        }
      }
      const Countgeneralization = await prisma.generalization.count()
      const Countissue = await prisma.issue.count()
      const Countagency = await prisma.agency.count()
      const Countbook = await prisma.book.count()
      let employarr = []

      const employ = await prisma.employ.groupBy({
        by: ['employeeStatus'],
        _count: {
          employeeStatus: true
        }
      })
      for (let index = 0; index < employ.length; index++) {
        console.log(employ[index].employeeStatus)

        switch (employ[index].employeeStatus) {
          case 1:
            employarr.push({
              موظف: employ[index]._count.employeeStatus
            })

            break
          case 2:
            employarr.push({
              متعاقد: employ[index]._count.employeeStatus
            })

            break
          case 3:
            employarr.push({
              اجريومي: employ[index]._count.employeeStatus
            })

            break

          default:
            break
        }
      }
      let employName;
      let isueName;
      let bookName;

      const latestEmploy = await prisma.employ.findFirst({
        orderBy: {
          createdAt: 'desc'
        }
      })
      if(!latestEmploy){
        employName=''
      }
      else{
        employName=latestEmploy.name

      }
      const latestIssue = await prisma.issue.findFirst({
        orderBy: {
          createdAt: 'desc'
        }
      })
      if(!latestIssue){
        isueName=''
      }
      else{
        isueName=latestIssue.name

      }
      const latestBook = await prisma.book.findFirst({
        orderBy: {
          createdAt: 'desc'
        }
      })
      if(!latestBook){
        bookName=''
      }
      else{
        bookName=latestBook.name

      }


      return {
        invitationType: arr,
        department: {
          التعميمات: Countgeneralization,
          فضاياالدولة: Countissue,
          التوكيلات: Countagency,
          الجريدةالرسمية: Countbook
        },
        employtype: employarr,
        log: {
          latestEmploy:employName?
            `تم اضافة الموضف ${employName}`:'لم يتم اضافة قضية',

          latestIssue:  isueName?`تم اضافة قضية ${isueName}`:'لم يتم اضافة قضية',
          latestBook:bookName? `تم اضافة كتاب ${bookName}`:'لم يتم اضافة كتاب'

        }
      }
    } catch (error) {
      throw new DatabaseError(error)
    }
  }
}

module.exports = new StatisticsService()
