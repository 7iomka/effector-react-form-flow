/* eslint-disable @typescript-eslint/no-shadow */
import clsx from 'clsx';
import { Anchor, Button, Loader } from '@mantine/core';
import { useForm } from 'effector-react-form';
import { createView } from '@/shared/lib/view';
import { Field, Form } from '@/shared/form';
import type { FormPhoneConfirmDto, FormPhoneDto } from '../../register.model';
import {
  confirmationModes,
  phoneNumberConfirmationCountdownStarted,
  $phoneNumberConfirmationCountdown,
  $isPhoneNumberConfirmationCountdownRunning,
  $confirmationCodeRequestCount,
  $registerPending,
  $formPhoneConfirmPending,
  editPhoneNumberClicked,
  $isPhoneNumberEditable,
  $isPhoneNumberConfirmed,
  $registerValues,
  $isConfirmationCodeEnabled,
  $formPhonePending,
  registerFormSubmitted,
  formPhone,
  formPhoneConfirm,
} from '../../register.model';
import styles from './register-form.module.scss';

interface RegisterFormProps {
  className?: string;
}
const FormPhone = createView()
  .static({ confirmationModes })
  .units({
    isLoading: $formPhonePending,
    isPhoneNumberEditable: $isPhoneNumberEditable,
    handleEditPhoneNumber: editPhoneNumberClicked,
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
      isLoading,
      isPhoneNumberEditable,
      handleEditPhoneNumber,
    }) => (
      <Form onSubmit={handleSubmit}>
        <Field.TextInput
          use={controller({
            name: form.getName('phoneNumber'),
          })}
          label="Номер телефона"
          disabled={!isPhoneNumberEditable}
        />
        {!isPhoneNumberEditable && (
          <Anchor
            component="button"
            type="button"
            color="dark"
            size="sm"
            underline
            className="opacity-70 hover:opacity-100 mt-5"
            onClick={handleEditPhoneNumber}
          >
            Изменить номер телефона
          </Anchor>
        )}

        {isPhoneNumberEditable && (
          <>
            <Button
              color="gray.4"
              radius="md"
              fullWidth
              className="mt-15"
              disabled={isLoading}
              type="submit"
            >
              {isLoading ? <Loader variant="dots" color="dark" /> : 'Получить код'}
            </Button>
          </>
        )}
      </Form>
    ),
  );

const FormPhoneConfirm = createView<{ className?: string }>()
  .units({
    isLoading: $formPhoneConfirmPending,
    isPhoneNumberConfirmed: $isPhoneNumberConfirmed,
    phoneNumber: $registerValues.map((v) => v.phoneNumber),
    isCountdownRunning: $isPhoneNumberConfirmationCountdownRunning,
    confirmationCodeRequestCount: $confirmationCodeRequestCount,
    countdown: $phoneNumberConfirmationCountdown,
    startCountdown: phoneNumberConfirmationCountdownStarted,
  })
  .map(() => {
    const { controller, handleSubmit } = useForm<FormPhoneConfirmDto>({
      form: formPhoneConfirm,
      resetUnmount: false,
    });

    return {
      form: formPhoneConfirm,
      controller,
      handleSubmit,
    };
  })
  .view(
    ({
      controller,
      handleSubmit,
      form,
      isLoading,
      phoneNumber,
      className,
      isPhoneNumberConfirmed,
      isCountdownRunning,
      countdown,
      confirmationCodeRequestCount,
      startCountdown,
    }) => (
      <div className={className}>
        {isPhoneNumberConfirmed ? (
          <div>Подтверждённый номер телефона: {phoneNumber}</div>
        ) : (
          <Form className={className} onSubmit={handleSubmit}>
            <div className="text-sm">
              Минутку, код подтверждения отправлен смс-сообщением на указанный номер и на telegram.
            </div>
            <Field.TextInput
              className="mt-20"
              use={controller({
                name: form.getName('code'),
              })}
              label="Код из сообщения"
              autoComplete="off"
            />
            <Button className="mt-15" color="gray.4" radius="md" fullWidth type="submit">
              {isLoading ? <Loader variant="dots" color="dark" /> : 'Подтвердить'}
            </Button>

            {confirmationCodeRequestCount > 0 &&
              (isCountdownRunning ? (
                `Получить новый код через ${countdown} сек.`
              ) : (
                <Button
                  className="mt-15"
                  color="gray.4"
                  radius="md"
                  fullWidth
                  onClick={() => startCountdown()}
                >
                  Получить новый код
                </Button>
              ))}
          </Form>
        )}
      </div>
    ),
  );

const RegisterForm = createView<RegisterFormProps>()
  .displayName('RegisterForm')
  .units({
    isLoading: $registerPending,
    handleSubmit: registerFormSubmitted,
    isConfirmationCodeEnabled: $isConfirmationCodeEnabled,
    isPhoneNumberConfirmed: $isPhoneNumberConfirmed,
  })

  .memo()
  .view(
    ({ className, isLoading, handleSubmit, isConfirmationCodeEnabled, isPhoneNumberConfirmed }) => (
      <section className={clsx(styles.RegisterForm, className)}>
        {!isPhoneNumberConfirmed && <FormPhone />}
        {isConfirmationCodeEnabled && <FormPhoneConfirm className="mt-15" />}
        <Button
          className="mt-30"
          fullWidth
          onClick={() => handleSubmit()}
          disabled={!isPhoneNumberConfirmed}
        >
          {isLoading ? <Loader variant="dots" color="dark" /> : 'Зарегистрироваться'}
        </Button>
        <p className="mt-25 opacity-50 text-xs text-center">
          <span>{`Регистрируясь, я соглашаюсь с `}</span>
          <a href="#!" className="inline text-xs">
            политикой обработки персональных данных
          </a>
        </p>
      </section>
    ),
  ).Memo;

export type { RegisterFormProps };
export { RegisterForm };
