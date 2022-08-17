import { baseLayout } from "@/app/page-factories";
import { $$registerPage, Register } from "@/pages/public/auth/register";
import Link from "next/link";

const CustomWrapper = () => (
  <div><Link href="/">Form1</Link><Register /></div>
)

const { Page, getStaticProps } = baseLayout.createNextPage(CustomWrapper, {
  gspPageEvent: $$registerPage.enter
});

export { getStaticProps };
export default Page;