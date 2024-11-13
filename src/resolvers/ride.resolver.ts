import { RideService } from '../services/ride.service';
import { IRide } from '../models/ride.model';
import { DriverService } from '../services/driver.service';
import { VehicleService } from '../services/vehicle.service';
import redisClient from '../config/redis';

const rideService = new RideService();
const driverService = new DriverService();
const vehicleService = new VehicleService();

const rideResolver = {
  Query: {
    async getAllRides(_: any, args: any, context: any) {
      try {
        if (!context.user || !context.user.isAdmin) {
          return {
            statusCode: 403,
            msg: 'Access denied - User is not an admin',
            data: null,
          };
        }

        const cacheKey = 'rides:all';
        const cachedRides = await redisClient.get(cacheKey);

        if (cachedRides) {
          return {
            statusCode: 200,
            msg: 'Rides fetched successfully (from cache)',
            data: JSON.parse(cachedRides),
          };
        }

        const rides = await rideService.getAllRides();
        return {
          statusCode: 200,
          msg: 'Rides fetched successfully',
          data: rides,
        };
      } catch (error) {
        console.error('Error fetching rides:', error);
        return {
          statusCode: 500,
          msg: 'Failed to fetch rides',
          data: error,
        };
      }
    },

    async getRide(_: any, { id }: { id: string }) {
      try {
        const cachedUser = await redisClient.get(`user:${id}`);

        if (cachedUser) {
          return {
            statusCode: 200,
            msg: 'Ride fetched successfully (cache)',
            data: JSON.parse(cachedUser),
          };
        }

        const ride = await rideService.getRideById(id);
        if (!ride) {
          return {
            statusCode: 404,
            msg: 'Ride not found',
            data: null,
          };
        }
        return {
          statusCode: 200,
          msg: 'Ride fetched successfully',
          data: ride,
        };
      } catch (error) {
        console.error(`Error fetching ride with id ${id}:`, error);
        return {
          statusCode: 500,
          msg: 'Failed to fetch ride',
          data: error,
        };
      }
    },
  },

  Mutation: {
    async createRide(
      _: any,
      { input }: { input: Partial<IRide> },
      context: any,
    ) {
      try {
        const { driver } = input;
        if (!context.user || !context.user.isRider) {
          return {
            statusCode: 403,
            msg: 'User is not a Rider',
            data: null,
          };
        }

        input.user = context.user.id;

        const driverDetails = await driverService.getDriverById(
          driver as string,
        );

        input.vehicle = driverDetails?.vehicle;

        if (!driverDetails) {
          return {
            statusCode: 404,
            msg: 'Driver not found',
            data: null,
          };
        }

        if (!driverDetails.isLicenseNumberVerified) {
          return {
            statusCode: 400,
            msg: 'Driver license is not verified. Ride cannot be booked',
            data: null,
          };
        }

        const ride = await rideService.createRide(input);
        return {
          statusCode: 201,
          msg: 'Ride created successfully',
          data: ride,
        };
      } catch (error) {
        console.error('Error creating ride:', error);
        return {
          statusCode: 500,
          msg: 'Failed to create ride',
          data: error,
        };
      }
    },

    async updateRide(
      _: any,
      { id, input }: { id: string; input: Partial<IRide> },
    ) {
      try {
        const updatedRide = await rideService.updateRide(id, input);
        if (!updatedRide) {
          return {
            statusCode: 404,
            msg: 'Ride not found',
            data: null,
          };
        }

        await redisClient.del(`ride:${id}`);
        await redisClient.del('ridersupdate:all');

        return {
          statusCode: 200,
          msg: 'Ride updated successfully',
          data: updatedRide,
        };
      } catch (error) {
        console.error(`Error updating ride with id ${id}:`, error);
        return {
          statusCode: 500,
          msg: 'Failed to update ride',
          data: error,
        };
      }
    },

    async deleteRide(_: any, { id }: { id: string }) {
      try {
        const success = await rideService.deleteRide(id);
        if (!success) {
          return {
            statusCode: 404,
            msg: 'Ride not found or already deleted',
            data: null,
          };
        }
        return {
          statusCode: 200,
          msg: 'Ride deleted successfully',
          data: { success },
        };
      } catch (error) {
        console.error(`Error deleting ride with id ${id}:`, error);
        return {
          statusCode: 500,
          msg: 'Failed to delete ride',
          data: error,
        };
      }
    },
  },
};

export default rideResolver;
