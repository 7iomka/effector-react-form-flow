// import { baseLayout } from '@/app/page-factories';
import { $$boot } from '@/processes/boot';
import { $$register2Page, Register2 } from '@/pages/public/auth/register2';
import { Text } from '@mantine/core';
import Link from 'next/link';
import { createGSPFactory } from 'nextjs-effector';
import { createGSSPFactory } from 'nextjs-effector';

const CustomWrapper = () => (
  <Text mb={15} className="text-center">
    <Link href="/">
      <a style={{ textDecoration: 'underline' }}>Form 1</a>
    </Link>
    <Register2 />
  </Text>
);

const createGSSP = createGSSPFactory({
  sharedEvents: [$$boot.started],
});

export const getSeverSideProps = createGSSP({
  pageEvent: $$register2Page.enter,
});

export default CustomWrapper;
