/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "grey-text": "#3D3D3D",
        "orange-text": "#D7A022",
        "red-text": "#C1272D",
        "gray-map": "#f6f6f6",
        "gray-text": "#5C5C5C",
        "gray-input": "#B6B6B6",
      },
      backgroundImage: {
        "background-image-1": "url('/public/img/couscous1.jpeg)",
        "background-image-maroc": "url('/public/img/MA-EPS-02-6001 1.webp')", // Adjust the path to your image
      },
    },
  },
  plugins: [],
};
