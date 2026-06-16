import { defineMessages, type MessageDescriptor } from "react-intl";

export const COUNTRIES = {
  AF: "Afghanistan",
  AL: "Albania",
  DZ: "Algeria",
  AS: "American Samoa",
  AD: "Andorra",
  AO: "Angola",
  AI: "Anguilla",
  AQ: "Antarctica",
  AG: "Antigua and Barbuda",
  AR: "Argentina",
  AM: "Armenia",
  AW: "Aruba",
  AU: "Australia",
  AT: "Austria",
  AZ: "Azerbaijan",
  BS: "Bahamas",
  BH: "Bahrain",
  BD: "Bangladesh",
  BB: "Barbados",
  BY: "Belarus",
  BE: "Belgium",
  BZ: "Belize",
  BJ: "Benin",
  BM: "Bermuda",
  BT: "Bhutan",
  BO: "Bolivia",
  BA: "Bosnia and Herzegovina",
  BW: "Botswana",
  BR: "Brazil",
  BN: "Brunei",
  BG: "Bulgaria",
  BF: "Burkina Faso",
  BI: "Burundi",
  CV: "Cabo Verde",
  KH: "Cambodia",
  CM: "Cameroon",
  CA: "Canada",
  KY: "Cayman Islands",
  CF: "Central African Republic",
  TD: "Chad",
  CL: "Chile",
  CN: "China",
  CO: "Colombia",
  KM: "Comoros",
  CG: "Congo (Congo-Brazzaville)",
  CD: "Congo (DRC)",
  CR: "Costa Rica",
  CI: "Côte d’Ivoire",
  HR: "Croatia",
  CU: "Cuba",
  CY: "Cyprus",
  CZ: "Czechia",
  DK: "Denmark",
  DJ: "Djibouti",
  DM: "Dominica",
  DO: "Dominican Republic",
  EC: "Ecuador",
  EG: "Egypt",
  SV: "El Salvador",
  GQ: "Equatorial Guinea",
  ER: "Eritrea",
  EE: "Estonia",
  SZ: "Eswatini",
  ET: "Ethiopia",
  FJ: "Fiji",
  FI: "Finland",
  FR: "France",
  GA: "Gabon",
  GM: "Gambia",
  GE: "Georgia",
  DE: "Germany",
  GH: "Ghana",
  GR: "Greece",
  GL: "Greenland",
  GD: "Grenada",
  GU: "Guam",
  GT: "Guatemala",
  GN: "Guinea",
  GW: "Guinea-Bissau",
  GY: "Guyana",
  HT: "Haiti",
  HN: "Honduras",
  HK: "Hong Kong",
  HU: "Hungary",
  IS: "Iceland",
  IN: "India",
  ID: "Indonesia",
  IR: "Iran",
  IQ: "Iraq",
  IE: "Ireland",
  IL: "Israel",
  IT: "Italy",
  JM: "Jamaica",
  JP: "Japan",
  JO: "Jordan",
  KZ: "Kazakhstan",
  KE: "Kenya",
  KI: "Kiribati",
  KP: "Korea (North)",
  KR: "Korea (South)",
  KW: "Kuwait",
  KG: "Kyrgyzstan",
  LA: "Laos",
  LV: "Latvia",
  LB: "Lebanon",
  LS: "Lesotho",
  LR: "Liberia",
  LY: "Libya",
  LI: "Liechtenstein",
  LT: "Lithuania",
  LU: "Luxembourg",
  MG: "Madagascar",
  MW: "Malawi",
  MY: "Malaysia",
  MV: "Maldives",
  ML: "Mali",
  MT: "Malta",
  MH: "Marshall Islands",
  MR: "Mauritania",
  MU: "Mauritius",
  MX: "Mexico",
  FM: "Micronesia",
  MD: "Moldova",
  MC: "Monaco",
  MN: "Mongolia",
  ME: "Montenegro",
  MA: "Morocco",
  MZ: "Mozambique",
  MM: "Myanmar",
  NA: "Namibia",
  NR: "Nauru",
  NP: "Nepal",
  NL: "Netherlands",
  NZ: "New Zealand",
  NI: "Nicaragua",
  NE: "Niger",
  NG: "Nigeria",
  NO: "Norway",
  OM: "Oman",
  PK: "Pakistan",
  PW: "Palau",
  PS: "Palestine",
  PA: "Panama",
  PG: "Papua New Guinea",
  PY: "Paraguay",
  PE: "Peru",
  PH: "Philippines",
  PL: "Poland",
  PT: "Portugal",
  QA: "Qatar",
  RO: "Romania",
  RU: "Russia",
  RW: "Rwanda",
  WS: "Samoa",
  SM: "San Marino",
  ST: "São Tomé and Príncipe",
  SA: "Saudi Arabia",
  SN: "Senegal",
  RS: "Serbia",
  SC: "Seychelles",
  SL: "Sierra Leone",
  SG: "Singapore",
  SK: "Slovakia",
  SI: "Slovenia",
  SB: "Solomon Islands",
  SO: "Somalia",
  ZA: "South Africa",
  SS: "South Sudan",
  ES: "Spain",
  LK: "Sri Lanka",
  SD: "Sudan",
  SR: "Suriname",
  SE: "Sweden",
  CH: "Switzerland",
  SY: "Syria",
  TW: "Taiwan",
  TJ: "Tajikistan",
  TZ: "Tanzania",
  TH: "Thailand",
  TL: "Timor-Leste",
  TG: "Togo",
  TO: "Tonga",
  TT: "Trinidad and Tobago",
  TN: "Tunisia",
  TR: "Turkey",
  TM: "Turkmenistan",
  TV: "Tuvalu",
  UG: "Uganda",
  UA: "Ukraine",
  AE: "United Arab Emirates",
  GB: "United Kingdom",
  US: "United States",
  UY: "Uruguay",
  UZ: "Uzbekistan",
  VU: "Vanuatu",
  VA: "Vatican City",
  VE: "Venezuela",
  VN: "Vietnam",
  YE: "Yemen",
  ZM: "Zambia",
  ZW: "Zimbabwe",
} as const;

