/* eslint-disable @typescript-eslint/no-shadow */
import clsx from 'clsx';
import { Anchor, Button, Loader, Radio, TextInput } from '@mantine/core';
import { useForm } from '@/shared/lib/effector-react-form';
import { createView } from '@/shared/lib/view';
import { Field, Form } from '@/shared/form';

import { $dateStore, FormPhoneConfirmDto, FormPhoneDto } from '../../register.model';
import {
  $confirmationModeInfo,
  $confirmationModes,
  phoneNumberConfirmationCountdownStarted,
  $phoneNumberConfirmationCountdownString,
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
import { useEffect } from 'react';

interface RegisterFormProps {
  className?: string;
}
const FormPhone = createView()
  .units({
    isLoading: $formPhonePending,
    isPhoneNumberEditable: $isPhoneNumberEditable,
    handleEditPhoneNumber: editPhoneNumberClicked,
    confirmationModes: $confirmationModes,
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
      confirmationModes,
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
            <Field.RadioGroup
              className="mt-15"
              spacing={0}
              offset={0}
              use={controller({
                name: form.getName('confirmationMode'),
              })}
            >
              {confirmationModes.map((mode, idx, arr) => (
                <Radio
                  value={mode.value}
                  label={mode.label}
                  key={mode.value}
                  mr={arr.length - 1 > idx ? 8 : 0}
                  sx={{
                    flexGrow: 1,
                  }}
                />
              ))}
            </Field.RadioGroup>
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
    countdown: $phoneNumberConfirmationCountdownString,
    startCountdown: phoneNumberConfirmationCountdownStarted,
    confirmationModeInfo: $confirmationModeInfo,
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
      confirmationModeInfo,
    }) => (
      <div className={className}>
        {isPhoneNumberConfirmed ? (
          <TextInput value={phoneNumber} disabled label="Подтверждённый номер телефона" />
        ) : (
          <Form className={className} onSubmit={handleSubmit}>
            <div className="text-sm text-center font-bold">
              Минутку, код подтверждения отправлен на указанный номер через{' '}
              {confirmationModeInfo.label}.
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
                <div className="text-sm text-center font-bold mt-10">
                  Получить код повторно через {countdown}
                </div>
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
    dateStore: $dateStore,
  })
  .effect(({ isConfirmationCodeEnabled}) => {
    useEffect(() => {
      console.log('mounted'); 
      return () => {
        console.log('unmounted');
      }
    }, [])
    console.log('isConfirmationCodeEnabled in component', isConfirmationCodeEnabled);
    // reset all
    // useEffect(
    //   () => () => {
    //     allResetted();
    //   },
    //   [allResetted],
    // );
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
      </section>
    ),
  ).Memo;

export type { RegisterFormProps };
export { RegisterForm };
