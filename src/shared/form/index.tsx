import { Form, TextInput, RadioGroup } from './adapters';
import { createField } from './create-field';
import { createValidator } from './create-validator';

const Field = {
  TextInput: createField(TextInput),
  RadioGroup: createField(RadioGroup),
};

export { Form, Field, createValidator };
