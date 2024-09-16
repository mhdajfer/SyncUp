// import {nextui} from '@nextui-org/theme';
// import type { Config } from "tailwindcss";

// const config: Config = {
//     darkMode: ["class"],
//   content: [
//     "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
//     "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
//     "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
//     "./node_modules/@nextui-org/theme/dist/components/(select|listbox|divider|popover|button|ripple|spinner|scroll-shadow).js"
//   ],
//   theme: {
//   	extend: {
//   		colors: {
//   			background: 'var(--background)',
//   			foreground: 'var(--foreground)'
//   		},
//   		borderRadius: {
//   			lg: 'var(--radius)',
//   			md: 'calc(var(--radius) - 2px)',
//   			sm: 'calc(var(--radius) - 4px)'
//   		}
//   	}
//   },
//   plugins: [require(tailwindcss-animate),nextui()],
// };
// export default config;

import { nextui } from "@nextui-org/theme";
import tailwindcssAnimate from "tailwindcss-animate";

const config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/components/(select|listbox|divider|popover|button|ripple|spinner|scroll-shadow).js",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [
    tailwindcssAnimate, // Correct plugin reference
    nextui(),
  ],
};

module.exports = config;
