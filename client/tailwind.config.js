/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        primary: {
          400: 'var(--mat-sys-surface-tint)',
          500: 'var(--mat-sys-on-primary-fixed-variant)',
        },
        secondary: 'var(--mat-sys-on-secondary-fixed-variant)',
        tertiary: 'var(--mat-sys-on-tertiary)',
        background: {
          400: 'var(--color-background-400)',
          500: 'var(--color-background-500)',
          600: 'var(--color-background-600)',
        },
        error: 'var(--mat-sys-error)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
      },
    },
  },
  plugins: [],
};
