/** @type {import('tailwindcss').Config} */
module.exports = {
  // Tailwind がクラスを探すディレクトリを指定
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      // カスタムカラーやフォントを追加したい場合はここに書きます
      colors: { primary: '#ffffff' },
      // fontFamily: { sans: ['"Noto Sans JP"', 'system-ui'] },
    },
  },
  plugins: [],
}