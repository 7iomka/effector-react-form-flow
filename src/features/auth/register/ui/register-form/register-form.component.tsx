/* eslint-disable @typescript-eslint/no-shadow */
import clsx from 'clsx';
import {Button, Loader} from '@mantine/core';
import { useForm } from '@/shared/lib/effector-react-form';
import { createView } from '@/shared/lib/view';
import { Field, Form } from '@/shared/form'; 

import { FormPhoneDto } from '../../register.model';
import {
  $registerPending,
  registerFormSubmitted,
  formPhone,
} from '../../register.model';
import styles from './register-form.module.scss';
import {debug} from "patronum";
import {combine, createStore} from "effector";

interface RegisterFormProps {
  className?: string;
}

const $scopeName = createStore('unknown')

debug($scopeName)
debug(combine({phoneNumber:formPhone.$values.map(({phoneNumber}) =>phoneNumber ),scopeName: $scopeName}))

const FormPhone = createView()
  .units({
      $scopeName,
      phoneNumber:formPhone.$values.map((values) => values.phoneNumber),
 
  })
  .map(() => {
    const { controller, handleSubmit } = useForm<FormPhoneDto>({
      form: formPhone,
      resetUnmount: false,
    });
      return {
      form: formPhone,
      controller,
      handleSubmit,
    };
  })
  .view(
    ({
      controller,
      form,
      handleSubmit,
    }) => {
        return (
            <Form onSubmit={handleSubmit}>
                <Field.TextInput
                    use={controller({
                                name: form.getName('phoneNumber'),
                            })}
                    label="Номер телефона"
                />
              
            </Form>
        )
    },
  );



const RegisterForm = createView<RegisterFormProps>()
  .displayName('RegisterForm')
  .units({
    isLoading: $registerPending,
    handleSubmit: registerFormSubmitted,
  })
  .memo()
  .view(
    ({ className, isLoading, handleSubmit, }) => {
        return (
            <section className={clsx(styles.RegisterForm, className)}>
                <FormPhone />
                <Button
                    className="mt-30"
                    fullWidth
                    onClick={() => handleSubmit()}
                >
                    {isLoading ? <Loader variant="dots" color="dark" /> : 'Зарегистрироваться'}
                </Button>
            </section>
        )
    },
  ).Memo;

export type { RegisterFormProps };
export { RegisterForm,$scopeName };
