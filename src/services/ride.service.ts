import { Ride, IRide } from '../models/ride.model';

export class RideService {
  async getAllRides(): Promise<IRide[]> {
    try {
      return await Ride.find();
    } catch (error) {
      console.error('Error fetching rides:', error);
      throw new Error('Failed to fetch rides');
    }
  }

  async getRideById(id: string): Promise<IRide | null> {
    try {
      return await Ride.findById(id);
    } catch (error) {
      console.error(`Error fetching ride with id ${id}:`, error);
      throw new Error('Failed to fetch ride');
    }
  }

  async createRide(input: Partial<IRide>): Promise<IRide> {
    try {
      const newRide = new Ride(input);
      return await newRide.save();
    } catch (error) {
      console.error('Error creating ride:', error);
      throw new Error('Failed to create ride');
    }
  }

  async updateRide(id: string, input: Partial<IRide>): Promise<IRide | null> {
    try {
      const ride = await this.getRideById(id);
      if (!ride) {
        return null;
      }

      return await Ride.findByIdAndUpdate(id, input, { new: true });
    } catch (error) {
      console.error(`Error updating ride with id ${id}:`, error);
      throw new Error('Failed to update ride');
    }
  }

  async deleteRide(id: string): Promise<boolean> {
    try {
      const result = await Ride.findByIdAndDelete(id);
      return result !== null;
    } catch (error) {
      console.error(`Error deleting ride with id ${id}:`, error);
      throw new Error('Failed to delete ride');
    }
  }

  async updateRideStatus(
    id: string,
    status: IRide['status'],
  ): Promise<IRide | null> {
    try {
      const updatedRide = await Ride.findByIdAndUpdate(
        id,
        { status },
        { new: true },
      );

      console.log(`updated ${updatedRide}`);

      if (!updatedRide) {
        console.error(`Ride with ID ${id} not found.`);
        return null;
      }

      return updatedRide;
    } catch (error) {
      console.error(`Error updating status for ride with ID ${id}:`, error);
      throw new Error('Failed to update ride status');
    }
  }

  async deleteRidesByUserId(id: string): Promise<boolean> {
    try {
      const result = await Ride.deleteMany({
        user: id,
      });

      return result.deletedCount > 0;
    } catch (error) {
      console.error(`Error deleting rides :`, error);
      throw new Error('Failed to delete ride records');
    }
  }
}
