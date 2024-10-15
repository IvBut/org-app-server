import {
  EPersonalDataGender,
  ESkillType,
  ICvDataModel,
} from '../models/cvData.model';
import { deepParseJson } from '../../utils/deepParseJson';
import {
  EFieldsType,
  getValueByPath,
  ITransformConfig,
  transformResponseModel,
} from '../../utils/transformModelByConfig';
import { cloneDeep } from 'lodash';

const DEFAULT_SKILLS = [
  {
    type: ESkillType.HARD,
    data: [],
  },
  {
    type: ESkillType.SOFT,
    data: [],
  },
];
const CREATE_CONFIG: ITransformConfig = {
  personalData: {
    type: EFieldsType.OBJECT,
    fields: {
      name: {
        type: EFieldsType.STRING,
        getValue: (model, defaultValue) =>
          getValueByPath(model, 'personalData.name', defaultValue),
      },
      secondName: {
        type: EFieldsType.STRING,
        getValue: (model, defaultValue) =>
          getValueByPath(model, 'personalData.secondName', defaultValue),
      },
      noMiddleName: {
        type: EFieldsType.BOOLEAN,
        getValue: (model, defaultValue) =>
          getValueByPath(model, 'personalData.noMiddleName', defaultValue),
      },
      middleName: {
        type: EFieldsType.STRING,
        getValue: (model, defaultValue) => {
          const val = getValueByPath(
            model,
            'personalData.middleName',
            defaultValue,
          );
          const noMiddleName = !!model?.personalData?.noMiddleName;
          return noMiddleName ? '' : val;
        },
      },
      birtDate: {
        type: EFieldsType.STRING,
        getValue: (model, defaultValue) =>
          getValueByPath(model, 'personalData.birtDate', defaultValue),
      },
      gender: {
        type: EFieldsType.STRING,
        getValue: (model) =>
          getValueByPath(
            model,
            'personalData.gender',
            EPersonalDataGender.NOT_SPECIFY,
          ),
      },
      email: {
        type: EFieldsType.STRING,
        getValue: (model, defaultValue) =>
          getValueByPath(model, 'personalData.email', defaultValue),
      },
      phone: {
        type: EFieldsType.STRING,
        getValue: (model, defaultValue) =>
          getValueByPath(model, 'personalData.phone', defaultValue),
      },
      country: {
        type: EFieldsType.STRING,
        getValue: (model, defaultValue) =>
          getValueByPath(model, 'personalData.country', defaultValue),
      },
      city: {
        type: EFieldsType.STRING,
        getValue: (model, defaultValue) =>
          getValueByPath(model, 'personalData.city', defaultValue),
      },
      address: {
        type: EFieldsType.STRING,
        getValue: (model, defaultValue) =>
          getValueByPath(model, 'personalData.address', defaultValue),
      },
      postalCode: {
        type: EFieldsType.STRING,
        getValue: (model, defaultValue) =>
          getValueByPath(model, 'personalData.postalCode', defaultValue),
      },
    },
  },
  workExperienceList: {
    type: EFieldsType.ARRAY_OBJECT,
    getValue: (model, defaultValue) =>
      getValueByPath(model, 'workExperienceList', defaultValue),
    fields: {
      company: { type: EFieldsType.STRING },
      location: { type: EFieldsType.STRING },
      jobPosition: { type: EFieldsType.STRING },
      startDate: { type: EFieldsType.STRING },
      endDate: { type: EFieldsType.STRING },
      description: { type: EFieldsType.STRING },
      stillWorking: { type: EFieldsType.BOOLEAN },
    },
  },
  educationList: {
    type: EFieldsType.ARRAY_OBJECT,
    getValue: (model, defaultValue) =>
      getValueByPath(model, 'educationList', defaultValue),
    fields: {
      institution: { type: EFieldsType.STRING },
      degree: { type: EFieldsType.STRING },
      location: { type: EFieldsType.STRING },
      startYear: { type: EFieldsType.STRING },
      endYear: { type: EFieldsType.STRING },
      description: { type: EFieldsType.STRING },
    },
  },
  sectionSettings: {
    type: EFieldsType.ARRAY_OBJECT,
    getValue: (model, defaultValue) =>
      getValueByPath(model, 'sectionSettings', defaultValue),
    fields: {
      sectionId: { type: EFieldsType.STRING },
      sectionName: { type: EFieldsType.STRING },
      hideSection: { type: EFieldsType.BOOLEAN },
    },
  },
  skills: {
    type: EFieldsType.ARRAY_OBJECT,
    getValue: (model, defaultValue) =>
      getValueByPath(model, 'skills', defaultValue),
    fields: {
      type: {
        type: EFieldsType.STRING,
      },
      data: {
        type: EFieldsType.ARRAY_OBJECT,
        fields: {
          name: { type: EFieldsType.STRING },
          level: { type: EFieldsType.STRING },
        },
      },
    },
  },
  profile: {
    type: EFieldsType.OBJECT,
    fields: {
      summary: { type: EFieldsType.STRING },
    },
  },
  languages: {
    type: EFieldsType.ARRAY_OBJECT,
    getValue: (model, defaultValue) =>
      getValueByPath(model, 'languages', defaultValue),
    fields: {
      language: { type: EFieldsType.STRING },
      level: { type: EFieldsType.STRING },
    },
  },
  links: {
    type: EFieldsType.ARRAY_OBJECT,
    getValue: (model, defaultValue) =>
      getValueByPath(model, 'links', defaultValue),
    fields: {
      label: { type: EFieldsType.STRING },
      link: { type: EFieldsType.STRING },
    },
  },
};

export const createCvModel = (jsonStr: string): ICvDataModel => {
  const parsedData = deepParseJson(jsonStr);
  const data = transformResponseModel(
    parsedData,
    CREATE_CONFIG,
  ) as ICvDataModel;
  if (!data?.skills?.length) {
    data.skills = cloneDeep(DEFAULT_SKILLS);
  }
  return data;
};
