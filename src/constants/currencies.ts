/**
 * All fiat (and commodity) currencies supported by the Coinbase /v2/currencies API.
 * The array is the single source of truth — the union type FiatCurrencyCode is
 * derived from it so the two can never diverge.
 *
 * Codes are lowercase to match the internal convention used throughout the app.
 */

// ─── Americas ───────────────────────────────────────────────────────────────
const AMERICAS = [
  "ars", // Argentine Peso
  "arsmep", // Argentine Blue Dollar
  "awg", // Aruban Florin
  "bbd", // Barbadian Dollar
  "bmd", // Bermudian Dollar
  "bob", // Bolivian Boliviano
  "brl", // Real
  "bsd", // Bahamian Dollar
  "bzd", // Belize Dollar
  "cad", // Canadian Dollar
  "clp", // Chilean Peso
  "clf", // Unidad de Fomento
  "cop", // Colombian Peso
  "crc", // Costa Rican Colón
  "cuc", // Cuban Convertible Peso
  "cup", // Cuban Peso
  "dop", // Dominican Peso
  "gtq", // Guatemalan Quetzal
  "gyd", // Guyanese Dollar
  "hnl", // Honduran Lempira
  "htg", // Haitian Gourde
  "jmd", // Jamaican Dollar
  "kyd", // Cayman Islands Dollar
  "mxn", // Mexican Peso
  "nio", // Nicaraguan Córdoba
  "pab", // Panamanian Balboa
  "pen", // Peruvian Sol
  "pyg", // Paraguayan Guaraní
  "srd", // Surinamese Dollar
  "svc", // Salvadoran Colón
  "ttd", // Trinidad and Tobago Dollar
  "usd", // United States Dollar
  "uyu", // Uruguayan Peso
  "vef", // Venezuelan Bolívar
  "ves", // Venezuelan Bolívar Soberano
  "xcd", // East Caribbean Dollar
] as const;

// ─── Europe ──────────────────────────────────────────────────────────────────
const EUROPE = [
  "all", // Albanian Lek
  "azn", // Azerbaijani Manat
  "bam", // Bosnia and Herzegovina Convertible Mark
  "bgn", // Bulgarian Lev
  "byn", // Belarusian Ruble
  "byr", // Belarusian Ruble (legacy)
  "chf", // Swiss Franc
  "czk", // Czech Koruna
  "dkk", // Danish Krone
  "eur", // Euro
  "gbp", // British Pound
  "gel", // Georgian Lari
  "ggp", // Guernsey Pound
  "hrk", // Croatian Kuna
  "huf", // Hungarian Forint
  "isk", // Icelandic Króna
  "imp", // Isle of Man Pound
  "jep", // Jersey Pound
  "ltl", // Lithuanian Litas (legacy)
  "lvl", // Latvian Lats (legacy)
  "mdl", // Moldovan Leu
  "mkd", // Macedonian Denar
  "nok", // Norwegian Krone
  "pln", // Polish Złoty
  "ron", // Romanian Leu
  "rsd", // Serbian Dinar
  "rub", // Russian Ruble
  "sek", // Swedish Krona
  "shp", // Saint Helenian Pound
  "skk", // Slovak Koruna (legacy)
  "try", // Turkish Lira
  "uah", // Ukrainian Hryvnia
] as const;

// ─── Middle East & North Africa ──────────────────────────────────────────────
const MENA = [
  "aed", // United Arab Emirates Dirham
  "bhd", // Bahraini Dinar
  "dzd", // Algerian Dinar
  "egp", // Egyptian Pound
  "iqd", // Iraqi Dinar
  "irr", // Iranian Rial
  "jod", // Jordanian Dinar
  "kwd", // Kuwaiti Dinar
  "lbp", // Lebanese Pound
  "lyd", // Libyan Dinar
  "mad", // Moroccan Dirham
  "omr", // Omani Rial
  "qar", // Qatari Riyal
  "sar", // Saudi Riyal
  "sdg", // Sudanese Pound
  "syp", // Syrian Pound
  "tnd", // Tunisian Dinar
  "yer", // Yemeni Rial
] as const;

