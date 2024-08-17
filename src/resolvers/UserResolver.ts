import { User } from "../entities/User";
import { AppDataSource } from "../data-source";
import { log } from "console";
import { generateToken } from "../utils/auth";

export const resolvers = {
  Query: {
    users: async () => {
      const userRepository = AppDataSource.getRepository(User);
      return await userRepository.find();
    },
    me: async (_: any, __: any, context: any) => {
      const userId: number = context.userId;
      if (!userId) throw new Error("Not authenticated");

      const userRepository = AppDataSource.getRepository(User);
      return await userRepository.findOne({ where: { id: userId } });
    },
  },
  Mutation: {
    createUser: async (
      _: any,
      args: { username: string; email: string; password: string }
    ) => {
      const userRepository = AppDataSource.getRepository(User);
      const user = userRepository.create(args);
      await userRepository.save(user);
      return user;
    },
    login: async (_: any, args: { email: string; password: string }) => {
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({
        where: { email: args.email },
      });
      if (!user) {
        throw new Error("No user with that email");
      }
      if (!(await user.validatePassword(args.password))) {
        throw new Error("Incorrect password");
      }

      const token = generateToken(user);

      return {
        token,
        user,
      };
    },
  },
};
