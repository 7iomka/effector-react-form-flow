import { $$register } from '@/features/auth/register';
import { createEvent, sample } from 'effector';
import type { StaticPageContext } from 'nextjs-effector';
// import { $$some } from '@/entities/some';

export const enter = createEvent<StaticPageContext>();

// sample({
//   clock: enter,
//   fn: () => {},
//   target: [$$register.allResetted], 
// });

// $$register.allResetted.watch((v) => console.log('allresetted v1'));
