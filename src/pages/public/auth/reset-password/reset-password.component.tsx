import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { ResetPasswordForm, $$resetPassword } from '@/features/auth/reset-password';
// import { createView} from '@/shared/lib/view';
import { CustomLink, InfoCard } from '@/shared/ui';
import type { Controller } from '@/shared/lib/effector-react-form';
import { createForm, useForm } from '@/shared/lib/effector-react-form';
import { createField, Field, Form } from '@/shared/form';

type Values = {
  username: string;
  profile: {
    firstName: string;
    lastName: string;
  };
};

const form = createForm<Values>({
  name: 'xxx',
  initialValues: {
    username: '',
    profile: {
      firstName: '',
      lastName: 'str',
    },
  },
  onSubmit: ({ values }) => alert(JSON.stringify(values, null, '  ')),
});

type InputProps = {
  controller: Controller;
  label: ReactNode;
};

const Input: React.FC<InputProps> = ({ controller, label }) => {
  const { input } = controller();

  return (
    <div className="input-wrap">
      <label>{label}</label>
      <input {...input} value={input.value || ''} className="input" />
    </div>
  );
};

const ResetPassword = () => {
  const { controller, handleSubmit } = useForm({ form });

  return (
    <form onSubmit={handleSubmit}>
      <Input label="Username" controller={controller({ name: form.getName('username') })} />
      <Input
        label="First name"
        controller={controller({ name: form.getName('profile', 'firstName') })}
      />
      <Input
        label="Last name"
        controller={controller({ name: form.getName('profile', 'lastName') })}
      />
      <button type="submit">submit</button>
    </form>
  );
};

// const ResetPassword = createView()
//   .units({
//     resetAll: $$resetPassword.allResetted,
//   })
//   // .effect(({ resetAll }) => {
//   //   useEffect(() => {
//   //     resetAll();
//   //   }, [resetAll]);
//   // })
//   .view(() => (
//     <section>
//       <div className="container">
//         <div className="max-w-[380px] mx-auto">
//           <InfoCard title="Забыли пароль? Давайте поменяем его">
//             <ResetPasswordForm />
//             <p className="mt-25 text-sm text-center">
//               <span>{`Нет аккаунта? `}</span>
//               <CustomLink href="/register" className="inline text-sm" size="md">
//                 Зарегистрируйтесь
//               </CustomLink>
//             </p>
//           </InfoCard>
//         </div>
//       </div>
//     </section>
//   ));

export { ResetPassword };
