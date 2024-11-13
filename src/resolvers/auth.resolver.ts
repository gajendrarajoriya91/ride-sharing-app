import bcrypt from 'bcryptjs';
import {
  validateRegisterInput,
  validateLoginInput,
} from '../validations/auth.validation';
import { generateToken } from '../utils/jwt';
import { UserService } from '../services/user.service';
import { DriverService } from '../services/driver.service';
import { VehicleService } from '../services/vehicle.service';
import { IUser } from '../models/user.model';
import { IVehicle } from '../models/vehical.model';
import { IDriver } from '../models/driver.model';
import mongoose from 'mongoose';

const userService = new UserService();
const driverService = new DriverService();
const vehicleService = new VehicleService();

const authResolver = {
  Mutation: {
    async register(_: any, { input }: { input: RegisterInput }) {
      try {
        const {
          name,
          email,
          password,
          phone,
          isDriver,
          isAdmin,
          isRider,
          driverDetails,
        } = input;

        if (isAdmin) {
          const existingAdmin = await userService
            .getAllUsers()
            .then((users) => users.some((user) => user.isAdmin));
          if (existingAdmin) {
            return {
              statusCode: 400,
              msg: 'Only one admin is allowed in the system',
              data: null,
            };
          }
        }

        let finalIsRider;
        if (isDriver) {
          finalIsRider = false;
        }

        const validationErrors = validateRegisterInput(input);

        if (validationErrors.length > 0) {
          return {
            statusCode: 400,
            msg: 'Validation errors',
            data: validationErrors,
          };
        }

        const existingUser = await userService
          .getAllUsers()
          .then((users) => users.find((user) => user.email === email));
        if (existingUser) {
          return {
            statusCode: 400,
            msg: 'User already exists',
            data: null,
          };
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        let isPhoneVerified = true;

        const newUserInput = {
          name,
          email,
          password: hashedPassword,
          phone,
          isDriver,
          isAdmin,
          isRider: finalIsRider,
          isPhoneVerified,
        };

        const user = await userService.createUser(newUserInput);

        if (isDriver && driverDetails) {
          const { licenseNumber, vehicleType } = driverDetails;

          const vehicle = await vehicleService.createVehicle({
            licenseNumber,
            vehicleType,
          });

          const driverInput: Partial<IDriver> = {
            user: user._id as mongoose.Types.ObjectId,
            licenseNumber,
            vehicle: vehicle._id as mongoose.Types.ObjectId,
          };

          const driver = await driverService.createDriver(driverInput);

          if (driver._id instanceof mongoose.Types.ObjectId) {
            user.driverDetails = driver._id;
            await user.save();
          } else {
            throw new Error('Driver ID is not valid');
          }

          return {
            statusCode: 201,
            msg: 'Drriver registered successfully',
            data: { user, driver, vehicle },
          };
        }

        return {
          statusCode: 201,
          msg: 'User registered successfully',
          data: { user },
        };
      } catch (error) {
        console.error('Registration error:', error);
        return {
          statusCode: 500,
          msg: 'Internal server error',
          data: error,
        };
      }
    },

    async login(_: any, { input }: { input: LoginInput }) {
      try {
        const { email, password } = input;

        const validationErrors = validateLoginInput(input);

        if (validationErrors.length > 0) {
          return {
            statusCode: 400,
            msg: 'Validation errors',
            data: validationErrors,
          };
        }

        const user = await userService
          .getAllUsers()
          .then((users) => users.find((user) => user.email === email));
        if (!user) {
          return {
            statusCode: 400,
            msg: 'Invalid email or password',
            data: null,
          };
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          return {
            statusCode: 400,
            msg: 'Invalid email or password',
            data: null,
          };
        }

        const token = generateToken(
          user.id,
          user.isDriver,
          user.isAdmin,
          user.isRider,
        );

        return {
          statusCode: 200,
          msg: 'Login successful',
          data: { token },
        };
      } catch (error) {
        console.error('Error logging in:', error);
        throw new Error('Login failed');
      }
    },

    async logout(_: any, __: any) {
      try {
        return {
          statusCode: 200,
          msg: 'Logout successful',
          data: null,
        };
      } catch (error) {
        console.error('Error logging out:', error);
        return {
          statusCode: 500,
          msg: 'Internal server error',
          data: error,
        };
      }
    },
  },
};

// Define types for input and context
interface RegisterInput {
  name: string;
  email: string;
  password: string;
  phone: string;
  isDriver: boolean;
  isAdmin: boolean;
  isRider: boolean;
  driverDetails: any;
}

interface LoginInput {
  email: string;
  password: string;
}

export default authResolver;
