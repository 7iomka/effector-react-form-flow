// import { baseLayout } from '@/app/page-factories';
import { $$boot } from '@/processes/boot';
import { $$registerPage, Register } from '@/pages/public/auth/register';
import { Text } from '@mantine/core';
import Link from 'next/link';
import { createGSPFactory } from 'nextjs-effector';
import { allSettled } from 'effector';
import {$scopeName} from "@/features/auth/register";
import { ProductCarousel } from '@/widgets/product/product-carousel';

const CustomWrapper = () => {

  return (
     <div className="container">
        <div className="row gy-12">
          <div className="col-12 md:col-6 xxl:col-5">
            <ProductCarousel items={[
                {
                src: '/static/images/content/products/1/1_1.jpg',
                },
                {
                src: '/static/images/content/products/1/1_2.jpg',
                },
                {
                src: '/static/images/content/products/1/1_3.jpg',
                },
                {
                src: '/static/images/content/products/1/1_4.jpg',
                },
                {
                src: '/static/images/content/products/1/1_5.jpg',
                },
                {
                src: '/static/images/content/products/1/1_6.jpg',
                },
            ]} className="mt-14 md:mt-0" /> 
          </div>
          <div className="col-12 md:col-6 xxl:col-7"> product details</div>
        </div>
    </div>
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
