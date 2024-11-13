import { ObjectId } from 'mongoose';
import { Vehicle, IVehicle } from '../models/vehical.model';
import { Driver, IDriver } from '../models/driver.model';

export class VehicleService {
  async getAllVehicles(): Promise<IVehicle[]> {
    try {
      return await Vehicle.find();
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      throw new Error('Failed to fetch vehicles');
    }
  }

  async getVehicleById(id: string): Promise<IVehicle | null> {
    try {
      return await Vehicle.findById(id);
    } catch (error) {
      console.error(`Error fetching vehicle with id ${id}:`, error);
      throw new Error('Failed to fetch vehicle');
    }
  }

  async createVehicle(input: Partial<IVehicle>): Promise<IVehicle> {
    try {
      const newVehicle = new Vehicle(input);
      return await newVehicle.save();
    } catch (error) {
      console.error('Error creating vehicle:', error);
      throw new Error('Failed to create vehicle');
    }
  }

  async updateVehicle(
    id: string,
    input: Partial<IVehicle>,
  ): Promise<IVehicle | null> {
    try {
      const vehicle = await this.getVehicleById(id);
      if (!vehicle) {
        return null;
      }

      return await Vehicle.findByIdAndUpdate(id, input, { new: true });
    } catch (error) {
      console.error(`Error updating vehicle with id ${id}:`, error);
      throw new Error('Failed to update vehicle');
    }
  }

  async deleteVehicle(id: string): Promise<boolean> {
    try {
      const result = await Vehicle.findByIdAndDelete(id);
      return result !== null;
    } catch (error) {
      console.error(`Error deleting vehicle with id ${id}:`, error);
      throw new Error('Failed to delete vehicle');
    }
  }

  async deleteVehicleByUserId(id: string): Promise<boolean> {
    try {
      const driver = await Driver.findOne({ user: id });
      if (!driver) {
        return false;
      }

      const licenseNumber = driver.licenseNumber;

      const vehicleResult = await Vehicle.deleteOne({ licenseNumber });

      if (vehicleResult.deletedCount === 0) {
        return false;
      }

      const driverResult = await Driver.deleteOne({ user: id });

      if (driverResult.deletedCount === 0) {
        return false;
      }

      return true;
    } catch (error) {
      console.error(`Error deleting vehicle and driver :`, error);
      throw new Error('Failed to delete vehicle and driver records');
    }
  }
}
