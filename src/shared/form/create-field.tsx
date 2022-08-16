import type { ComponentType } from 'react';
import type { Controller } from 'effector-react-form/scope';

export function createField<P, Keys extends string = ''>(Component: ComponentType<P>) {
  // eslint-disable-next-line func-names
  return function ({ use, ...props }: Omit<P, Keys> & { use: Controller }) {
    const {
      input,
      error,
      innerError,
      outerError,
      isShowError,
      isShowOuterError,
      isShowInnerError,
      form,
      meta,
      validate,
      setFieldState,
      setOrDeleteError,
      setOrDeleteOuterError,
      setOuterErrorsInlineState,
      fieldState,
    } = use();

    const fieldProps = {
      error: isShowError && error,
      ...input,
    };

    return <Component {...(props as any)} {...fieldProps} />;
  };
}
