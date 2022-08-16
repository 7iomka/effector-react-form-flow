import { Form, TextInput, PhoneInput, RadioGroup } from './adapters';
import { createField } from './create-field';
import { createValidator } from './create-validator';

const Field = {
  TextInput: createField(TextInput),
  PhoneInput: createField(PhoneInput),
  RadioGroup: createField(RadioGroup),
};

export { Form, Field, createValidator };
