import { baseLayout } from "@/app/page-factories";
import { $$registerPage, Register } from "@/pages/public/auth/register";
import { Text } from "@mantine/core";
import Link from "next/link";

const CustomWrapper = () => (
  <Text mb={15} className="text-center"><Link href="/index2" ><a style={{ textDecoration: 'underline' }}>Form 2</a></Link><Register /></Text>
)

const { Page, getStaticProps } = baseLayout.createNextPage(CustomWrapper, {
  gspPageEvent: $$registerPage.enter
});

export { getStaticProps };
export default Page;
