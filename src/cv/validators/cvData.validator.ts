import { registerDecorator } from 'class-validator';

export function IsValidJSON(validationOptions?: { message: string }) {
  return (object: any, propertyName: string) =>
    registerDecorator({
      name: 'IsValidJSON',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any) {
          try {
            return !!JSON.parse(value);
          } catch {
            return false;
          }
        },
      },
    });
}
