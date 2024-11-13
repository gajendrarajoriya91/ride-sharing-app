import { DriverService } from '../services/driver.service';
import { IDriver, Driver } from '../models/driver.model';
import mongoose from 'mongoose';

const driverService = new DriverService();

const driverResolver = {
  Query: {
    async getAllDrivers(_: any, args: any, context: any) {
      try {
        if (!context.user || !context.user.isAdmin) {
          return {
            statusCode: 403,
            msg: 'Access denied - User is not an admin',
            data: null,
          };
        }
        const drivers = await driverService.getAllDrivers();
        return {
          statusCode: 200,
          msg: 'Drivers fetched successfully',
          data: drivers,
        };
      } catch (error) {
        console.error('Error fetching drivers:', error);
        return {
          statusCode: 500,
          msg: 'Failed to fetch drivers',
          data: error,
        };
      }
    },

    async getDriver(_: any, { id }: { id: string }) {
      try {
        const driver = await driverService.getDriverById(id);
        if (!driver) {
          return {
            statusCode: 404,
            msg: 'Driver not found',
            data: null,
          };
        }
        return {
          statusCode: 200,
          msg: 'Driver fetched successfully',
          data: driver,
        };
      } catch (error) {
        console.error(`Error fetching driver with id ${id}:`, error);
        return {
          statusCode: 500,
          msg: 'Failed to fetch driver',
          data: error,
        };
      }
    },
  },

  Mutation: {
    async createDriver(_: any, { input }: { input: Partial<IDriver> }) {
      try {
        const driver = await driverService.createDriver(input);
        return {
          statusCode: 201,
          msg: 'Driver created successfully',
          data: driver,
        };
      } catch (error) {
        console.error('Error creating driver:', error);
        return {
          statusCode: 500,
          msg: 'Failed to create driver',
          data: error,
        };
      }
    },

    async updateDriver(
      _: any,
      { id, input }: { id: string; input: Partial<IDriver> },
    ) {
      try {
        const updatedDriver = await driverService.updateDriver(id, input);
        if (!updatedDriver) {
          return {
            statusCode: 404,
            msg: 'Driver not found',
            data: null,
          };
        }
        const populatedDriver = (await Driver.findById(updatedDriver._id)
          .populate<{
            vehicle: { _id: mongoose.Types.ObjectId; licenseNumber: string };
          }>('vehicle', '_id licenseNumber')
          .populate<{
            user: { _id: mongoose.Types.ObjectId; name: string; email: string };
          }>('user', '_id name email')) as IDriver | null;

        if (!populatedDriver) {
          return {
            statusCode: 404,
            msg: 'Driver data could not be retrieved after update',
            data: null,
          };
        }

        if (!populatedDriver.vehicle) {
          return {
            statusCode: 400,
            msg: 'Driver vehicle information is missing',
            data: null,
          };
        }

        return {
          statusCode: 200,
          msg: 'Driver updated successfully',
          data: {
            id: populatedDriver._id?.toString() || null,
            licenseNumber: populatedDriver.licenseNumber || null,
            vehicle: {
              // id: populatedDriver.vehicle._id?.toString() || null,
              licenseNumber: populatedDriver.vehicle || null,
            },
            rating: populatedDriver.rating || 0,
            ridesCompleted: populatedDriver.ridesCompleted || 0,
            updatedAt: populatedDriver.updatedAt?.toISOString() || null,
          },
        };
      } catch (error) {
        console.error(`Error updating driver with id ${id}:`, error);
        return {
          statusCode: 500,
          msg: 'Failed to update driver',
          data: error,
        };
      }
    },

    async deleteDriver(_: any, { id }: { id: string }) {
      try {
        const success = await driverService.deleteDriver(id);
        if (!success) {
          return {
            statusCode: 404,
            msg: 'Driver not found or already deleted',
            data: null,
          };
        }
        return {
          statusCode: 200,
          msg: 'Driver deleted successfully',
          data: { success },
        };
      } catch (error) {
        console.error(`Error deleting driver with id ${id}:`, error);
        return {
          statusCode: 500,
          msg: 'Failed to delete driver',
          data: error,
        };
      }
    },

    async verifyLicenseNumber(
      _: any,
      { id, input }: { id: string; input: Partial<IDriver> },
      context: any,
    ) {
      try {
        if (!context.user || !context.user.isAdmin) {
          return {
            statusCode: 403,
            msg: 'Access denied - User is not an admin',
            data: null,
          };
        }

        if (!input.licenseNumber) {
          return {
            statusCode: 400,
            msg: 'License number is required',
            data: null,
          };
        }

        const driver = await driverService.getDriverById(id);
        if (!driver) {
          return {
            statusCode: 404,
            msg: 'Driver not found',
            data: null,
          };
        }

        if (driver.licenseNumber !== input.licenseNumber) {
          return {
            statusCode: 400,
            msg: 'License number verification failed missmatch',
            data: null,
          };
        }

        const updatedDriver = await driverService.updateDriver(id, {
          isLicenseNumberVerified: true,
        });

        if (!updatedDriver) {
          return {
            statusCode: 500,
            msg: 'Failed to update driver verification status',
            data: null,
          };
        }

        return {
          statusCode: 200,
          msg: 'License number verified successfully',
          data: updatedDriver,
        };
      } catch (error) {
        console.error(
          `Error verifying license number for driver with id ${id}:`,
          error,
        );
        return {
          statusCode: 500,
          msg: 'Failed to verify license number',
          data: error,
        };
      }
    },
  },
};

export default driverResolver;
