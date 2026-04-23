import type { Meta, StoryObj } from "@storybook/react-vite";
import { IntlProvider } from "react-intl";

import { TruncatedTextPopover } from "./TruncatedTextPopover";

const messages = {
  "action.copyToClipboard.ariaLabel": "Copy to clipboard",
  "action.copyToClipboard.title": "Success!",
  "action.copyToClipboard.description": "Copied to clipboard!",
};

const meta = {
  title: "Components/TruncatedTextPopover",
  component: TruncatedTextPopover,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <IntlProvider locale="en-US" messages={messages}>
        <Story />
      </IntlProvider>
    ),
  ],
  args: {
    text: "This is a deliberately long sentence that should truncate and reveal the full value in a popover.",
    maxLength: 24,
    showCopyButton: true,
  },
} satisfies Meta<typeof TruncatedTextPopover>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="w-[180px]">
      <TruncatedTextPopover {...args} />
    </div>
  ),
};

export const ButtonTrigger: Story = {
  args: {
    as: "button",
    text: "bitcr1qxy2kgdygjrsqtzq2n9yrf243p83kkfjhxwlhc5m7v8n6ds4e",
    maxLength: 18,
  },
  render: (args) => (
    <div className="w-[180px]">
      <TruncatedTextPopover {...args} />
    </div>
  ),
};

export const WithCopyButton: Story = {
  args: {
    showCopyButton: true,
    text: "bitcr1qxy2kgdygjrsqtzq2n9yrf243p83kkfjhxwlhc5m7v8n6ds4e",
    maxLength: 18,
  },
  render: (args) => (
    <div className="w-[180px]">
      <TruncatedTextPopover {...args} />
    </div>
  ),
};

