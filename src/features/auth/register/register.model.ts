/* eslint-disable no-promise-executor-return */
import {
  attach,
  combine,
  createEffect,
  createEvent,
  createStore,
  restore,
  sample
} from "effector";
import { object, string } from "yup";
import type { SubmitParams, ErrorsInline } from "effector-react-form/scope";
import { createForm } from "effector-react-form/scope";
import { pending } from "patronum/pending";
import { reset } from "patronum/reset";
import { interval } from "patronum/interval";
import { debug } from "patronum/debug";
import { createValidator } from "@/shared/form";
import { ObjectShape } from "yup/lib/object";

export type ValidationState = 'valid' | 'invalid';

type ObjectShapeValues = ObjectShape extends Record<string, infer V> ? V : never;

export type Shape<T extends Record<any, any>> = Record<keyof T, ObjectShapeValues>;
export type FormPhoneDto = {
  phoneNumber: string;
};

export type FormPhoneConfirmDto = {
  code: string;
};

export const isError = (err: unknown): err is Error => err instanceof Error;
export const isErrorsInline = (
  target: unknown
): target is Record<string, string | null | undefined> => !isError(target);

// Registration modes
export const modes = [
  {
    value: "individual",
    label: "Личный"
  },
  {
    value: "entity",
    label: "Предприниматель"
  }
] as const;

export type Mode = typeof modes[number]["value"];

// Confirmation modes
export const confirmationModes = [
  {
    value: "telegram",
    label: "Telegram",
    theme: "blue"
  },
  {
    value: "whatsapp",
    label: "WhatsApp",
    theme: "success"
  },
  {
    value: "sms",
    label: "СМС",
    theme: "primary"
  }
];

export type ConfirmationMode = typeof confirmationModes[number]["value"];

// Events
export const modeChanged = createEvent<Mode>();
// export const confirmationModeChanged = createEvent<ConfirmationMode>();
export const confirmationCodeSended = createEvent<any>();
export const editPhoneNumberClicked = createEvent<any>();
export const phoneNumberConfirmed = createEvent<any>();
export const registerFormSubmitted = createEvent();
export const formResetted = createEvent();
export const phoneNumberConfirmationCountdownStarted = createEvent();
export const phoneNumberConfirmationCountdownStopped = createEvent();
export const {
  tick: phoneNumberConfirmationTick,
  isRunning: $isPhoneNumberConfirmationCountdownRunning
} = interval({
  timeout: 1000,
  start: phoneNumberConfirmationCountdownStarted,
  stop: phoneNumberConfirmationCountdownStopped
});

// Default states
export const $isPhoneNumberEditable = createStore(true);
export const $isPhoneNumberConfirmed = createStore(false);
export const $isConfirmationCodeEnabled = createStore(false);
export const $confirmationCodeRequestCount = createStore(0);
export const $mode = restore(modeChanged, "individual");
// export const $confirmationMode = restore(confirmationModeChanged, 'telegram');
export const $phoneNumberConfirmationCountdown = createStore(30);

// State<->event relations
$isPhoneNumberEditable
  .on(confirmationCodeSended, () => false)
  .reset(editPhoneNumberClicked);
$isPhoneNumberConfirmed.on(phoneNumberConfirmed, () => true);
$isConfirmationCodeEnabled
  .on(confirmationCodeSended, () => true)
  .on(editPhoneNumberClicked, () => false);

$confirmationCodeRequestCount.on(confirmationCodeSended, (v) => v + 1);

$phoneNumberConfirmationCountdown
  .on(phoneNumberConfirmationTick, (number) => (number > 0 ? number - 1 : 0))
  .reset(phoneNumberConfirmationCountdownStopped);

debug(
  phoneNumberConfirmationCountdownStarted,
  phoneNumberConfirmationCountdownStopped,
  phoneNumberConfirmationTick,
  $isPhoneNumberConfirmationCountdownRunning,
  $phoneNumberConfirmationCountdown
);

// Temp utils
const sleep = () => new Promise((resolve) => setTimeout(resolve, 700));

// Wizzard steps as separate forms

// 1) Phone number form & validations effects
const createFormPhoneServerErrors = (values: FormPhoneDto) => {
  const errors: any = {};
  if (values.phoneNumber === "+7 (912) 345-67-89")
    errors.phoneNumber = "Номер уже зарегистрирован";
  return errors;
};

const checkPhoneNumberFx = createEffect<
  SubmitParams<FormPhoneDto>,
  void,
  Error | ErrorsInline
