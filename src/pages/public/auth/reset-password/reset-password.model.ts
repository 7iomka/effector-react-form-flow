import { createEvent } from 'effector';
import type { StaticPageContext } from 'nextjs-effector';
import { PageContext } from 'nextjs-effector';

const enter = createEvent<PageContext>();

export { enter };