// ─── Africa ──────────────────────────────────────────────────────────────────
const AFRICA = [
  "aoa", // Angolan Kwanza
  "bif", // Burundian Franc
  "bwp", // Botswana Pula
  "cdf", // Congolese Franc
  "cve", // Cape Verdean Escudo
  "djf", // Djiboutian Franc
  "etb", // Ethiopian Birr
  "ghs", // Ghanaian Cedi
  "gmd", // Gambian Dalasi
  "gnf", // Guinean Franc
  "kes", // Kenyan Shilling
  "kmf", // Comorian Franc
  "lrd", // Liberian Dollar
  "lsl", // Lesotho Loti
  "mga", // Malagasy Ariary
  "mro", // Mauritanian Ouguiya (legacy)
  "mru", // Mauritanian Ouguiya
  "mur", // Mauritian Rupee
  "mwk", // Malawian Kwacha
  "mzn", // Mozambican Metical
  "nad", // Namibian Dollar
  "ngn", // Nigerian Naira
  "rwf", // Rwandan Franc
  "sbd", // Solomon Islands Dollar
  "scr", // Seychellois Rupee
  "sll", // Sierra Leonean Leone
  "sos", // Somali Shilling
  "ssp", // South Sudanese Pound
  "std", // São Tomé and Príncipe Dobra
  "szl", // Swazi Lilangeni
  "tzs", // Tanzanian Shilling
  "ugx", // Ugandan Shilling
  "xaf", // Central African CFA Franc
  "xof", // West African CFA Franc
  "zar", // South African Rand
  "zmk", // Zambian Kwacha (legacy)
  "zmw", // Zambian Kwacha
  "zwd", // Zimbabwean Dollar
] as const;

// ─── Asia & Pacific ──────────────────────────────────────────────────────────
const ASIA_PACIFIC = [
  "afn", // Afghan Afghani
  "amd", // Armenian Dram
  "ang", // Netherlands Antillean Gulden
  "aud", // Australian Dollar
  "bdt", // Bangladeshi Taka
  "bnd", // Brunei Dollar
  "btn", // Bhutanese Ngultrum
  "cnh", // Chinese Renminbi Yuan Offshore
  "cny", // Chinese Renminbi Yuan
  "fjd", // Fijian Dollar
  "fkp", // Falkland Pound
  "hkd", // Hong Kong Dollar
  "idr", // Indonesian Rupiah
  "ils", // Israeli New Sheqel
  "inr", // Indian Rupee
  "jpy", // Japanese Yen
  "kgs", // Kyrgyzstani Som
  "khr", // Cambodian Riel
  "krw", // South Korean Won
  "kzt", // Kazakhstani Tenge
  "lak", // Lao Kip
  "lkr", // Sri Lankan Rupee
  "mmk", // Myanmar Kyat
  "mnt", // Mongolian Tögrög
  "mop", // Macanese Pataca
  "mvr", // Maldivian Rufiyaa
  "myr", // Malaysian Ringgit
  "npr", // Nepalese Rupee
  "nzd", // New Zealand Dollar
  "pgk", // Papua New Guinean Kina
  "php", // Philippine Peso
  "pkr", // Pakistani Rupee
  "sgd", // Singapore Dollar
  "thb", // Thai Baht
  "tjs", // Tajikistani Somoni
  "tmm", // Turkmenistani Manat (legacy)
  "tmt", // Turkmenistani Manat
  "twd", // New Taiwan Dollar
  "uzs", // Uzbekistan Som
  "vnd", // Vietnamese Đồng
  "vuv", // Vanuatu Vatu
  "wst", // Samoan Tala
  "xpf", // CFP Franc
] as const;

// ─── Commodities & Special Drawing Rights ────────────────────────────────────
const COMMODITIES = [
  "xag", // Silver (Troy Ounce)
  "xau", // Gold (Troy Ounce)
  "xdr", // Special Drawing Rights
  "xpd", // Palladium
  "xpt", // Platinum
] as const;

// ─── Derived union & runtime set ─────────────────────────────────────────────

// Merge all groups into one flat tuple.
export const FIAT_CURRENCY_CODES = [
  ...AMERICAS,
  ...EUROPE,
  ...MENA,
  ...AFRICA,
  ...ASIA_PACIFIC,
  ...COMMODITIES,
] as const;

/** Union type of every supported fiat currency code (derived — never edit manually). */
export type FiatCurrencyCode = (typeof FIAT_CURRENCY_CODES)[number];

/** Runtime set for O(1) membership checks. */
export const FIAT_CURRENCY_CODES_SET = new Set<FiatCurrencyCode>(FIAT_CURRENCY_CODES);
