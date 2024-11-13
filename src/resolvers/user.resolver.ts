import { UserService } from '../services/user.service';
import { DriverService } from '../services/driver.service';
import { RideService } from '../services/ride.service';
import { VehicleService } from '../services/vehicle.service';
import { IUser } from '../models/user.model';
import redisClient from '../config/redis';

const userService = new UserService();
const rideService = new RideService();
const driverService = new DriverService();
const vehicleService = new VehicleService();

const userResolver = {
  Query: {
    async getAllUsers(_: any, args: any, context: any) {
      try {
        if (!context.user || !context.user.isAdmin) {
          return {
            statusCode: 403,
            msg: 'Access denied - User is not an admin',
            data: null,
          };
        }

        const cacheKey = 'users:all';

        const cachedUsers = await redisClient.get(cacheKey);
        if (cachedUsers) {
          console.log('Serving users from cache');
          return {
            statusCode: 200,
            msg: 'Users fetched successfully (from cache)',
            data: JSON.parse(cachedUsers),
          };
        }
        const users = await userService.getAllUsers();

        await redisClient.set(cacheKey, JSON.stringify(users), {
          EX: 3600,
        });

        return {
          statusCode: 200,
          msg: 'Users fetched successfully',
          data: users,
        };
      } catch (error) {
        console.error('Error fetching users:', error);
        return {
          statusCode: 500,
          msg: 'Failed to fetch users',
          data: error,
        };
      }
    },

    async getUser(_: any, args: any, context: any) {
      try {
        const userId = context.user.id;
        const cacheKey = `user:${userId}`;
        const cachedUser = await redisClient.get(cacheKey);

        if (cachedUser) {
          return {
            statusCode: 200,
            msg: 'User fetched successfully (cache)',
            data: JSON.parse(cachedUser),
          };
        }

        const user = await userService.getUserById(userId);
        if (!user) {
          return {
            statusCode: 404,
            msg: 'User not found',
            data: null,
          };
        }

        await redisClient.set(cacheKey, JSON.stringify(user), {
          EX: 3600,
        });

        return {
          statusCode: 200,
          msg: 'User fetched successfully',
          data: user,
        };
      } catch (error) {
        console.error(`Error fetching user with id :`, error);
        return {
          statusCode: 500,
          msg: 'Failed to fetch user',
          data: error,
        };
      }
    },
  },

  Mutation: {
    async createUser(_: any, { input }: { input: Partial<IUser> }) {
      try {
        const user = await userService.createUser(input);
        return {
          statusCode: 201,
          msg: 'User created successfully',
          data: user,
        };
      } catch (error) {
        console.error('Error creating user:', error);
        return {
          statusCode: 500,
          msg: 'Failed to create user',
          data: error,
        };
      }
    },

    async updateUser(
      _: any,
      { input }: { input: Partial<IUser> },
      context: any,
    ) {
      try {
        const id = context.user.id;
        const updatedUser = await userService.updateUser(id, input);
        if (!updatedUser) {
          return {
            statusCode: 404,
            msg: 'User not found',
            data: null,
          };
        }

        await redisClient.del(`user:${id}`);
        await redisClient.del('usersupdate:all');

        return {
          statusCode: 200,
          msg: 'User updated successfully',
          data: updatedUser,
        };
      } catch (error) {
        console.error(`Error updating user :`, error);
        return {
          statusCode: 500,
          msg: 'Failed to update user',
          data: error,
        };
      }
    },

    async deleteUser(_: any, args: any, context: any) {
      try {
        const id = context.user.id;

        const user = await userService.deleteUser(id);
        if (!user) {
          return {
            statusCode: 404,
            msg: 'User not found or already deleted',
            data: null,
          };
        }
        await vehicleService.deleteVehicleByUserId(id);
        await rideService.deleteRidesByUserId(id);
        await driverService.deleteDriverByUserId(id);

        await redisClient.del(`user:${id}`);
        await redisClient.del('users:all');

        return {
          statusCode: 200,
          msg: 'User deleted successfully',
          data: { user },
        };
      } catch (error) {
        console.error(`Error deleting user :`, error);
        return {
          statusCode: 500,
          msg: 'Failed to delete user',
          data: error,
        };
      }
    },
  },
};

export default userResolver;
