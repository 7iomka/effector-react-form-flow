import { RegisterForm, RegisterModeSwitcher } from '@/features/auth/register';
import { createView } from '@/shared/lib/view';
import { InfoCard } from '@/shared/ui';

const Register = createView().view(() => (
  <section>
    <div className="container">
      <div className="max-w-[380px] mx-auto">
        <InfoCard title="Регистрация" headerContent={<RegisterModeSwitcher />}>
          <RegisterForm />
        </InfoCard>
      </div>
    </div>
  </section>
));

export { Register };
