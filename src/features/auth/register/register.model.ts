/* eslint-disable no-promise-executor-return */
import { attach, combine, createEffect, createEvent, createStore, restore, sample } from 'effector';
import { object, string } from 'yup';
import { pending } from 'patronum/pending';
import { reset } from 'patronum/reset';
import { interval } from 'patronum/interval';
import { createForm } from '@/shared/lib/effector-react-form';
import type { SubmitParams, ErrorsInline } from '@/shared/lib/effector-react-form';
import { createValidator } from '@/shared/form';
import { ObjectShape } from 'yup/lib/object';
import { debug } from 'patronum';

export const sleep = (ms: number = 700) => new Promise((resolve) => setTimeout(resolve, ms));

export const leftPad = (source: string, targetLength: number, padChar: string = ' '): string => {
  if (source.length < targetLength) {
    var padding: string = '';
    while (padding.length + source.length < targetLength) padding += padChar;
    return padding + source;
  }
  return source;
};

export const padNumber = (num: number, length: number = 2): string => {
  return leftPad(String(num), length, '0');
};

/**
 * format time dd 00:00:00
 * @param seconds seconds
 * @param len length 4:day:hour:minute:second, 3:hour:minute:second,2:minute:second,1:second
 */
export const formatTimeHMS = (seconds: number, len: number = 3): string => {
  var result: string = '';
  var hour: number = 0;
  hour = Math.floor(seconds / 3600);
  var hourTotal: number = hour;
  var day: number = 0;
  if (hour >= 24) {
    day = Math.floor(Math.floor(hour / 24));
    hour -= day * 24;
  }
  var minute: number = 0;
  minute = Math.floor((seconds - hourTotal * 3600) / 60);
  var second: any = Number(seconds - hourTotal * 3600 - minute * 60);
  if (day > 0) result += day + 'd ';
  else if (len > 3) result += '0d:';
  if (hour > 0) result += padNumber(hour) + ':';
  else if (len > 2) result += '00:';
  if (minute > 0) result += padNumber(minute) + ':';
  else if (len > 1) result += '00:';
  result += padNumber(second);
  return result;
};

export type ValidationState = 'valid' | 'invalid';

type ObjectShapeValues = ObjectShape extends Record<string, infer V> ? V : never;

export type Shape<T extends Record<any, any>> = Record<keyof T, ObjectShapeValues>;

export const isError = (err: unknown): err is Error => err instanceof Error;
export const isErrorsInline = (
  target: unknown
): target is Record<string, string | null | undefined> => !isError(target);


// Registration modes
export type Mode = 'individual' | 'entity';
export type Modes = { value: Mode; label: string }[];

export const modes = [
  {
    value: 'individual',
    label: 'Личный',
  },
  {
    value: 'entity',
    label: 'Предприниматель',
  },
];

// Confirmation modes
type ConfirmationMode = 'telegram' | 'whatsapp' | 'sms';
type ConfirmationModes = { value: ConfirmationMode; label: string; theme: string }[];

const confirmationModes: ConfirmationModes = [
  {
    value: 'telegram',
    label: 'Telegram',
    theme: 'blue',
  },
  {
    value: 'whatsapp',
    label: 'WhatsApp',
    theme: 'success',
  },
  {
    value: 'sms',
    label: 'СМС',
    theme: 'primary',
  },
];

export type FormPhoneDto = {
  phoneNumber: string;
  confirmationMode: ConfirmationMode;
};

export type FormPhoneConfirmDto = {
  code: string;
};

// Events
export const modeChanged = createEvent<Mode>();
export const confirmationCodeSended = createEvent<any>();
export const editPhoneNumberClicked = createEvent<any>();
export const phoneNumberConfirmed = createEvent<any>();
export const registerFormSubmitted = createEvent();
export const allResetted = createEvent();
export const phoneNumberConfirmationCountdownStarted = createEvent();
export const phoneNumberConfirmationCountdownStopped = createEvent();
export const {
  tick: phoneNumberConfirmationTick,
  isRunning: $isPhoneNumberConfirmationCountdownRunning,
} = interval({
  timeout: 1000,
  start: phoneNumberConfirmationCountdownStarted,
  stop: phoneNumberConfirmationCountdownStopped,
});

// Default states
export const $modes = createStore(modes);
export const $mode = restore(modeChanged, 'individual');
export const $confirmationModes = createStore(confirmationModes);
export const $isPhoneNumberEditable = createStore(true);
export const $isPhoneNumberConfirmed = createStore(false);
export const $isConfirmationCodeEnabled = createStore(false);
export const $confirmationCodeRequestCount = createStore(0);
export const $phoneNumberConfirmationCountdown = createStore(30);
export const $phoneNumberConfirmationCountdownString = $phoneNumberConfirmationCountdown.map((v) =>
  formatTimeHMS(v, 2),
);

// State<->event relations
$isPhoneNumberEditable.on(confirmationCodeSended, () => false).reset(editPhoneNumberClicked);
$isPhoneNumberConfirmed.on(phoneNumberConfirmed, () => true);
$isConfirmationCodeEnabled
  .on(confirmationCodeSended, () => true)
  .on(editPhoneNumberClicked, () => false);

$confirmationCodeRequestCount.on(confirmationCodeSended, (v) => v + 1);

