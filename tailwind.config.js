/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Cormorant Garamond"', "Georgia", "serif"],
        editorial: ['"Fraunces"', "Georgia", "serif"],
        sans: ['"Manrope"', "system-ui", "sans-serif"]
      },
      colors: {
        night: {
          950: "#08111a",
          900: "#09111c",
          850: "#0f1728",
          800: "#111b2a",
          700: "#172235"
        },
        steady: {
          blue: "#8eb5ff",
          indigo: "#6988cf",
          cream: "#f3efe7",
          ink: "#192330"
        }
      },
      boxShadow: {
        glow: "0 24px 60px rgba(0, 0, 0, 0.32)",
        soft: "0 24px 60px rgba(30, 35, 45, 0.12)"
      },
      borderRadius: {
        shell: "32px",
        panel: "24px",
        soft: "18px"
      },
      backgroundImage: {
        "steady-dark":
          "radial-gradient(circle at top center, rgba(105, 141, 215, 0.16), transparent 26%), linear-gradient(180deg, #141b29 0%, #09111c 24%, #08111a 100%)",
        "steady-light":
          "radial-gradient(circle at top center, rgba(95, 134, 220, 0.16), transparent 26%), linear-gradient(180deg, #f6f1e9 0%, #f3efe7 24%, #f1ede5 100%)"
      }
    }
  },
  plugins: []
};
