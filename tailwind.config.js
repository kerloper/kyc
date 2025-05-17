/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                danger: "#edd37e",
                success: "#00A86E",
                warning: "#FEBD00",

            },
        },
    },
    plugins: [require("daisyui")],

    daisyui: {
        themes: [
            {
                light: {
                    ...require("daisyui/theme")["light"],
                    primary: "#009ca7",
                    secondary: "#00d5d3",
                    "base-100": "#F4F4F4",
                    "base-200": "#dcdcdc",
                    "base-300": "#ffffff",

                },
            },
            {
                dim: {
                    ...require("daisyui/theme")["dim"],
                    primary: "#009ca7",
                    secondary: "#00a1a0",
                    "base-200": "#242b34",

                },
            },

        ]
    },
}

