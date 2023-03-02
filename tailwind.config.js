const { yellow } = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./node_modules/flowbite-react/**/*.js",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./public/**/*.html",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        genshin:
          "url('https://mmoculture.com/wp-content/uploads/2019/08/Genshin-Impact-image.jpg')",
      },
      keyframes: {
        openMenu: {
          from: {
            transform: "translateX(100%)",
          },
          to: {
            transform: "translateX(0)",
          },
        },

        blinkLabel: {
          from : {
            color: "yellow",
            backgroundColor: "red"
          }, 
          to : {
            color: "red",
            backgroundColor: "yellow"
          }
        },
        growUp: {
          from: {
            height: "0"
          },
          to: {
            height: "100vh"
          }
        }
      },
      animation: {
        openMenu: "openMenu 500ms ease-in-out forwards",
        blinkLabel: "blinkLabel 1s linear alternate infinite both",
        growUp: "growUp 500ms ease-in forwards"

      },
    },
    plugins: [require("flowbite/plugin")],
  },
};
