import { User, IUser } from '../models/user.model';

export class UserService {
  async getAllUsers(): Promise<IUser[]> {
    try {
      return await User.find();
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new Error('Failed to fetch users');
    }
  }

  async getUserById(id: string): Promise<IUser | null> {
    try {
      return await User.findById(id);
    } catch (error) {
      console.error(`Error fetching user with id ${id}:`, error);
      throw new Error('Failed to fetch user');
    }
  }

  async createUser(input: Partial<IUser>): Promise<IUser> {
    try {
      const newUser = new User(input);
      return await newUser.save();
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Failed to create user');
    }
  }

  async updateUser(id: string, input: Partial<IUser>): Promise<IUser | null> {
    try {
      const user = await this.getUserById(id);
      if (!user) {
        return null;
      }

      return await User.findByIdAndUpdate(id, input, { new: true });
    } catch (error) {
      console.error(`Error updating user with id ${id}:`, error);
      throw new Error('Failed to update user');
    }
  }

  async deleteUser(id: string): Promise<boolean> {
    try {
      const result = await User.findByIdAndDelete(id);
      return result !== null;
    } catch (error) {
      console.error(`Error deleting user with id ${id}:`, error);
      throw new Error('Failed to delete user');
    }
  }
}