export const LongUnbrokenString: Story = {
  args: {
    text: "bitcrBpGFteC9odHRwczovL21pbnQud2lsZGNhdDAuY2xvd2Rlci1kZXYubWluaWJpbGwudGVjaGF1Y3NhdGFkeDJiaXRjcnRKMW5vWnVjSkQ2U3UxV3dxakhEYUU2NlBLR2kzemF1QnhTRFNQb1lzZWtlZmF0gaJhaUgBb7DTj_OB0mFwiqRhYQFhc3hAMzRkMDE1ZDk4MGQxZmYxZmZhMGMzZTkzYjU5MDQwMmU3NDUwM2U1ZmZjOTdhMzNjNGJiMzkxMWVkZTVkMDRkM2FjWCECyD0phsRRdQJReR9uuy9YtF5MaeIQiSkHz208yYKVJUBhZKNhZVgg2X1KoUvEM2nEYCYHThzDaHK6Jh4WAtoVtYwT-tpDdfxhc1ggTk2UNqdSmn1hcRLvExYHN3bRtx4OeRaeazKEaBGd015hclggQfYrz2Nrd-RxJeNsg-1_bEUevzMd2mg_vWfThd5N4hSkYWECYXN4QDFiNjU4NzNjYmEyNGEwMjY1MWY1NzAzM2U4NjI3NjVlZDI2OTBhMjExNTM4MTU5NGY2ZDQ5MWE2MDNkZjNiNWNhY1ghAyRl9bUdfw45bTrWSUQVWZZASKBrY9HX2YX2azWlNqZdYWSjYWVYIC0LFC9ERVK2Tdas4xpbrxHY-KDg1PdcY82_ZJyE87UEYXNYIAnSbXFng1I5th16b2RBEHhPl6ofThGBhCk2xG2wkCO5YXJYIMkJYZz3tiE911QgvKhBJpIpGbSOBozC3BZfLz32trB2pGFhBGFzeEA3NjNhMjcxY2M1YzZkOWEwMDc2MTBhNzBlOTI1OTdiNmRlMjgxODQwOTlmMWExYTcyOTYyYTQ1MThjMjYwMjY2YWNYIQJmPkqvHtk52d4EXn2VzwIRNwpi6_pXAzqMqwjIiZib4WFko2FlWCCnmqMS7zB45FgrH_sWymltWO39pIxcs9AXbM1cDlreVGFzWCDzT7pNZcIqp8ZzRjwnJ3dcNjA90ksnc2UY350MkT7a5mFyWCC3IviTTzaQ_Z_rgd2jGTychtnQCmkJRZMA1Od3uUIYMaRhYRBhc3hANzI0ZTk1NGY3YTAzY2E3ZDM5ZTdlOGRhZGY3MThmYTEwMTIyNTFhZWU4ZmNiMGY1Nzk2MDczZDNlNDRjMDQ0Y2FjWCECfXjjy1kGA0_z9pXf9NfwxVWnL6eEiAT2QWP-H5GrUx9hZKNhZVggiWIGl_SKzf3ER0VeQm7na1Du-WHcD2WjHUrAd8EduSNhc1ggXKAz3acekn2IlMk4CbnjlO0qk1do2vJfs_2ADitztmJhclgg8m9HOc0EyjYPuv-vyUf90Ec5tXEX9qxZQmBegNia_xikYWEYIGFzeEAwMzUzNzAyY2MwNTdjM2FhMjc5MWYwY2ExM2FiNDQwYmMzODNhMTk5NTQzM2RhZWE3M2ZhZDJhYzlkMjAwODI4YWNYIQLnBQu47P37cV4l17jWSy7BklAsIoeg2eBs3_M09fmgemFko2FlWCDKoV3zr9F2g5F_PD1N57m7dNSFZbJdNDGsF-v6hF2J22FzWCCqg_nEIeDBmf1uTv6gKARAa4HLrI4wnCAhA5EeF8v5PWFyWCCIwHS-WHdC3n2iNQ4uNH66AfwWoJUgmUEGrGRkU0ulAqRhYRhAYXN4QDExMDVlY2IzM2I0ZDhjNTQyNTg3NDU5YmIyZTdkNmIxYjliNzc0ZDRhNWYyOGQzYTNjOGU0ZmUxOWQ0YzcyMWJhY1ghA-mYKGhYjV3WAxMBg7dufCOfoSVQjdUnczs5NR2D3fRFYWSjYWVYIAFl23UNuxqEpjtYpdtSBhK1vCJ1hghyDQ5pq18Swl_NYXNYIK9gpwvmuWlVVC87ax1z-B94Kn_wx8-aulXJlNpI8gwFYXJYIEhKsq_lVvbaOSoFSfCHefVH4nRGDQIlwD3RfFbUb3DrpGFhGQIAYXN4QDY0ZmIzZGQyYmQ1OWQ5Mzg5OTg2ZjAxOWNiZmJhZjMxZGNmOTdhNjExNzZhNTk4YzZlOTMyMWRjOTIzZDNiYWJhY1ghAw_HOaxlBNIoUTV4q_Eb7N-OqyUcLuujFnBAfUzCHNRpYWSjYWVYIOeYDY7gN5yhC569s9hqNGfvdT8VTeLjp4QfOZqp76WAYXNYIFXi_0j6chQklW3aONWlWsz_Zw2W0cPHvgLjGIZ0ZEDfYXJYIPRJNtAlufB80P_z9T_vrle0Rxuv9pZj9cAYe8wfohtJpGFhGQgAYXN4QDc5NGJjNzkwZDY1Nzg3YjhjNjYwZTcxY2RkYzQ2MDk3ZDE5MTIxMmMyM2JiYWUyZDc2ODBjN2ZjMjgwYzA4ZjRhY1ghAnR-0jHFmI8Ly61TTOZxGqq_Yk4B_BmlyYexDLv1PKnYYWSjYWVYIHmAO8UNM52ysTJi3nCaWCZwP_F5RSrL7eZmLbIOY_PsYXNYIIzolGVVFGIZvm7Y51c9HehgUlak2FQJh5l5aMPCmENmYXJYILHn0tATvZY-O6kUh-gQy4iL8eMGY7mozw8VTZIx17MSpGFhGRAAYXN4QDRhZTVlMTNkNTFmOThjYzE1OGUxZjVlNDNmNTQ0NmUwNmRkMTEyOGZiZmNhMjE5ZTdjZTYxYmE0MDhlYjg3NDNhY1ghAtPdN1Ms73atxzmo74iT1qJBtv9prmpuXSOkdI8a7W6XYWSjYWVYIA4qUbPwgBrMmqhvS4ANqWOfRNJnktcJUoawDjdmMI7cYXNYIJjQWcS0KAg8AbKRjLtbykem_lpSmDOXA06CzYl1-as5YXJYIGt319fXt8Z0fVN3WmooAYVAVtyX1oeQ1gi5Pi085EhEpGFhGSAAYXN4QDFkZGFlMmIwYTk4ZGY1YWJhODY3Njc3ZmY3MGE0ODIwMGMzYWE1MjNhYWI1OTE5ZjBkMjg4NjVkOWUyNjY2M2NhY1ghA9hppjwfBqIBixHgDaLxiKhS3-N4gR1HSv5blTvHuvaHYWSjYWVYIFB_Y8mry5uVbqr12NvA6WPXCaeaTPzzNJjDec7-RzJWYXNYIHYKEpm1odSxggP-DyeFjABBWGwhiFBBHxqGQpnz0RKJYXJYIOn5aY2yTXswPhatGNMR_1dB8B80zp1y862lF9Y93_YW",
    maxLength: 34,
  },
  render: (args) => (
    <div className="w-[360px]">
      <TruncatedTextPopover {...args} />
    </div>
  ),
};