>({
  handler: async ({ values }) => {
    await sleep();
    // Demo to test request errors
    await fetch("https://jsonplaceholder.typicode.com/todos/1");

    // Demo to test response errors
    const serverSideError = createFormPhoneServerErrors(values);
    if (Object.keys(serverSideError).length > 0) {
      throw serverSideError;
    }
  }
});

export const formPhone = createForm({
  initialValues: {
    phoneNumber: "",
    // confirmationMode: "telegram"
  },
  onSubmit: checkPhoneNumberFx,
  validate: createValidator(
    object<Shape<FormPhoneDto>>({
      phoneNumber: string().phoneRu().required("Номер обязателен").nullable()
    })
  )
});

const sendConfirmationCodeFx = attach({
  source: formPhone.$values,
  async effect(source, params) {
    await sleep();
    console.log("sendConfirmationCodeFx", source, params);
  }
});

// Reset phoneNumber on edit action triggered
formPhone.$values.reset(editPhoneNumberClicked);

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
  target: formPhone.$outerErrorsInline
});

// Handle request errors
sample({
  clock: checkPhoneNumberFx.failData.filter({ fn: isError }),
  fn: () => ({
    phoneNumber: "Похоже что-то не так с интернетом"
  }),
  target: formPhone.$outerErrorsInline
});

// Handle success check
// TODO: Maybe backend can handle confirmation process in one request ?
sample({
  clock: checkPhoneNumberFx.doneData,
  target: sendConfirmationCodeFx
});

// On success confirmation
sample({
  clock: sendConfirmationCodeFx.doneData,
  target: confirmationCodeSended
});

// Start countdown for re-send confirmation
sample({
  clock: confirmationCodeSended,
  target: phoneNumberConfirmationCountdownStarted
});

// Loading status
export const $formPhonePending = pending({
  effects: [checkPhoneNumberFx, sendConfirmationCodeFx]
});

// 2) Phone confirmation form & validations effects
const createFormPhoneConfirmServerErrors = (values: FormPhoneConfirmDto) => {
  const errors: any = {};
  if (values.code !== "1111") errors.code = "Неверный код подтверждения";
  return errors;
};

const checkConfirmationCodeFx = createEffect<
  SubmitParams<FormPhoneConfirmDto>,
  void,
  unknown
>(async ({ values }) => {
  await sleep();
  // TODO: call Api there, handle error by contract
  const serverSideError = createFormPhoneConfirmServerErrors(values);
  if (Object.keys(serverSideError).length > 0) {
    throw serverSideError;
  }
});

export const formPhoneConfirm = createForm({
  initialValues: {
    code: ""
  },
  onSubmit: checkConfirmationCodeFx,
  validate: createValidator(
    object<Shape<FormPhoneConfirmDto>>({
      code: string().required("Код обязателен").nullable()
    })
  )
});

// stop confirmation code countdown on phone edit action triggered
formPhoneConfirm.$values.reset(editPhoneNumberClicked);
sample({
  clock: editPhoneNumberClicked,
  target: phoneNumberConfirmationCountdownStopped
});

// stop confirmation code countdown when time is up
sample({
  clock: $phoneNumberConfirmationCountdown,
  filter: (v) => v === 0,
  target: phoneNumberConfirmationCountdownStopped
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
  target: formPhoneConfirm.$outerErrorsInline
});

// Handle success check
sample({
  clock: checkConfirmationCodeFx.doneData,
  target: phoneNumberConfirmed
});

// Always stop countdown after confirm attempt
sample({
  clock: checkConfirmationCodeFx.finally,
  target: phoneNumberConfirmationCountdownStopped
});

// Loading status
export const $formPhoneConfirmPending = checkConfirmationCodeFx.pending;

// 3 - Prepare register values to finalize registration process
export const $registerValues = combine(
  {
    mode: $mode,
    phoneInfo: formPhone.$values
  },
  ({ mode, phoneInfo }) => ({
    mode,
    phoneNumber: phoneInfo.phoneNumber
  })
);

export const registerFx = attach({
  source: $registerValues,
  async effect(source, params) {
    await new Promise((res) => setTimeout(res, 3000));
    console.log("Form submitted", source, params);
  }
});

export const $registerPending = registerFx.pending;

// Complete registration on submit action triggered
sample({
  clock: registerFormSubmitted,
  target: registerFx
});

// Reset after successfull registration
sample({
  clock: registerFx.doneData,
  target: formResetted
});

// Reset all inner form's values and stores on reset triggered
reset({
  clock: formResetted,
  target: [
    formPhone.$values,
    formPhoneConfirm.$values,
    $isConfirmationCodeEnabled,
    $isPhoneNumberConfirmed,
    $isPhoneNumberEditable,
    $mode
  ]
});
