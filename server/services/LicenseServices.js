const { prisma } = require("../utilty/prisma");
const { DatabaseError } = require("../errors/DatabaseError");
const { NotFoundError } = require("../errors/NotFoundError");
const convertEqualsToInt = require("../utilty/convertToInt");
const convertTopLevelStringBooleans = require("../utilty/convertTopLevelStringBooleans");

class LicenseService {
  async getAllLicenses(LicenseFilter) {
    try {
      const { page, pageSize } = LicenseFilter;
      let { include } = LicenseFilter;
      let { orderBy } = LicenseFilter;
      delete LicenseFilter.orderBy;
      delete LicenseFilter.include;
      delete LicenseFilter.page;
      delete LicenseFilter.pageSize;

      if (include) {
        include = convertTopLevelStringBooleans(include);
      } else {
        include = {};
      }

      LicenseFilter = convertEqualsToInt(LicenseFilter);

      if (page && pageSize) {
        const skip = (+page - 1) * +pageSize;
        const take = +pageSize;
        const licenses = await prisma.license.findMany({
          where: { ...LicenseFilter, isDeleted: false },
          include,
          skip,
          take,
        });
        const total = await prisma.license.count({
          where: { ...LicenseFilter, isDeleted: false },
        });
        return {
          info: licenses,
          total,
          page,
          pageSize,
        };
      }

      return await prisma.license.findMany({
        where: { ...LicenseFilter, isDeleted: false },
        include,
      });
    } catch (error) {
      throw new DatabaseError("Error retrieving Licenses.", error);
    }
  }

  async getLicenseById(id,LicenseFilter) {
    try {
      let { include } = LicenseFilter;
      delete LicenseFilter.include
      
      if (include) {
        include = convertTopLevelStringBooleans(include);
      } else {
        include = {};
      }
      const license = await prisma.license.findUnique({
        where: { id, isDeleted: false },include
      });
      if (!license) {
        throw new NotFoundError(`License with id ${id} not found.`);
      }
      return license;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError("Error retrieving License.", error);
    }
  }

  async createLicense(licenseData) {
    try {
      const { licenseNumber, customerId, licenseTypeId } = licenseData;
      const existingcustomer = await prisma.customer.findFirst({
        where: { id: customerId, isDeleted: false },
      });
      if (!existingcustomer) {
        throw new NotFoundError(
          `customer with number ${customerId} not found.`
        );
      }

      const existingLicenseType = await prisma.licenseType.findFirst({
        where: { id: licenseTypeId, isDeleted: false },
      });
      if (!existingLicenseType) {
        throw new NotFoundError(
          `LicenseType with number ${licenseTypeId} not found.`
        );
      }
      const existingLicense = await prisma.license.findFirst({
        where: {
          AND: [
            {
              licenseNumber,
              isDeleted: false,
            },
          ],
        },
      });
      if (existingLicense) {
        throw new NotFoundError(
          `License with number ${licenseNumber} already exists.`
        );
      }
      return await prisma.license.create({
        data: {
          ...licenseData,
          licenseTypeId: +licenseTypeId,
          customerId: +customerId,
          licenseYear: +licenseData.licenseYear,
          compnayCapital: +licenseData.compnayCapital,
          referenceDate: new Date(licenseData.referenceDate),
        },
      });
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError("Error creating License.", error);
    }
  }

  async updateLicense(id, licenseData) {
    try {
      const { licenseNumber, licenseTypeId, customerId } = licenseData;
      const existingLicense = await prisma.license.findUnique({
        where: { id },
      });
      if (!existingLicense) {
        throw new NotFoundError(`License with id ${id} not found.`);
      }
      if (licenseNumber) {
        const existingLicense = await prisma.license.findFirst({
          where: {
            AND: [
              {
                id: { not: id },
                licenseNumber,
                isDeleted: false,
              },
            ],
          },
        });
        if (existingLicense) {
          throw new NotFoundError(
            `License with number ${licenseNumber} already exists.`
          );
        }
      }

      if (licenseTypeId) {
        const existingLicenseType = await prisma.licenseType.findFirst({
          where: { id: licenseTypeId, isDeleted: false },
        });
        if (!existingLicenseType) {
          throw new NotFoundError(
            `license Type with number ${licenseTypeId} not found.`
          );
        }
      }

      if (customerId) {
        const existingcustomer = await prisma.customer.findFirst({
          where: { id: customerId, isDeleted: false },
        });
        if (!existingcustomer) {
          throw new NotFoundError(
            `customer with number ${customerId} not found.`
          );
        }
      }

      return await prisma.license.update({
        where: { id },
        data: {
          licenseTypeId: licenseTypeId
            ? Number(licenseTypeId)
            : existingLicense.licenseTypeId,
          customerId: customerId ? Number(customerId) : licenseData.customerId,
          licenseYear: licenseData.licenseYear
            ? Number(licenseData.licenseYear)
            : licenseData.licenseYear,
          compnayCapital: licenseData.compnayCapital
            ? Number(licenseData.compnayCapital)
            : licenseData.compnayCapital,
          licenseNumber: licenseData.licenseNumber
            ? licenseData.licenseNumber
            : existingLicense.licenseNumber,
          compnayPorpose: licenseData.compnayPorpose
            ? licenseData.compnayPorpose
            : existingLicense.compnayPorpose,
          compnayLocation: licenseData.compnayLocation
            ? licenseData.compnayLocation
            : existingLicense.compnayLocation,
          compnayManger: licenseData.compnayManger
            ? licenseData.compnayManger
            : existingLicense.compnayManger,
          referenceNum: licenseData.referenceNum
            ? licenseData.referenceNum
            : existingLicense.referenceNum,
          referenceDate: licenseData.referenceDate
            ? new Date(licenseData.referenceDate)
            : existingLicense.referenceDate,
        },
      });
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError("Error updating License.", error);
    }
  }

  async deleteLicense(id) {
    try {
      const existingLicense = await prisma.license.findUnique({
        where: { id },
      });
      if (!existingLicense) {
        throw new NotFoundError(`License with id ${id} not found.`);
      }
      return await prisma.license.update({
        where: { id },
        data: { isDeleted: true },
      });
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError("Error deleting License.", error);
    }
  }
}

module.exports = new LicenseService();
