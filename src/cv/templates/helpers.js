import * as _ from 'lodash';
import * as dateFns from 'date-fns';
import { ru } from 'date-fns/locale/ru';

const SECTION_ID = {
  EDUCATION: 'EDUCATION',
  WORK_EXPERIENCE: 'WORK_EXPERIENCE',
  PROFILE: 'PROFILE',
  LANGUAGES: 'LANGUAGES',
  LINKS: 'LINKS',
  SKILLS: 'SKILLS',
};

const LANGUAGE_LEVEL = {
  A1: 'A1',
  A2: 'A2',
  B1: 'B1',
  B2: 'B2',
  C1: 'C1',
  C2: 'C2',
};
const SKILL_LEVEL = {
  Novice: 'Novice',
  Beginner: 'Beginner',
  Skillful: 'Skillful',
  Experienced: 'Experienced',
  Advanced: 'Advanced',
  Expert: 'Expert',
};

const levelToPercent = (level, type) => {
  const ORDER =
    type === 'lang'
      ? [
          LANGUAGE_LEVEL.A1,
          LANGUAGE_LEVEL.A2,
          LANGUAGE_LEVEL.B1,
          LANGUAGE_LEVEL.B2,
          LANGUAGE_LEVEL.C1,
          LANGUAGE_LEVEL.C2,
        ]
      : [
          SKILL_LEVEL.Novice,
          SKILL_LEVEL.Beginner,
          SKILL_LEVEL.Skillful,
          SKILL_LEVEL.Experienced,
          SKILL_LEVEL.Advanced,
          SKILL_LEVEL.Expert,
        ];
  const idx = ORDER.findIndex((el) => el === level);
  if (idx === -1) return ``;
  const onePart = (100 / Object.keys(LANGUAGE_LEVEL).length).toFixed(2);
  const percent = (onePart * (idx + 1)).toFixed(2);
  return percent > 100 ? '100%' : `${percent}%`;
};

const SECTION_DATA_BY_ID = {
  [SECTION_ID.EDUCATION]: (model) => model?.educationList ?? [],
  [SECTION_ID.WORK_EXPERIENCE]: (model) => model?.workExperienceList ?? [],
  [SECTION_ID.PROFILE]: (model) => model?.profile ?? {},
  [SECTION_ID.LANGUAGES]: (model) => model?.languages ?? [],
  [SECTION_ID.LINKS]: (model) => model?.links ?? [],
  [SECTION_ID.SKILLS]: (model) => model?.skills ?? [],
};

const allFieldFilled = (
  paths,
  dataObj,
  emptyValues = [null, undefined, ''],
) => {
  return _.every(paths, (path) => {
    const val = _.get(dataObj, path);
    return !emptyValues.includes(val);
  });
};

const isSectionNotEmpty = (cvModel, sectionId) => {
  const section = SECTION_DATA_BY_ID[sectionId];
  if (section) {
    const data = section(cvModel);
    switch (sectionId) {
      case SECTION_ID.EDUCATION: {
        return !!data?.length;
      }
      case SECTION_ID.WORK_EXPERIENCE:
        return !!data?.length;
      case SECTION_ID.PROFILE:
        return allFieldFilled(['summary'], data);
      case SECTION_ID.LANGUAGES:
        return !!data?.length;
      case SECTION_ID.LINKS:
        return !!data?.length;
      case SECTION_ID.SKILLS:
        return !!data?.length && data.some((el) => !!el?.data?.length);
      default:
        return false;
    }
  }
  return false;
};

const getSections = (cvModel, exclude = []) => {
  const { sectionSettings } = cvModel;
  return sectionSettings.filter(
    (el) =>
      !el?.hideSection &&
      !exclude.includes(el.sectionId) &&
      isSectionNotEmpty(cvModel, el.sectionId),
  );
};

const getFullNameStr = (
  { name, secondName, middleName, noMiddleName },
  order = 'fms',
) => {
  const firstNameStr = name ?? '';
  const secondNameStr = secondName ?? '';
  const midNameStr = noMiddleName ? '' : (middleName ?? '');
  const list = [];
  switch (order) {
    case 'sfm':
      list.push(secondNameStr, firstNameStr, midNameStr);
      break;
    case 'fms':
    default:
      list.push(firstNameStr, midNameStr, secondNameStr);
      break;
  }
  return _.compact(list).join(' ');
};

const getFullAddress = ({ country, city, address, postalCode }) => {
  const str = [
    address,
    postalCode,
    _.capitalize(city ?? ''),
    _.capitalize(country ?? ''),
  ];
  return _.compact(str).join(',');
};

const dateFormatter = (
  date,
  outputFormat = 'dd.MM.yyyy',
  emptyValue = '',
  options = { locale: ru },
) => {
  if (!date && date !== 0) return emptyValue;
  return dateFns.isValid(new Date(date))
    ? dateFns.formatDate(date, outputFormat, options)
    : emptyValue;
};

const Rating = (
  width,
  label,
  mainColor,
  subColor = 'rgb(156 163 175)',
  height = 3,
) => {
  const innerHeight = `h-${height ?? 3}`;
  return `
             <h3 class="capitalize tracking-wide">${label}</h3>
             <div class="flex items-center">
                  <div class="w-full ${innerHeight} rounded" style="background-color: ${subColor}">
                       <div class="${innerHeight} rounded" style="width: ${width}; background-color: ${mainColor}"></div>
                  </div>
             </div>
      `;
};

export const helpers = {
  getFullNameStr,
  getFullAddress,
  getSections,
  isSectionNotEmpty,
  allFieldFilled,
  SECTION_ID,
  _lodash_: _,
  dateFormatter,
  LANGUAGE_LEVEL,
  levelToPercent,
  Rating,
};
