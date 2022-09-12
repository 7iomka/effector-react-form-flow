/* eslint-disable no-promise-executor-return */
import { createEffect, createEvent, createStore, sample } from 'effector';
import { object, string } from 'yup';
import { createForm } from '@/shared/lib/effector-react-form';
import type { SubmitParams, ErrorsInline } from '@/shared/lib/effector-react-form';
import { createValidator } from '@/shared/form';
import { ObjectShape } from 'yup/lib/object';

export const sleep = (ms: number = 700) => new Promise((resolve) => setTimeout(resolve, ms));


export type ValidationState = 'valid' | 'invalid';

type ObjectShapeValues = ObjectShape extends Record<string, infer V> ? V : never;

export type Shape<T extends Record<any, any>> = Record<keyof T, ObjectShapeValues>;

export const isError = (err: unknown): err is Error => err instanceof Error;
export const isErrorsInline = (
  target: unknown
): target is Record<string, string | null | undefined> => !isError(target);



export type FormPhoneDto = {
  phoneNumber: string;
};


// Events

export const phoneNumberConfirmed = createEvent<any>();
export const registerFormSubmitted = createEvent();
export const allResetted = createEvent();


// Default states

export const $isPhoneNumberConfirmed = createStore(false);
export const $isConfirmationCodeEnabled = createStore(false);


// State<->event relations

$isPhoneNumberConfirmed.on(phoneNumberConfirmed, () => true);


// Wizzard steps as separate forms

// 1) Phone number form & validations effects
const createFormPhoneServerErrors = (values: FormPhoneDto) => {
  const errors: any = {};
  if (values.phoneNumber === '+7 (912) 345-67-89') errors.phoneNumber = 'Номер уже зарегистрирован';
  return errors;
};

const checkPhoneNumberFx = createEffect<SubmitParams<FormPhoneDto>, void, Error | ErrorsInline>({
  handler: async ({ values }) => {
    await sleep();

    // Demo to test response errors
    const serverSideError = createFormPhoneServerErrors(values);
    if (Object.keys(serverSideError).length > 0) {
      throw serverSideError;
    }
  },
});

export const formPhone = createForm<FormPhoneDto>({
  name:'phoneForm',
  initialValues: {
    phoneNumber: '',
  },
  onSubmit: checkPhoneNumberFx,
  validate: createValidator(
    object<Shape<FormPhoneDto>>({
      phoneNumber: string().required('Номер обязателен').nullable(),
    }),
  ),
});



// Reset phoneNumber on edit action triggered
// formPhone.$values.reset(editPhoneNumberClicked);

// Handle response errors
sample({
  clock: checkPhoneNumberFx.failData.filter({ fn: isErrorsInline }),
  source: formPhone.$values,
  fn: (source, clock) => {
    const err: ErrorsInline = {};

    Object.keys(source).forEach((key) => {
      if (clock[key]) {
        err[key] = clock[key];
      }
    });

    return err;
  },
  target: formPhone.$outerErrorsInline,
});

// Handle success check
sample({
  clock: checkPhoneNumberFx.doneData,
  target: phoneNumberConfirmed,
});


export const $registerPending = checkPhoneNumberFx.pending;
