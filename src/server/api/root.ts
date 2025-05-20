import { postRouter } from "~/server/api/routers/post";
import { mintAdminAndRewardRouter } from "~/server/api/routers/admin/mintAdminAndReward";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { setParametersRouter } from "./routers/admin/setParameters";
import { deployAsteriaValidatorsRouter } from "./routers/admin/deployValidatorsRouter";
import { pelletDeployRouter } from "./routers/admin/pelletDeploy";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  mintAdminAndReward: mintAdminAndRewardRouter,
  setParameters: setParametersRouter,
  deployAsteriaValidators: deployAsteriaValidatorsRouter,
  pelletDeploy: pelletDeployRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
