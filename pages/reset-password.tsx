import { baseLayout } from '@/app/page-factories';
import { $$resetPasswordPage, ResetPassword } from '@/pages/public/auth/reset-password';

const { Page, getStaticProps } = baseLayout.createNextPage(ResetPassword, {
  gspPageEvent: $$resetPasswordPage.enter,
});

export { getStaticProps };
export default Page;
