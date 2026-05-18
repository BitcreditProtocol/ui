import type { IntlShape } from "react-intl";

export type UiTranslationValues = Record<string, string | number | boolean | null | undefined>;

export const defaultUiMessages = {
  "ui.copyToClipboard.ariaLabel": "Copy to clipboard",
  "ui.copyToClipboard.errorDescription": "Failed to copy {label}.",
  "ui.copyToClipboard.errorTitle": "Copy failed",
  "ui.copyToClipboard.successDescription": "{label} copied to clipboard!",
  "ui.copyToClipboard.successTitle": "Success!",
  "ui.copyToClipboard.valueLabel": "Value",
  "ui.currencySelector.ariaLabel": "Select display currency",
  "ui.currencySelector.description": "Select your preferred display currency",
  "ui.currencySelector.menuLabel": "Display currency",
  "ui.currencySelector.noResults": "No currencies found",
  "ui.currencySelector.option.aed": "UAE Dirham",
  "ui.currencySelector.option.afn": "Afghan Afghani",
  "ui.currencySelector.option.all": "Albanian Lek",
  "ui.currencySelector.option.amd": "Armenian Dram",
  "ui.currencySelector.option.ang": "Netherlands Antillean Gulden",
  "ui.currencySelector.option.aoa": "Angolan Kwanza",
  "ui.currencySelector.option.ars": "Argentine Peso",
  "ui.currencySelector.option.arsmep": "Argentine Blue Dollar",
  "ui.currencySelector.option.aud": "Australian Dollar",
  "ui.currencySelector.option.awg": "Aruban Florin",
  "ui.currencySelector.option.azn": "Azerbaijani Manat",
  "ui.currencySelector.option.bam": "Bosnia-Herzegovina Convertible Mark",
  "ui.currencySelector.option.bbd": "Barbadian Dollar",
  "ui.currencySelector.option.bdt": "Bangladeshi Taka",
  "ui.currencySelector.option.bgn": "Bulgarian Lev",
  "ui.currencySelector.option.bhd": "Bahraini Dinar",
  "ui.currencySelector.option.bif": "Burundian Franc",
  "ui.currencySelector.option.bmd": "Bermudian Dollar",
  "ui.currencySelector.option.bnd": "Brunei Dollar",
  "ui.currencySelector.option.bob": "Bolivian Boliviano",
  "ui.currencySelector.option.brl": "Real",
  "ui.currencySelector.option.bsd": "Bahamian Dollar",
  "ui.currencySelector.option.btc": "Bitcoin (BTC)",
  "ui.currencySelector.option.btn": "Bhutanese Ngultrum",
  "ui.currencySelector.option.bwp": "Botswana Pula",
  "ui.currencySelector.option.byn": "Belarusian Ruble",
  "ui.currencySelector.option.byr": "Belarusian Ruble (legacy)",
  "ui.currencySelector.option.bzd": "Belize Dollar",
  "ui.currencySelector.option.cad": "Canadian Dollar",
  "ui.currencySelector.option.cdf": "Congolese Franc",
  "ui.currencySelector.option.chf": "Swiss Franc",
  "ui.currencySelector.option.clf": "Unidad de Fomento",
  "ui.currencySelector.option.clp": "Chilean Peso",
  "ui.currencySelector.option.cnh": "Chinese Yuan Offshore",
  "ui.currencySelector.option.cny": "Chinese Yuan",
  "ui.currencySelector.option.cop": "Colombian Peso",
  "ui.currencySelector.option.crc": "Costa Rican Colón",
  "ui.currencySelector.option.cuc": "Cuban Convertible Peso",
  "ui.currencySelector.option.cup": "Cuban Peso",
  "ui.currencySelector.option.cve": "Cape Verdean Escudo",
  "ui.currencySelector.option.czk": "Czech Koruna",
  "ui.currencySelector.option.djf": "Djiboutian Franc",
  "ui.currencySelector.option.dkk": "Danish Krone",
  "ui.currencySelector.option.dop": "Dominican Peso",
  "ui.currencySelector.option.dzd": "Algerian Dinar",
  "ui.currencySelector.option.egp": "Egyptian Pound",
  "ui.currencySelector.option.etb": "Ethiopian Birr",
  "ui.currencySelector.option.eur": "Euro",
  "ui.currencySelector.option.fjd": "Fijian Dollar",
  "ui.currencySelector.option.fkp": "Falkland Pound",
  "ui.currencySelector.option.gbp": "British Pound",
  "ui.currencySelector.option.gel": "Georgian Lari",
  "ui.currencySelector.option.ggp": "Guernsey Pound",
  "ui.currencySelector.option.ghs": "Ghanaian Cedi",
  "ui.currencySelector.option.gip": "Gibraltar Pound",
  "ui.currencySelector.option.gmd": "Gambian Dalasi",
  "ui.currencySelector.option.gnf": "Guinean Franc",
  "ui.currencySelector.option.gtq": "Guatemalan Quetzal",
  "ui.currencySelector.option.gyd": "Guyanese Dollar",
  "ui.currencySelector.option.hkd": "Hong Kong Dollar",
  "ui.currencySelector.option.hnl": "Honduran Lempira",
  "ui.currencySelector.option.hrk": "Croatian Kuna",
  "ui.currencySelector.option.htg": "Haitian Gourde",
  "ui.currencySelector.option.huf": "Hungarian Forint",
  "ui.currencySelector.option.idr": "Indonesian Rupiah",
  "ui.currencySelector.option.ils": "Israeli New Sheqel",
  "ui.currencySelector.option.imp": "Isle of Man Pound",
  "ui.currencySelector.option.inr": "Indian Rupee",
  "ui.currencySelector.option.iqd": "Iraqi Dinar",
  "ui.currencySelector.option.irr": "Iranian Rial",
  "ui.currencySelector.option.isk": "Icelandic Króna",
  "ui.currencySelector.option.jep": "Jersey Pound",
  "ui.currencySelector.option.jmd": "Jamaican Dollar",
  "ui.currencySelector.option.jod": "Jordanian Dinar",
  "ui.currencySelector.option.jpy": "Japanese Yen",
  "ui.currencySelector.option.kes": "Kenyan Shilling",
  "ui.currencySelector.option.kgs": "Kyrgyzstani Som",
  "ui.currencySelector.option.khr": "Cambodian Riel",
  "ui.currencySelector.option.kmf": "Comorian Franc",
  "ui.currencySelector.option.krw": "South Korean Won",
  "ui.currencySelector.option.kwd": "Kuwaiti Dinar",
  "ui.currencySelector.option.kyd": "Cayman Islands Dollar",
  "ui.currencySelector.option.kzt": "Kazakhstani Tenge",
  "ui.currencySelector.option.lak": "Lao Kip",
  "ui.currencySelector.option.lbp": "Lebanese Pound",
  "ui.currencySelector.option.lkr": "Sri Lankan Rupee",
  "ui.currencySelector.option.lrd": "Liberian Dollar",
  "ui.currencySelector.option.lsl": "Lesotho Loti",
  "ui.currencySelector.option.ltl": "Lithuanian Litas (legacy)",
  "ui.currencySelector.option.lvl": "Latvian Lats (legacy)",
  "ui.currencySelector.option.lyd": "Libyan Dinar",
  "ui.currencySelector.option.mad": "Moroccan Dirham",
  "ui.currencySelector.option.mdl": "Moldovan Leu",
  "ui.currencySelector.option.mga": "Malagasy Ariary",
  "ui.currencySelector.option.mkd": "Macedonian Denar",
  "ui.currencySelector.option.mmk": "Myanmar Kyat",
  "ui.currencySelector.option.mnt": "Mongolian Tögrög",
  "ui.currencySelector.option.mop": "Macanese Pataca",
  "ui.currencySelector.option.mro": "Mauritanian Ouguiya (legacy)",
  "ui.currencySelector.option.mru": "Mauritanian Ouguiya",
  "ui.currencySelector.option.mur": "Mauritian Rupee",
  "ui.currencySelector.option.mvr": "Maldivian Rufiyaa",
  "ui.currencySelector.option.mwk": "Malawian Kwacha",
  "ui.currencySelector.option.mxn": "Mexican Peso",
  "ui.currencySelector.option.myr": "Malaysian Ringgit",
  "ui.currencySelector.option.mzn": "Mozambican Metical",
  "ui.currencySelector.option.nad": "Namibian Dollar",
  "ui.currencySelector.option.ngn": "Nigerian Naira",
  "ui.currencySelector.option.nio": "Nicaraguan Córdoba",
  "ui.currencySelector.option.nok": "Norwegian Krone",
  "ui.currencySelector.option.npr": "Nepalese Rupee",
  "ui.currencySelector.option.nzd": "New Zealand Dollar",
  "ui.currencySelector.option.omr": "Omani Rial",
  "ui.currencySelector.option.pab": "Panamanian Balboa",
  "ui.currencySelector.option.pen": "Peruvian Sol",
  "ui.currencySelector.option.pgk": "Papua New Guinean Kina",
  "ui.currencySelector.option.php": "Philippine Peso",
  "ui.currencySelector.option.pkr": "Pakistani Rupee",
  "ui.currencySelector.option.pln": "Polish Złoty",
  "ui.currencySelector.option.pyg": "Paraguayan Guaraní",
  "ui.currencySelector.option.qar": "Qatari Riyal",
  "ui.currencySelector.option.ron": "Romanian Leu",
  "ui.currencySelector.option.rsd": "Serbian Dinar",
  "ui.currencySelector.option.rub": "Russian Ruble",
  "ui.currencySelector.option.rwf": "Rwandan Franc",
  "ui.currencySelector.option.sar": "Saudi Riyal",
  "ui.currencySelector.option.sat": "Bitcoin (sat)",
  "ui.currencySelector.option.sbd": "Solomon Islands Dollar",
  "ui.currencySelector.option.scr": "Seychellois Rupee",
  "ui.currencySelector.option.sdg": "Sudanese Pound",
  "ui.currencySelector.option.sek": "Swedish Krona",
  "ui.currencySelector.option.sgd": "Singapore Dollar",
  "ui.currencySelector.option.shp": "Saint Helenian Pound",
  "ui.currencySelector.option.skk": "Slovak Koruna (legacy)",
  "ui.currencySelector.option.sll": "Sierra Leonean Leone",
  "ui.currencySelector.option.sos": "Somali Shilling",
  "ui.currencySelector.option.srd": "Surinamese Dollar",
  "ui.currencySelector.option.ssp": "South Sudanese Pound",
  "ui.currencySelector.option.std": "São Tomé & Príncipe Dobra",
  "ui.currencySelector.option.svc": "Salvadoran Colón",
  "ui.currencySelector.option.syp": "Syrian Pound",
  "ui.currencySelector.option.szl": "Swazi Lilangeni",
  "ui.currencySelector.option.thb": "Thai Baht",
  "ui.currencySelector.option.tjs": "Tajikistani Somoni",
  "ui.currencySelector.option.tmm": "Turkmenistani Manat (legacy)",
  "ui.currencySelector.option.tmt": "Turkmenistani Manat",
  "ui.currencySelector.option.tnd": "Tunisian Dinar",
  "ui.currencySelector.option.top": "Tongan Paʻanga",
  "ui.currencySelector.option.try": "Turkish Lira",
  "ui.currencySelector.option.ttd": "Trinidad and Tobago Dollar",
  "ui.currencySelector.option.twd": "New Taiwan Dollar",
  "ui.currencySelector.option.tzs": "Tanzanian Shilling",
  "ui.currencySelector.option.uah": "Ukrainian Hryvnia",
  "ui.currencySelector.option.ugx": "Ugandan Shilling",
  "ui.currencySelector.option.usd": "US Dollar",
  "ui.currencySelector.option.uyu": "Uruguayan Peso",
  "ui.currencySelector.option.uzs": "Uzbekistan Som",
  "ui.currencySelector.option.vef": "Venezuelan Bolívar",
  "ui.currencySelector.option.ves": "Venezuelan Bolívar Soberano",
  "ui.currencySelector.option.vnd": "Vietnamese Đồng",
  "ui.currencySelector.option.vuv": "Vanuatu Vatu",
  "ui.currencySelector.option.wst": "Samoan Tala",
  "ui.currencySelector.option.xaf": "Central African CFA Franc",
  "ui.currencySelector.option.xag": "Silver (Troy Ounce)",
  "ui.currencySelector.option.xau": "Gold (Troy Ounce)",
  "ui.currencySelector.option.xcd": "East Caribbean Dollar",
  "ui.currencySelector.option.xdr": "Special Drawing Rights",
  "ui.currencySelector.option.xof": "West African CFA Franc",
  "ui.currencySelector.option.xpd": "Palladium",
  "ui.currencySelector.option.xpf": "CFP Franc",
  "ui.currencySelector.option.xpt": "Platinum",
  "ui.currencySelector.option.yer": "Yemeni Rial",
  "ui.currencySelector.option.zar": "South African Rand",
  "ui.currencySelector.option.zmk": "Zambian Kwacha (legacy)",
  "ui.currencySelector.option.zmw": "Zambian Kwacha",
  "ui.currencySelector.option.zwd": "Zimbabwean Dollar",
  "ui.currencySelector.resultsCount": "{count, plural, one {# currency} other {# currencies}}",
  "ui.currencySelector.searchPlaceholder": "Search...",
  "ui.currencySelector.title": "Display currency",
  "ui.dateRangeDropdown.clearPresetRange": "Clear preset range",
  "ui.dateRangeDropdown.option.days": "{value} Days",
  "ui.dateRangeDropdown.option.oneYear": "1 Year",
  "ui.dateRangeDropdown.option.selectRange": "Select range",
  "ui.dateRangeDropdown.option.sixMonths": "6 Months",
  "ui.dateRangeDropdown.title": "Select range",
  "ui.datePicker.actions.cancel": "Cancel",
  "ui.datePicker.actions.confirm": "Confirm",
  "ui.datePicker.filterBy": "Filter by",
  "ui.datePicker.issueDate": "Issue date",
  "ui.datePicker.maturityDate": "Maturity date",
  "ui.datePicker.range.end": "End",
  "ui.datePicker.range.selectLabel": "Select date range",
  "ui.datePicker.range.start": "Start",
  "ui.datePicker.single.selectedDate": "Selected date",
  "ui.decimalSeparator.comma": "Comma",
  "ui.decimalSeparator.description": "Select your preferred decimal and thousands separator format",
  "ui.decimalSeparator.menuLabel": "Decimals",
  "ui.decimalSeparator.point": "Point",
  "ui.decimalSeparator.radioLabel": "Select decimal separator format",
  "ui.decimalSeparator.space": "Space",
  "ui.decimalSeparator.title": "Decimals",
  "ui.languagePreference.ariaLabel": "Select language preference",
  "ui.languagePreference.description": "Select your preferred language from the list",
  "ui.languagePreference.groupLabel": "Language selection area",
  "ui.languagePreference.noResults": "No languages found",
  "ui.languagePreference.resultsCount": "{count, plural, one {# language} other {# languages}}",
  "ui.languagePreference.searchPlaceholder": "Search...",
  "ui.languagePreference.title": "Language preference",
  "ui.termsAndConditions.content.summary.heading": "Summary:",
  "ui.termsAndConditions.content.summary.text":
    "Bitcredit's software lets you issue and use bills of exchange digitally. E-Bills have the same key features as handwritten bills but are faster, easier, and cryptographically secure.",
  "ui.termsAndConditions.content.termsOfUse.heading": "Terms of Use:",
  "ui.termsAndConditions.content.termsOfUse.paragraph1":
    "E-Bills reproduce the legal and practical features of handwritten bills of exchange in digital form. They include all required elements and use electronic signatures instead of handwritten ones.",
  "ui.termsAndConditions.content.termsOfUse.paragraph2":
    "The rightful holder of an E-Bill can always be verified through cryptographic proof.",
  "ui.termsAndConditions.content.termsOfUse.paragraph3":
    "By signing or transacting with an E-Bill, you agree that electronic signatures are legally binding.",
  "ui.termsAndConditions.content.termsOfUse.paragraph4":
    "Each party is responsible for reasonable due diligence to confirm the identity of their counterparty.",
  "ui.termsAndConditions.content.termsOfUse.paragraph5":
    "The United Nations Convention on International Bills of Exchange and other applicable international rules apply to all E-Bills, whether domestic or international.",
  "ui.termsAndConditions.content.termsOfUse.paragraph6":
    "Where legally possible, the parties agree to use fast-track court procedures for bill of exchange disputes to ensure quick decisions.",
  "ui.termsAndConditions.content.termsOfUse.paragraph7":
    "If a provision of bill of exchange law cannot apply directly to an E-Bill, the closest permissible alternative with the same economic effect shall apply.",
  "ui.termsAndConditions.content.termsOfUse.paragraph8":
    "If national or international laws recognize E-Bills as equivalent to handwritten bills, those laws will apply automatically.",
  "ui.termsAndConditions.content.title": "Bill of Exchange Agreement",
  "ui.termsAndConditions.page.title": "Terms and Conditions",
  "ui.termsAndConditions.review.description": "Bill of exchange agreement and terms of use for terms and conditions",
  "ui.termsAndConditions.review.terms": "Terms and Conditions",
  "ui.termsAndConditions.review.title": "Terms",
  "ui.theme.dark": "Dark",
  "ui.theme.description": "Select your preferred theme mode",
  "ui.theme.light": "Light",
  "ui.theme.menuLabel": "Theme",
  "ui.theme.system": "System",
  "ui.theme.title": "Theme",
  "ui.upload.label": "Upload document",
} as const;

