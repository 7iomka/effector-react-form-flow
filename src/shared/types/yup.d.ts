import * as yup from "yup";
import type { AnyObject } from "yup";

declare module "yup" {
  interface StringSchema<
    TType = string,
    TContext extends AnyObject = AnyObject,
    TOut extends TType = TType
  > extends yup.BaseSchema<TType, TContext, TOut> {
    phoneRu(): StringSchema<TType, TContext>;
  }
}

export default yup;
