export interface IPersonalDataModel {
  name: string;
  secondName: string;
  noMiddleName: boolean;
  middleName: string;
  birtDate: string;
  gender: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  address: string;
  postalCode: string;
}

export interface IWorkExpModel {
  company: string;
  location: string;
  jobPosition: string;
  startDate: string;
  endDate: string;
  description: string;
  stillWorking: boolean;
}

export interface IEducationModel {
  institution: string;
  degree: string;
  location: string;
  startYear: string;
  endYear: string;
  description: string;
}

export interface ISectionSettingModel {
  sectionId: string;
  sectionName: string;
  hideSection: boolean;
}

export interface ISkillModel {
  type: string;
  data: { name: string; level: string }[];
}

export interface ProfileModel {
  summary: string;
}

export interface ILanguageModel {
  language: string;
  level: string;
}

export interface ILinkModel {
  label: string;
  link: string;
}

export enum ESectionId {
  SKILLS = 'SKILLS',
  PROFILE = 'PROFILE',
  EDUCATION = 'EDUCATION',
  WORK_EXPERIENCE = 'WORK_EXPERIENCE',
  LANGUAGES = 'LANGUAGES',
  LINKS = 'LINKS',
}

export enum EPersonalDataGender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  NOT_SPECIFY = 'NOT_SPECIFY',
}

export enum ESkillType {
  HARD = 'HARD',
  SOFT = 'SOFT',
}

export interface ICvDataModel {
  personalData: IPersonalDataModel;
  workExperienceList: IWorkExpModel[];
  educationList: IEducationModel[];
  sectionSettings: ISectionSettingModel[];
  skills: ISkillModel[];
  profile: ProfileModel;
  languages: ILanguageModel[];
  links: ILinkModel[];
}
