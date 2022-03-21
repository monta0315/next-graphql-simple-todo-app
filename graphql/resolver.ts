import { Context } from "./context";
export const resolvers = {
  Query: {
    tasks: (_parent: any, _args: any, ctx: Context) => {
      return ctx.prisma.task.findMany();
    },
  },
};
