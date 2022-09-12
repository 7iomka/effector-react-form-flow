import { createEvent } from 'effector';
import type { StaticPageContext } from 'nextjs-effector';

const enter = createEvent<StaticPageContext>();

export { enter };
