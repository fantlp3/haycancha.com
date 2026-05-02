import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: { "2xl": "1200px" },
    },
    extend: {
      maxWidth: {
        container: "1200px",
      },
      fontFamily: {
        display: ["Barlow Condensed", "Arial Narrow", "Arial", "sans-serif"],
        body: ["Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        // Brand
        orange: "hsl(var(--orange))",
        yellow: "hsl(var(--yellow))",
        celeste: "hsl(var(--celeste))",
        dark: {
          DEFAULT: "hsl(var(--dark))",
          2: "hsl(var(--dark-2))",
        },
        gray: "hsl(var(--gray))",
        light: "hsl(var(--light))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sport: {
          "tenis-bg": "hsl(var(--tenis-bg))",
          "tenis-fg": "hsl(var(--tenis-fg))",
          "padel-bg": "hsl(var(--padel-bg))",
          "padel-fg": "hsl(var(--padel-fg))",
          "pickle-bg": "hsl(var(--pickle-bg))",
          "pickle-fg": "hsl(var(--pickle-fg))",
          "gratis-bg": "hsl(var(--gratis-bg))",
          "gratis-fg": "hsl(var(--gratis-fg))",
        },
      },
      boxShadow: {
        card: "var(--shadow-card)",
        "card-hover": "var(--shadow-card-hover)",
        "focus-orange": "var(--shadow-focus-orange)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
