import { $$register } from '@/features/auth/register';
import { createEvent, sample } from 'effector';
import type { StaticPageContext } from 'nextjs-effector';
import { PageContext } from 'nextjs-effector';
// import { $$some } from '@/entities/some';

export const enter = createEvent<PageContext>();

// sample({
//   clock: enter,
//   fn: () => {},
//   target: [$$register.allResetted], 
// });

enter.watch((v) => console.log('enter v1'));
// $$register.allResetted.watch((v) => console.log('allresetted v1'));
