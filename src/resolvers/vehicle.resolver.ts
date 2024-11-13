import { VehicleService } from '../services/vehicle.service';
import { IVehicle } from '../models/vehical.model';
import { DriverService } from '../services/driver.service';

const vehicleService = new VehicleService();
const driverService = new DriverService();

const vehicleResolver = {
  Query: {
    async getAllVehicles(_: any, args: any, context: any) {
      try {
        if (!context.user || !context.user.isAdmin) {
          return {
            statusCode: 403,
            msg: 'Access denied - User is not an admin',
            data: null,
          };
        }

        const vehicles = await vehicleService.getAllVehicles();
        return {
          statusCode: 200,
          msg: 'Vehicles fetched successfully',
          data: vehicles,
        };
      } catch (error) {
        console.error('Error fetching vehicles:', error);
        return {
          statusCode: 500,
          msg: 'Failed to fetch vehicles',
          data: error,
        };
      }
    },

    async getVehicle(_: any, { id }: { id: string }) {
      try {
        const vehicle = await vehicleService.getVehicleById(id);
        if (!vehicle) {
          return {
            statusCode: 404,
            msg: 'Vehicle not found',
            data: null,
          };
        }
        return {
          statusCode: 200,
          msg: 'Vehicle fetched successfully',
          data: vehicle,
        };
      } catch (error) {
        console.error(`Error fetching vehicle with id ${id}:`, error);
        return {
          statusCode: 500,
          msg: 'Failed to fetch vehicle',
          data: error,
        };
      }
    },
  },

  Mutation: {
    async createVehicle(_: any, { input }: { input: Partial<IVehicle> }) {
      try {
        const vehicle = await vehicleService.createVehicle(input);
        return {
          statusCode: 201,
          msg: 'Vehicle created successfully',
          data: vehicle,
        };
      } catch (error) {
        console.error('Error creating vehicle:', error);
        return {
          statusCode: 500,
          msg: 'Failed to create vehicle',
          data: error,
        };
      }
    },

    async updateVehicle(
      _: any,
      { id, input }: { id: string; input: Partial<IVehicle> },
    ) {
      try {
        const vehicle = await vehicleService.getVehicleById(id);

        if (!vehicle) {
          return {
            statusCode: 404,
            msg: 'Vehicle not found',
            data: null,
          };
        }

        if (input.licenseNumber) {
          const driver = await driverService.getDriverByVehicleId(id);

          if (driver && driver.licenseNumber !== input.licenseNumber) {
            return {
              statusCode: 400,
              msg: 'License number mismatch between driver and vehicle',
              data: null,
            };
          }
        }

        const updatedVehicle = await vehicleService.updateVehicle(id, input);
        if (!updatedVehicle) {
          return {
            statusCode: 404,
            msg: 'Vehicle not found',
            data: null,
          };
        }
        return {
          statusCode: 200,
          msg: 'Vehicle updated successfully',
          data: updatedVehicle,
        };
      } catch (error) {
        console.error(`Error updating vehicle with id ${id}:`, error);
        return {
          statusCode: 500,
          msg: 'Failed to update vehicle',
          data: error,
        };
      }
    },

    async deleteVehicle(_: any, { id }: { id: string }) {
      try {
        const success = await vehicleService.deleteVehicle(id);
        if (!success) {
          return {
            statusCode: 404,
            msg: 'Vehicle not found or already deleted',
            data: null,
          };
        }
        return {
          statusCode: 200,
          msg: 'Vehicle deleted successfully',
          data: { success },
        };
      } catch (error) {
        console.error(`Error deleting vehicle with id ${id}:`, error);
        return {
          statusCode: 500,
          msg: 'Failed to delete vehicle',
          data: error,
        };
      }
    },
  },
};

export default vehicleResolver;
