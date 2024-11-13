import { Driver, IDriver } from '../models/driver.model';

export class DriverService {
  async getAllDrivers(): Promise<IDriver[]> {
    try {
      return await Driver.find();
    } catch (error) {
      console.error('Error fetching drivers:', error);
      throw new Error('Failed to fetch drivers');
    }
  }

  async getDriverById(id: string): Promise<IDriver | null> {
    try {
      return await Driver.findById(id);
    } catch (error) {
      console.error(`Error fetching driver with id ${id}:`, error);
      throw new Error('Failed to fetch driver');
    }
  }

  async createDriver(input: Partial<IDriver>): Promise<IDriver> {
    try {
      const newDriver = new Driver(input);
      return await newDriver.save();
    } catch (error) {
      console.error('Error creating driver:', error);
      throw new Error('Failed to create driver');
    }
  }

  async updateDriver(
    id: string,
    input: Partial<IDriver>,
  ): Promise<IDriver | null> {
    try {
      const driver = await this.getDriverById(id);
      if (!driver) {
        return null;
      }

      return await Driver.findByIdAndUpdate(id, input, { new: true });
    } catch (error) {
      console.error(`Error updating driver with id ${id}:`, error);
      throw new Error('Failed to update driver');
    }
  }

  async deleteDriver(id: string): Promise<boolean> {
    try {
      const result = await Driver.findByIdAndDelete(id);
      return result !== null;
    } catch (error) {
      console.error(`Error deleting driver with id ${id}:`, error);
      throw new Error('Failed to delete driver');
    }
  }

  async getDriverByVehicleId(vehicleId: string): Promise<IDriver | null> {
    try {
      return await Driver.findOne({ vehicle: vehicleId }).exec();
    } catch (error) {
      console.error(
        `Error fetching driver for vehicle with id ${vehicleId}:`,
        error,
      );
      throw new Error('Failed to fetch driver by vehicle');
    }
  }

  async deleteDriverByUserId(id: string): Promise<boolean> {
    try {
      const result = await Driver.deleteMany({ user: id });
      return result.deletedCount > 0;
    } catch (error) {
      console.error(`Error deleting driver:`, error);
      throw new Error('Failed to delete driver records');
    }
  }
}