export type CountryCode = keyof typeof COUNTRIES;

export const COUNTRY_MESSAGES: Record<CountryCode, MessageDescriptor> = defineMessages({
  AF: {
    id: "country.AF",
    defaultMessage: "Afghanistan",
  },
  AL: {
    id: "country.AL",
    defaultMessage: "Albania",
  },
  DZ: {
    id: "country.DZ",
    defaultMessage: "Algeria",
  },
  AS: {
    id: "country.AS",
    defaultMessage: "American Samoa",
  },
  AD: {
    id: "country.AD",
    defaultMessage: "Andorra",
  },
  AO: {
    id: "country.AO",
    defaultMessage: "Angola",
  },
  AI: {
    id: "country.AI",
    defaultMessage: "Anguilla",
  },
  AQ: {
    id: "country.AQ",
    defaultMessage: "Antarctica",
  },
  AG: {
    id: "country.AG",
    defaultMessage: "Antigua and Barbuda",
  },
  AR: {
    id: "country.AR",
    defaultMessage: "Argentina",
  },
  AM: {
    id: "country.AM",
    defaultMessage: "Armenia",
  },
  AW: {
    id: "country.AW",
    defaultMessage: "Aruba",
  },
  AU: {
    id: "country.AU",
    defaultMessage: "Australia",
  },
  AT: {
    id: "country.AT",
    defaultMessage: "Austria",
  },
  AZ: {
    id: "country.AZ",
    defaultMessage: "Azerbaijan",
  },
  BS: {
    id: "country.BS",
    defaultMessage: "Bahamas",
  },
  BH: {
    id: "country.BH",
    defaultMessage: "Bahrain",
  },
  BD: {
    id: "country.BD",
    defaultMessage: "Bangladesh",
  },
  BB: {
    id: "country.BB",
    defaultMessage: "Barbados",
  },
  BY: {
    id: "country.BY",
    defaultMessage: "Belarus",
  },
  BE: {
    id: "country.BE",
    defaultMessage: "Belgium",
  },
  BZ: {
    id: "country.BZ",
    defaultMessage: "Belize",
  },
  BJ: {
    id: "country.BJ",
    defaultMessage: "Benin",
  },
  BM: {
    id: "country.BM",
    defaultMessage: "Bermuda",
  },
  BT: {
    id: "country.BT",
    defaultMessage: "Bhutan",
  },
  BO: {
    id: "country.BO",
    defaultMessage: "Bolivia",
  },
  BA: {
    id: "country.BA",
    defaultMessage: "Bosnia and Herzegovina",
  },
  BW: {
    id: "country.BW",
    defaultMessage: "Botswana",
  },
  BR: {
    id: "country.BR",
    defaultMessage: "Brazil",
  },
  BN: {
    id: "country.BN",
    defaultMessage: "Brunei",
  },
  BG: {
    id: "country.BG",
    defaultMessage: "Bulgaria",
  },
  BF: {
    id: "country.BF",
    defaultMessage: "Burkina Faso",
  },
  BI: {
    id: "country.BI",
    defaultMessage: "Burundi",
  },
  CV: {
    id: "country.CV",
    defaultMessage: "Cabo Verde",
  },
  KH: {
    id: "country.KH",
    defaultMessage: "Cambodia",
  },
  CM: {
    id: "country.CM",
    defaultMessage: "Cameroon",
  },
  CA: {
    id: "country.CA",
    defaultMessage: "Canada",
  },
  KY: {
    id: "country.KY",
    defaultMessage: "Cayman Islands",
  },
  CF: {
    id: "country.CF",
    defaultMessage: "Central African Republic",
  },
  TD: {
    id: "country.TD",
    defaultMessage: "Chad",
  },
  CL: {
    id: "country.CL",
    defaultMessage: "Chile",
  },
  CN: {
    id: "country.CN",
    defaultMessage: "China",
  },
  CO: {
    id: "country.CO",
    defaultMessage: "Colombia",
  },
  KM: {
    id: "country.KM",
    defaultMessage: "Comoros",
  },
  CG: {
    id: "country.CG",
    defaultMessage: "Congo (Congo-Brazzaville)",
  },
  CD: {
    id: "country.CD",
    defaultMessage: "Congo (DRC)",
  },
  CR: {
    id: "country.CR",
    defaultMessage: "Costa Rica",
  },
  CI: {
    id: "country.CI",
    defaultMessage: "Côte d’Ivoire",
  },
  HR: {
    id: "country.HR",
    defaultMessage: "Croatia",
  },
  CU: {
    id: "country.CU",
    defaultMessage: "Cuba",
  },
  CY: {
    id: "country.CY",
    defaultMessage: "Cyprus",
  },
  CZ: {
    id: "country.CZ",
    defaultMessage: "Czechia",
  },
  DK: {
    id: "country.DK",
    defaultMessage: "Denmark",
  },
  DJ: {
    id: "country.DJ",
    defaultMessage: "Djibouti",
  },
  DM: {
    id: "country.DM",
    defaultMessage: "Dominica",
  },
  DO: {
    id: "country.DO",
    defaultMessage: "Dominican Republic",
  },
  EC: {
    id: "country.EC",
    defaultMessage: "Ecuador",
  },
  EG: {
    id: "country.EG",
    defaultMessage: "Egypt",
  },
  SV: {
    id: "country.SV",
    defaultMessage: "El Salvador",
  },
  GQ: {
    id: "country.GQ",
    defaultMessage: "Equatorial Guinea",
  },
  ER: {
    id: "country.ER",
    defaultMessage: "Eritrea",
  },
  EE: {
    id: "country.EE",
    defaultMessage: "Estonia",
  },
  SZ: {
    id: "country.SZ",
    defaultMessage: "Eswatini",
  },
  ET: {
    id: "country.ET",
    defaultMessage: "Ethiopia",
  },
  FJ: {
    id: "country.FJ",
    defaultMessage: "Fiji",
  },
  FI: {
    id: "country.FI",
    defaultMessage: "Finland",
  },
  FR: {
    id: "country.FR",
    defaultMessage: "France",
  },
  GA: {
    id: "country.GA",
    defaultMessage: "Gabon",
  },
  GM: {
    id: "country.GM",
    defaultMessage: "Gambia",
  },
  GE: {
    id: "country.GE",
    defaultMessage: "Georgia",
  },
  DE: {
    id: "country.DE",
    defaultMessage: "Germany",
  },
  GH: {
    id: "country.GH",
    defaultMessage: "Ghana",
  },
  GR: {
    id: "country.GR",
    defaultMessage: "Greece",
  },
  GL: {
    id: "country.GL",
    defaultMessage: "Greenland",
  },
  GD: {
    id: "country.GD",
    defaultMessage: "Grenada",
  },
  GU: {
    id: "country.GU",
    defaultMessage: "Guam",
  },
  GT: {
    id: "country.GT",
    defaultMessage: "Guatemala",
  },
  GN: {
    id: "country.GN",
    defaultMessage: "Guinea",
  },
  GW: {
    id: "country.GW",
    defaultMessage: "Guinea-Bissau",
  },
  GY: {
    id: "country.GY",
    defaultMessage: "Guyana",
  },
  HT: {
    id: "country.HT",
    defaultMessage: "Haiti",
  },
  HN: {
    id: "country.HN",
    defaultMessage: "Honduras",
  },
  HK: {
    id: "country.HK",
      defaultMessage: "Hong Kong",
  },
  HU: {
    id: "country.HU",
    defaultMessage: "Hungary",
  },
  IS: {
    id: "country.IS",
    defaultMessage: "Iceland",
  },
  IN: {
    id: "country.IN",
    defaultMessage: "India",
  },
  ID: {
    id: "country.ID",
    defaultMessage: "Indonesia",
  },
  IR: {
    id: "country.IR",
    defaultMessage: "Iran",
  },
  IQ: {
    id: "country.IQ",
    defaultMessage: "Iraq",
  },
  IE: {
    id: "country.IE",
    defaultMessage: "Ireland",
  },
  IL: {
    id: "country.IL",
    defaultMessage: "Israel",
  },
  IT: {
    id: "country.IT",
    defaultMessage: "Italy",
  },
  JM: {
    id: "country.JM",
    defaultMessage: "Jamaica",
  },
  JP: {
    id: "country.JP",
    defaultMessage: "Japan",
  },
  JO: {
    id: "country.JO",
    defaultMessage: "Jordan",
  },
  KZ: {
    id: "country.KZ",
    defaultMessage: "Kazakhstan",
  },
  KE: {
    id: "country.KE",
    defaultMessage: "Kenya",
  },
  KI: {
    id: "country.KI",
    defaultMessage: "Kiribati",
  },
  KP: {
    id: "country.KP",
    defaultMessage: "Korea (North)",
  },
  KR: {
    id: "country.KR",
    defaultMessage: "Korea (South)",
  },
  KW: {
    id: "country.KW",
    defaultMessage: "Kuwait",
  },
  KG: {
    id: "country.KG",
    defaultMessage: "Kyrgyzstan",
  },
  LA: {
    id: "country.LA",
    defaultMessage: "Laos",
  },
  LV: {
    id: "country.LV",
    defaultMessage: "Latvia",
  },
  LB: {
    id: "country.LB",
    defaultMessage: "Lebanon",
  },
  LS: {
    id: "country.LS",
    defaultMessage: "Lesotho",
  },
  LR: {
    id: "country.LR",
    defaultMessage: "Liberia",
  },
  LY: {
    id: "country.LY",
    defaultMessage: "Libya",
  },
  LI: {
    id: "country.LI",
    defaultMessage: "Liechtenstein",
  },
  LT: {
    id: "country.LT",
    defaultMessage: "Lithuania",
  },
  LU: {
    id: "country.LU",
    defaultMessage: "Luxembourg",
  },
  MG: {
    id: "country.MG",
    defaultMessage: "Madagascar",
  },
  MW: {
    id: "country.MW",
    defaultMessage: "Malawi",
  },
  MY: {
    id: "country.MY",
    defaultMessage: "Malaysia",
  },
  MV: {
    id: "country.MV",
    defaultMessage: "Maldives",
  },
  ML: {
    id: "country.ML",
    defaultMessage: "Mali",
  },
  MT: {
    id: "country.MT",
    defaultMessage: "Malta",
  },
  MH: {
    id: "country.MH",
    defaultMessage: "Marshall Islands",
  },
  MR: {
    id: "country.MR",
    defaultMessage: "Mauritania",
  },
  MU: {
    id: "country.MU",
    defaultMessage: "Mauritius",
  },
  MX: {
    id: "country.MX",
    defaultMessage: "Mexico",
  },
  FM: {
    id: "country.FM",
    defaultMessage: "Micronesia",
  },
  MD: {
    id: "country.MD",
    defaultMessage: "Moldova",
  },
  MC: {
    id: "country.MC",
    defaultMessage: "Monaco",
  },
  MN: {
    id: "country.MN",
    defaultMessage: "Mongolia",
  },
  ME: {
    id: "country.ME",
    defaultMessage: "Montenegro",
  },
  MA: {
    id: "country.MA",
    defaultMessage: "Morocco",
  },
  MZ: {
    id: "country.MZ",
    defaultMessage: "Mozambique",
  },
  MM: {
    id: "country.MM",
    defaultMessage: "Myanmar",
  },
  NA: {
    id: "country.NA",
    defaultMessage: "Namibia",
  },
  NR: {
    id: "country.NR",
    defaultMessage: "Nauru",
  },
  NP: {
    id: "country.NP",
    defaultMessage: "Nepal",
  },
  NL: {
    id: "country.NL",
    defaultMessage: "Netherlands",
  },
  NZ: {
    id: "country.NZ",
    defaultMessage: "New Zealand",
  },
  NI: {
    id: "country.NI",
    defaultMessage: "Nicaragua",
  },
  NE: {
    id: "country.NE",
    defaultMessage: "Niger",
  },
  NG: {
    id: "country.NG",
    defaultMessage: "Nigeria",
  },
  NO: {
    id: "country.NO",
    defaultMessage: "Norway",
  },
  OM: {
    id: "country.OM",
    defaultMessage: "Oman",
  },
  PK: {
    id: "country.PK",
    defaultMessage: "Pakistan",
  },
  PW: {
    id: "country.PW",
    defaultMessage: "Palau",
  },
  PS: {
    id: "country.PS",
    defaultMessage: "Palestine",
  },
  PA: {
    id: "country.PA",
    defaultMessage: "Panama",
  },
  PG: {
    id: "country.PG",
    defaultMessage: "Papua New Guinea",
  },
  PY: {
    id: "country.PY",
    defaultMessage: "Paraguay",
  },
  PE: {
    id: "country.PE",
    defaultMessage: "Peru",
  },
  PH: {
    id: "country.PH",
    defaultMessage: "Philippines",
  },
  PL: {
    id: "country.PL",
    defaultMessage: "Poland",
  },
  PT: {
    id: "country.PT",
    defaultMessage: "Portugal",
  },
  QA: {
    id: "country.QA",
    defaultMessage: "Qatar",
  },
  RO: {
    id: "country.RO",
    defaultMessage: "Romania",
  },
  RU: {
    id: "country.RU",
    defaultMessage: "Russia",
  },
  RW: {
    id: "country.RW",
    defaultMessage: "Rwanda",
  },
  WS: {
    id: "country.WS",
    defaultMessage: "Samoa",
  },
  SM: {
    id: "country.SM",
    defaultMessage: "San Marino",
  },
  ST: {
    id: "country.ST",
    defaultMessage: "São Tomé and Príncipe",
  },
  SA: {
    id: "country.SA",
    defaultMessage: "Saudi Arabia",
  },
  SN: {
    id: "country.SN",
    defaultMessage: "Senegal",
  },
  RS: {
    id: "country.RS",
    defaultMessage: "Serbia",
  },
  SC: {
    id: "country.SC",
    defaultMessage: "Seychelles",
  },
  SL: {
    id: "country.SL",
    defaultMessage: "Sierra Leone",
  },
  SG: {
    id: "country.SG",
    defaultMessage: "Singapore",
  },
  SK: {
    id: "country.SK",
    defaultMessage: "Slovakia",
  },
  SI: {
    id: "country.SI",
    defaultMessage: "Slovenia",
  },
  SB: {
    id: "country.SB",
    defaultMessage: "Solomon Islands",
  },
  SO: {
    id: "country.SO",
    defaultMessage: "Somalia",
  },
  ZA: {
    id: "country.ZA",
    defaultMessage: "South Africa",
  },
  SS: {
    id: "country.SS",
    defaultMessage: "South Sudan",
  },
  ES: {
    id: "country.ES",
    defaultMessage: "Spain",
  },
  LK: {
    id: "country.LK",
    defaultMessage: "Sri Lanka",
  },
  SD: {
    id: "country.SD",
    defaultMessage: "Sudan",
  },
  SR: {
    id: "country.SR",
    defaultMessage: "Suriname",
  },
  SE: {
    id: "country.SE",
    defaultMessage: "Sweden",
  },
  CH: {
    id: "country.CH",
    defaultMessage: "Switzerland",
  },
  SY: {
    id: "country.SY",
    defaultMessage: "Syria",
  },
  TW: {
    id: "country.TW",
    defaultMessage: "Taiwan",
  },
  TJ: {
    id: "country.TJ",
    defaultMessage: "Tajikistan",
  },
  TZ: {
    id: "country.TZ",
    defaultMessage: "Tanzania",
  },
  TH: {
    id: "country.TH",
    defaultMessage: "Thailand",
  },
  TL: {
    id: "country.TL",
    defaultMessage: "Timor-Leste",
  },
  TG: {
    id: "country.TG",
    defaultMessage: "Togo",
  },
  TO: {
    id: "country.TO",
    defaultMessage: "Tonga",
  },
  TT: {
    id: "country.TT",
    defaultMessage: "Trinidad and Tobago",
  },
  TN: {
    id: "country.TN",
    defaultMessage: "Tunisia",
  },
  TR: {
    id: "country.TR",
    defaultMessage: "Turkey",
  },
  TM: {
    id: "country.TM",
    defaultMessage: "Turkmenistan",
  },
  TV: {
    id: "country.TV",
    defaultMessage: "Tuvalu",
  },
  UG: {
    id: "country.UG",
    defaultMessage: "Uganda",
  },
  UA: {
    id: "country.UA",
    defaultMessage: "Ukraine",
  },
  AE: {
    id: "country.AE",
    defaultMessage: "United Arab Emirates",
  },
  GB: {
    id: "country.GB",
    defaultMessage: "United Kingdom",
  },
  US: {
    id: "country.US",
    defaultMessage: "United States",
  },
  UY: {
    id: "country.UY",
    defaultMessage: "Uruguay",
  },
  UZ: {
    id: "country.UZ",
    defaultMessage: "Uzbekistan",
  },
  VU: {
    id: "country.VU",
    defaultMessage: "Vanuatu",
  },
  VA: {
    id: "country.VA",
    defaultMessage: "Vatican City",
  },
  VE: {
    id: "country.VE",
    defaultMessage: "Venezuela",
  },
  VN: {
    id: "country.VN",
    defaultMessage: "Vietnam",
  },
  YE: {
    id: "country.YE",
    defaultMessage: "Yemen",
  },
  ZM: {
    id: "country.ZM",
    defaultMessage: "Zambia",
  },
  ZW: {
    id: "country.ZW",
    defaultMessage: "Zimbabwe",
  },
});

export const getCountryMessage = (country: string): MessageDescriptor | null => {
  const normalized = country.toUpperCase();

  if (!(normalized in COUNTRY_MESSAGES)) {
    return null;
  }

  return COUNTRY_MESSAGES[normalized as CountryCode];
};
