import { createEvent } from "effector";
import type { StaticPageContext } from "nextjs-effector";
// import { $$some } from '@/entities/some';

export const enter = createEvent<StaticPageContext>();

// sample({
//   clock: enter,
//   target: $$some.getSomeFx,
// });

// const registerFx = createEffect<{ email: string; password: string }, void, string>(async () => {
//   await new Promise((res) => setTimeout(res, 3000));

//   throw 'Oooopsie';
// });

// const checkPhoneNumberFx = createEffect(async () => {
//   await new Promise((res) => setTimeout(res, 3000));
// });

// const $registerError = createStore<string>(null!)
//   .on(registerFx.failData, (_, message) => message)
//   .reset(registerFx.doneData);

// export const form = createForm<{
//   phoneNumber: string;
// }>({
//   $validating: checkPhoneNumberFx.pending,

//   $disabled: registerFx.pending,

//   initialValues: {
//     phoneNumber: '',
//   },

//   schema: {
//     phoneNumber: string().phoneRu().required().nullable(),
//   },
// });

// rule({
//   error: $registerError,

//   on: form.fields.phoneNumber
// });

// sample({
//   clock: form.submitted,

//   fn: ({ phoneNumber }) => ({
//     phoneNumber
//   }),
//   target: registerFx
// });

// sample({
//   clock: form.fields.phoneNumber.changed,

//   target: checkPhoneNumberFx
// });
