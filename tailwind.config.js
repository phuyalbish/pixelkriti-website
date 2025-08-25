/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  corePlugins: {
    scrollBehavior: true,
  },
  theme: {
    extend: {
      colors: {
        G100: "var(--G100)", // #CCEEE9;
        G200: "var(--G200)", // #99DDD3;
        G300: "var(--G300)", // #66CBBD;
        G400: "var(--G400)", // #33BAA7;
        G500: "var(--G500)", // #00A991;
        G600: "var(--G600)", // #008774;
        G700: "var(--G700)", // #006557;
        G800: "var(--G800)", // #00443A;
        G900: "var(--G900)", // #00221D;

        B100: "var(--B100)", // #D9E8F9;
        B200: "var(--B200)", // #B3D1F3;
        B300: "var(--B300)", // #8DB9EC;
        B400: "var(--B400)", // #67A2E6;
        B500: "var(--B500)", // #418BE0;
        B600: "var(--B600)", // #346FB3;
        B700: "var(--B700)", // #275386;
        B800: "var(--B800)", // #1A385A;
        B900: "var(--B900)", // #0D1C2D;
        gmain: "var(--GMAIN)",
        glight: "var(--GLIGHT)",

        N100: "var(--N100)", // #e6e6e6;
        N200: "var(--N200)", // #b3b3b3;
        N300: "var(--N300)", // #cccccc;
        N400: "var(--N400)", // #999999;
        N500: "var(--N500)", // #7f7f7f;
        N600: "var(--N600)", // #666666;
        N700: "var(--N700)", // #4d4d4d;
        N800: "var(--N800)", // #333333;
        N900: "var(--N900)", // #1A1A1A;

        BGPRIMARY: "var(--bg-primary)", //#1E1E1E
        
        success: "var(--success)",
        danger: "var(--danger)",
      },


      fontFamily: {
        liches: "var(--font-liches)", //Staatliches
        pixel: "var(--font-pixel)", //Staatliches
        reenie: "var(--font-reenie)", //Reenie Beanie
        manrope: "var(--font-manrope)", //Manrope
        dance: "var(--font-dance)", // Dancing Script
      },

      // cursor: {
      //   custom: "url('/images/custom-cursor.svg'), auto",
      // },
      fontSize: {
        // 12px
        xs: ['var(--text-xs)', { lineHeight: 'var(--lineheight-base)' }], 
        // 14px
        sm: ['var(--text-sm)', { lineHeight: 'var(--lineheight-base)' }],
        // 16px
        base: ['var(--text-base)', { lineHeight: 'var(--lineheight-md)' }],
        // 18px
        md: ['var(--text-md)', { lineHeight: 'var(--lineheight-lg)' }],
        // 24px
        lg: ['var(--text-lg)', { lineHeight: 'var(--lineheight-xl)' }],
        // 32px
        xl: ['var(--text-xl)', { lineHeight: 'var(--lineheight-2xl)' }],
        // 40px
        "2xl": ['var(--text-2xl)', { lineHeight: 'var(--lineheight-3xl)' }],
        // 48px
        "3xl": ['var(--text-3xl)', { lineHeight: 'var(--lineheight-4xl)' }],
        // 64px
        "4xl": ['var(--text-4xl)', { lineHeight: 'var(--lineheight-5xl)' }],
        // 72px
        "5xl": ['var(--text-5xl)', { lineHeight: 'var(--lineheight-6xl)' }],
      },
    },
  },
  plugins: [],

  compilerOptions: {
    baseUrl: ".",
    paths: {
      "@/*": ["./src/*"],
    },
  },
};
