// import { baseLayout } from '@/app/page-factories';
import { $$boot } from '@/processes/boot';
import { $$registerPage, Register } from '@/pages/public/auth/register';
import { Text } from '@mantine/core';
import Link from 'next/link';
import { createGSPFactory } from 'nextjs-effector';
import { allSettled } from 'effector';
import {$scopeName} from "@/features/auth/register";

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

const createGSP = createGSPFactory({
  sharedEvents: [],
});

export const getStaticProps = createGSP({
  pageEvent: $$registerPage.enter,
  customize: async ({scope, context}) => {
      await allSettled($scopeName,{scope,params: Math.random().toString()})
    return {
      props: {}
    }
  }
});

export default CustomWrapper;