export type UiTranslationKey = keyof typeof defaultUiMessages;
export type UiMessages = Partial<Record<UiTranslationKey, string>>;
export type UiT = (key: UiTranslationKey, params?: UiTranslationValues) => string | undefined;

type GetUiTextArgs = {
  key: UiTranslationKey;
  params?: UiTranslationValues;
  t?: UiT;
  messages?: UiMessages;
  intl?: IntlShape | null;
  legacyKey?: string;
  legacyParams?: UiTranslationValues;
  devMissingMarker?: boolean;
};

function formatTemplate(template: string, params?: UiTranslationValues) {
  if (!params) {
    return template;
  }

  const withPlurals = template.replace(
    /\{(\w+),\s*plural,\s*one\s*\{([^}]*)\}\s*other\s*\{([^}]*)\}\s*\}/g,
    (_, token, oneCase, otherCase) => {
      const rawValue = params[token];
      const count = typeof rawValue === "number" ? rawValue : Number(rawValue);
      const selectedCase = count === 1 ? oneCase : otherCase;
      return selectedCase.replace(/#/g, String(Number.isNaN(count) ? (rawValue ?? "") : count));
    }
  );

  return withPlurals.replace(/\{(\w+)\}/g, (_, token: string) => {
    const value = params[token];
    return value === undefined || value === null ? "" : String(value);
  });
}

function hasIntlMessage(intl: IntlShape | null | undefined, key: string) {
  if (!intl?.messages) {
    return false;
  }

  return Object.prototype.hasOwnProperty.call(intl.messages, key);
}

export function getUiText({
  key,
  params,
  t,
  messages,
  intl,
  legacyKey,
  legacyParams,
  devMissingMarker = import.meta.env.DEV,
}: GetUiTextArgs): string {
  const overrideMessage = messages?.[key];
  if (overrideMessage) {
    return formatTemplate(overrideMessage, params);
  }

  const translated = t?.(key, params);
  if (translated && translated !== key) {
    return translated;
  }

  if (hasIntlMessage(intl, key)) {
    return intl!.formatMessage({ id: key }, params);
  }

  if (legacyKey && hasIntlMessage(intl, legacyKey)) {
    return intl!.formatMessage({ id: legacyKey }, legacyParams ?? params);
  }

  const fallback = defaultUiMessages[key];
  if (fallback) {
    return formatTemplate(fallback, params);
  }

  return devMissingMarker ? `[missing translation: ${key}]` : key;
}
