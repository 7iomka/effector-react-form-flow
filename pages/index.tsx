// import { baseLayout } from '@/app/page-factories';
import { $$boot } from '@/processes/boot';
import { $$registerPage, Register } from '@/pages/public/auth/register';
import { Text } from '@mantine/core';
import Link from 'next/link';
import { createGSPFactory, createGSSPFactory } from 'nextjs-effector';
import { useEffect } from 'react';
import { allSettled } from 'effector';
import { $dateStore } from '@/features/auth/register/register.model';

const CustomWrapper = () => {
  
  return (
    <Text mb={15} className="text-center">
      <Link href="/index2">
        <a style={{ textDecoration: 'underline' }}>Form 2</a>
      </Link>
      <Register />
    </Text>
  )
};

const createGSSP = createGSSPFactory({
  sharedEvents: [$$boot.started],
});

export const getServerSideProps = createGSSP({
  pageEvent: $$registerPage.enter,
  customize: async ({scope, context}) => { 
    await allSettled($dateStore, {scope, params: Date.now()})
    return {
      props: {}
    }
  }
});

export default CustomWrapper;
