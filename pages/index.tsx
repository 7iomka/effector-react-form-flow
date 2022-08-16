import { baseLayout } from "@/app/page-factories";
import { $$registerPage, Register } from "@/pages/public/auth/register";

const { Page, getStaticProps } = baseLayout.createNextPage(Register, {
  gspPageEvent: $$registerPage.enter
});

export { getStaticProps };
export default Page;
