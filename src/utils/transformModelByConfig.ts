import { get, isNil, forIn } from 'lodash';
/* eslint-disable */
export interface IConfigField {
  type: string;
  getValue?: (model: any, defaultValue: any) => any;
  fields?: ITransformConfig;
}

export interface ITransformConfig {
  [key: string]: IConfigField;
}

export enum EFieldsType {
  ARRAY = 'array',
  OBJECT = 'object',
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  ARRAY_OBJECT = 'arrayObject',
}

const RESPONSE_DEFAULT_VALUE_MAP = {
  [EFieldsType.ARRAY]: [],
  [EFieldsType.OBJECT]: {},
  [EFieldsType.STRING]: '',
  [EFieldsType.NUMBER]: null,
  [EFieldsType.BOOLEAN]: false,
  [EFieldsType.ARRAY_OBJECT]: [],
};

const REQUEST_DEFAULT_VALUE_MAP = {
  [EFieldsType.ARRAY]: [],
  [EFieldsType.OBJECT]: null,
  [EFieldsType.STRING]: null,
  [EFieldsType.NUMBER]: null,
  [EFieldsType.BOOLEAN]: false,
  [EFieldsType.ARRAY_OBJECT]: [],
};

export const getValueByPath = (
  model: any,
  path: string,
  defaultValue: any,
): any => {
  const value = get(model, path!);
  return isNil(value) || value === '' ? defaultValue : value;
};

const getCurrentModel = (
  model: any,
  initialModel: any,
  configValue: IConfigField,
  configKey: string,
  defaultValue: any,
): any => {
  const modelValue =
    isNil(model?.[configKey]) || model?.[configKey] === ''
      ? defaultValue
      : model[configKey];
  return configValue?.getValue
    ? configValue?.getValue(initialModel, defaultValue)
    : modelValue;
};

const transformModelByConfig = (
  defaultValues: any,
  config: ITransformConfig,
  model: any,
  initialModel: any = model,
): any => {
  const fullModel = {};
  forIn(config, (configValue, configKey) => {
    const currentModel = getCurrentModel(
      model,
      initialModel,
      configValue,
      configKey,
      defaultValues[configValue.type],
    );
    switch (configValue?.type) {
      case EFieldsType.OBJECT: {
        fullModel[configKey] = transformModelByConfig(
          defaultValues,
          configValue?.fields!,
          currentModel,
          initialModel,
        );
        break;
      }
      case EFieldsType.ARRAY_OBJECT: {
        if (currentModel?.length) {
          fullModel[configKey] = currentModel?.map((el) =>
            transformModelByConfig(
              defaultValues,
              configValue?.fields!,
              el,
              initialModel,
            ),
          );
        } else {
          fullModel[configKey] = defaultValues[configValue.type];
        }
        break;
      }
      default:
        fullModel[configKey] = currentModel;
    }
  });
  return fullModel;
};

export const transformResponseModel = (
  model: any,
  config: ITransformConfig,
) => {
  return transformModelByConfig(RESPONSE_DEFAULT_VALUE_MAP, config, model);
};

export const transformModelForRequest = (
  model: any,
  config: ITransformConfig,
) => {
  return transformModelByConfig(REQUEST_DEFAULT_VALUE_MAP, config, model);
};
/* eslint-enable */