$phoneNumberConfirmationCountdown
  .on(phoneNumberConfirmationTick, (number) => (number > 0 ? number - 1 : 0))
  .reset(phoneNumberConfirmationCountdownStopped);

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
    // Demo to test request errors
    await fetch('https://jsonplaceholder.typicode.com/todos/1');

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
    confirmationMode: 'telegram',
  },
  onSubmit: checkPhoneNumberFx,
  validate: createValidator(
    object<Shape<FormPhoneDto>>({
      phoneNumber: string().required('Номер обязателен').nullable(),
      confirmationMode: string().required().nullable(),
    }),
  ),
});

export const $confirmationModeInfo = sample({
  source: {
    activeConfirmationMode: formPhone.$values.map((v) => v.confirmationMode),
    confirmationModeList: $confirmationModes,
  },
  fn({ activeConfirmationMode, confirmationModeList }) {
    return confirmationModeList.find((item) => item.value === activeConfirmationMode)!;
  },
});

const sendConfirmationCodeFx = attach({
  source: formPhone.$values,
  async effect(source, params) {
    await sleep();
  },
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

// Handle request errors
sample({
  clock: checkPhoneNumberFx.failData.filter({ fn: isError }),
  fn: () => ({
    phoneNumber: 'Похоже что-то не так с интернетом',
  }),
  target: formPhone.$outerErrorsInline,
});

// Handle success check
// TODO: Maybe backend can handle confirmation process in one request ?
sample({
  clock: checkPhoneNumberFx.doneData,
  target: sendConfirmationCodeFx,
});

// On success confirmation
sample({
  clock: sendConfirmationCodeFx.doneData,
  target: confirmationCodeSended,
});

// Start countdown for re-send confirmation
sample({
  clock: confirmationCodeSended,
  target: phoneNumberConfirmationCountdownStarted,
});

// Loading status
export const $formPhonePending = pending({ effects: [checkPhoneNumberFx, sendConfirmationCodeFx] });

// 2) Phone confirmation form & validations effects
const createFormPhoneConfirmServerErrors = (values: FormPhoneConfirmDto) => {
  const errors: any = {};
  if (values.code !== '1111') errors.code = 'Неверный код подтверждения';
  return errors;
};

const checkConfirmationCodeFx = createEffect<SubmitParams<FormPhoneConfirmDto>, void, unknown>(
  async ({ values }) => {
    await sleep();
    // TODO: call Api there, handle error by contract
    const serverSideError = createFormPhoneConfirmServerErrors(values);
    if (Object.keys(serverSideError).length > 0) {
      throw serverSideError;
    }
  },
);

export const formPhoneConfirm = createForm({
  initialValues: {
    code: '',
  },
  onSubmit: checkConfirmationCodeFx,
  validate: createValidator(
    object<Shape<FormPhoneConfirmDto>>({
      code: string().required('Код обязателен').nullable(),
    }),
  ),
});

// stop confirmation code countdown on phone edit action triggered
formPhoneConfirm.$values.reset(editPhoneNumberClicked);
sample({
  clock: editPhoneNumberClicked,
  target: phoneNumberConfirmationCountdownStopped,
});

// stop confirmation code countdown when time is up
sample({
  clock: $phoneNumberConfirmationCountdown,
  filter: (v) => v === 0,
  target: phoneNumberConfirmationCountdownStopped,
});

// Handle response errors
sample({
  clock: checkConfirmationCodeFx.failData.filter({ fn: isErrorsInline }),
  source: formPhoneConfirm.$values,
  fn: (source, clock) => {
    const err: ErrorsInline = {};

    Object.keys(source).forEach((key) => {
      if (clock[key]) {
        err[key] = clock[key];
      }
    });

    return err;
  },
  target: formPhoneConfirm.$outerErrorsInline,
});

// Handle success check
sample({
  clock: checkConfirmationCodeFx.doneData,
  target: phoneNumberConfirmed,
});

// Always stop countdown after confirm attempt
sample({
  clock: checkConfirmationCodeFx.finally,
  target: phoneNumberConfirmationCountdownStopped,
});

// Loading status
export const $formPhoneConfirmPending = checkConfirmationCodeFx.pending;

// 3 - Prepare register values to finalize registration process
export const $registerValues = combine(
  {
    mode: $mode,
    phoneInfo: formPhone.$values,
  },
  ({ mode, phoneInfo }) => ({
    mode,
    phoneNumber: phoneInfo.phoneNumber,
  }),
);

export const registerFx = attach({
  source: $registerValues,
  async effect(source, params) {
    await new Promise((res) => setTimeout(res, 3000));
  },
});

export const $registerPending = registerFx.pending;

// Complete registration on submit action triggered
sample({
  clock: registerFormSubmitted,
  target: registerFx,
});

// Reset after successfull registration
sample({
  clock: registerFx.doneData,
  target: allResetted,
});

// Reset all inner form's values and stores on reset triggered
reset({
  clock: allResetted,
  target: [
    formPhone.$values,
    formPhoneConfirm.$values,
    $isConfirmationCodeEnabled,
    $isPhoneNumberConfirmed,
    $isPhoneNumberEditable,
    $mode,
  ],
});


export const $dateStore = createStore('');

// sample({
//   clock: formPhone.$values,
//   fn: () => String(Date.now()),
//   target: $dateStore
// })

// debug($dateStore)