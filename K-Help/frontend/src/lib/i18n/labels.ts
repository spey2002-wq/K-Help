import type { MessageKey } from "@/lib/i18n/messages";
import { humanize } from "@/lib/utils";

type TFn = (key: MessageKey) => string;

const GUIDE_CAT: Record<string, MessageKey> = {
  VISA_IMMIGRATION: "guideCat.visaImmigration",
  VISA_BY_COUNTRY: "guideCat.visaByCountry",
  HEALTHCARE: "guideCat.healthcare",
  BANKING: "guideCat.banking",
  HOUSING: "guideCat.housing",
  EMPLOYMENT: "guideCat.employment",
  EDUCATION: "guideCat.education",
  EMERGENCY: "guideCat.emergency",
  TRANSPORTATION: "guideCat.transportation",
  DAILY_LIFE: "guideCat.dailyLife",
};

const JOB_CAT: Record<string, MessageKey> = {
  RESTAURANT: "jobCat.restaurant",
  CAFE: "jobCat.cafe",
  CONVENIENCE_STORE: "jobCat.convenience",
  RETAIL: "jobCat.retail",
  DELIVERY_DRIVING: "jobCat.delivery",
  EDUCATION: "jobCat.education",
  OFFICE_ADMIN: "jobCat.office",
  IT_DESIGN: "jobCat.it",
  WAREHOUSE_FACTORY: "jobCat.warehouse",
  CONSTRUCTION: "jobCat.construction",
  BEAUTY_FITNESS: "jobCat.beauty",
  CLEANING: "jobCat.cleaning",
  HOTEL_TOURISM: "jobCat.hotel",
  HEALTHCARE: "jobCat.healthcare",
  TRANSLATION: "jobCat.translation",
  EVENT_PROMOTION: "jobCat.events",
  OTHER: "jobCat.other",
};

const JOB_TYPE: Record<string, MessageKey> = {
  FULL_TIME: "jobType.fullTime",
  PART_TIME: "jobType.partTime",
  CONTRACT: "jobType.contract",
  TEMPORARY: "jobType.temporary",
  INTERNSHIP: "jobType.internship",
  FREELANCE: "jobType.freelance",
};

const SORT: Record<string, MessageKey> = {
  NEWEST: "sort.newest",
  MOST_VIEWED: "sort.mostViewed",
  DEADLINE_SOON: "sort.deadlineSoon",
  PAY_HIGH: "sort.payHigh",
  PAY_LOW: "sort.payLow",
};

const SHIFT: Record<string, MessageKey> = {
  DAY: "shift.day",
  EVENING: "shift.evening",
  NIGHT: "shift.night",
  ROTATING: "shift.rotating",
  FLEXIBLE: "shift.flexible",
};

const EXPERIENCE: Record<string, MessageKey> = {
  NO_EXPERIENCE: "exp.none",
  JUNIOR: "exp.junior",
  MID: "exp.mid",
  SENIOR: "exp.senior",
};

const WORK_PERIOD: Record<string, MessageKey> = {
  ONE_DAY: "period.oneDay",
  UNDER_1_MONTH: "period.under1",
  ONE_TO_3_MONTHS: "period.1to3",
  THREE_TO_6_MONTHS: "period.3to6",
  OVER_6_MONTHS: "period.over6",
};

const PROPERTY: Record<string, MessageKey> = {
  ONE_ROOM: "prop.oneRoom",
  TWO_ROOM: "prop.twoRoom",
  APARTMENT: "prop.apartment",
  VILLA: "prop.villa",
  OFFICETEL: "prop.officetel",
  STUDIO: "prop.studio",
  SHARE_HOUSE: "prop.shareHouse",
  DORMITORY: "prop.dormitory",
  JEONSE: "prop.jeonse",
  WOLSE: "prop.wolse",
};

function fromMap(t: TFn, map: Record<string, MessageKey>, value?: string | null): string {
  if (!value) return "";
  const key = map[value];
  return key ? t(key) : humanize(value);
}

export function labelGuideCategory(t: TFn, value?: string | null): string {
  return fromMap(t, GUIDE_CAT, value);
}

export function labelJobCategory(t: TFn, value?: string | null): string {
  return fromMap(t, JOB_CAT, value);
}

export function labelJobType(t: TFn, value?: string | null): string {
  return fromMap(t, JOB_TYPE, value);
}

export function labelSort(t: TFn, value?: string | null): string {
  return fromMap(t, SORT, value);
}

export function labelShift(t: TFn, value?: string | null): string {
  return fromMap(t, SHIFT, value);
}

export function labelExperience(t: TFn, value?: string | null): string {
  return fromMap(t, EXPERIENCE, value);
}

export function labelWorkPeriod(t: TFn, value?: string | null): string {
  return fromMap(t, WORK_PERIOD, value);
}

export function labelPropertyType(t: TFn, value?: string | null): string {
  return fromMap(t, PROPERTY, value);
}
