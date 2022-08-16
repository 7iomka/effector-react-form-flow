import { $$boot } from '@/processes/boot';
import { $$baseLayout, BaseLayout } from '@/widgets/layouts/base-layout';
import { createLayout } from '@/shared/lib/factory';

const baseLayout = createLayout({
  getLayout: (page) => <BaseLayout>{page}</BaseLayout>,
  // gssp: {
  //   sharedEvents: [$$boot.started, $$baseLayout.enter],
  // },
  // gip: {
  //   sharedEvents: [$$boot.started, $$baseLayout.enter],
  // },
  gsp: {
    sharedEvents: [$$boot.started, $$baseLayout.enter],
  },
});

export { baseLayout };
