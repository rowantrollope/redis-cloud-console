import type { Config } from "tailwindcss"
import forms from "@tailwindcss/forms"

const config = {
    plugins: [require("flowbite/plugin"), forms],

    darkMode: "class",
    content: [
        "./src/**/*.{html,js,svelte,ts}",
        "./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}",
        "./node_modules/flowbite-svelte-icons/**/*.{html,js,svelte,ts}",
    ],
    theme: {
        extend: {
            colors: {
                // flowbite-svelte
                red: {
                    DEFAULT: "#FF4438",
                    50: "#FFF1F0",
                    100: "#FFDDDB",
                    200: "#FFB7B2",
                    300: "#FF918A",
                    400: "#FF6A61",
                    500: "#FF4438",
                    600: "#FF0F00",
                    700: "#C70C00",
                    800: "#8F0900",
                    900: "#570500",
                },
                primary: {
                    DEFAULT: "#FF4438",
                    50: "#FFF1F0",
                    100: "#FFDDDB",
                    200: "#FFB7B2",
                    300: "#FF918A",
                    400: "#FF6A61",
                    500: "#FF4438",
                    600: "#FF0F00",
                    700: "#C70C00",
                    800: "#8F0900",
                    900: "#570500",
                },
                slate: {
                    DEFAULT: "#163341",
                    50: "#3b85ab",
                    100: "#347798",
                    200: "#2e6885",
                    300: "#275972",
                    400: "#214a5f",
                    500: "#1a3b4c",
                    600: "#163341",
                    700: "#142c39",
                    800: "#0d1e26",
                    900: "#070f13",
                    950: "#000000",
                },
                lime: {
                    DEFAULT: "#D6FF18",
                    50: "#F7FFD0",
                    100: "#F3FFBB",
                    200: "#ECFF92",
                    300: "#E4FF6A",
                    400: "#DDFF41",
                    500: "#D6FF18",
                    600: "#B7DF00",
                    700: "#89A700",
                    800: "#5B6F00",
                    900: "#2D3700",
                    950: "#161B00",
                },
                alternative: {
                    DEFAULT: "#DCE11C",
                    50: "#FBFBE2",
                    100: "#F8F9D0",
                    200: "#F3F5AC",
                    300: "#EDF087",
                    400: "#E8EC63",
                    500: "#E3E73F",
                    600: "#DCE11C",
                    700: "#ABAF16",
                    800: "#7A7D10",
                    900: "#4A4B09",
                    950: "#313206",
                },
            },
        },
    },
} satisfies Config

export default config
