import { baseLayout } from "@/app/page-factories";
import { $$register2Page, Register2 } from "@/pages/public/auth/register2";
import { Text } from "@mantine/core";
import Link from "next/link";

const CustomWrapper = () => (
  <Text mb={15} className="text-center"><Link href="/" ><a style={{ textDecoration: 'underline' }}>Form </a></Link><Register2 /></Text>
)

const { Page, getStaticProps } = baseLayout.createNextPage(CustomWrapper, {
  gspPageEvent: $$register2Page.enter
});

export { getStaticProps };
export default Page;