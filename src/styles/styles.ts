const ColorStyles = {
  light: {
    bg: {
      body: 'bg-white',
      input: 'bg-white',
    },
    text: {
      foreground: 'text-zinc-950',
      muted: 'text-zinc-700',
      danger: 'text-red-700',
    },
    border: {
      gray: 'border-zinc-300',
      accent: 'border-accent-400',
    },
    link: {
      accent: 'text-accent-600 active:text-accent-700 hover:text-accent-700',
    },
  },
  dark: {
    bg: {
      body: 'bg-zinc-900',
      input: 'bg-zinc-900',
    },
    text: {
      foreground: 'text-zinc-100',
      muted: 'text-zinc-300',
      danger: 'text-red-300',
    },
    border: {
      gray: 'border-zinc-700',
      accent: 'border-accent-700',
    },
    link: {
      accent: 'text-accent-400 active:text-accent-300 hover:text-accent-300',
    },
  },
};

export const getColors = (colorScheme: 'light' | 'dark') => {
  return ColorStyles[colorScheme];
};
