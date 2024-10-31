import * as _ from 'lodash';

const SECTION_ID = {
  EDUCATION: 'EDUCATION',
  WORK_EXPERIENCE: 'WORK_EXPERIENCE',
  PROFILE: 'PROFILE',
  LANGUAGES: 'LANGUAGES',
  LINKS: 'LINKS',
  SKILLS: 'SKILLS',
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

export const helpers = {
  getFullNameStr,
  getFullAddress,
  getSections,
  isSectionNotEmpty,
  allFieldFilled,
  SECTION_ID,
  _lodash_: _,
};
