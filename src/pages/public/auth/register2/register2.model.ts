import { $$register2 } from "@/features/auth/register2";
import { createEvent, sample } from "effector";
import type { StaticPageContext } from "nextjs-effector";
import { PageContext } from "nextjs-effector";
// import { $$some } from '@/entities/some';

export const enter = createEvent<PageContext>();
// sample({
//   clock: enter,
//   fn: () => {},
//   target: [$$register2.allResetted],
// });