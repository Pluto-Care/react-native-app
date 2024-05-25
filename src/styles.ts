const ColorStyles = {
  light: {
    text: {
      primary: 'text-zinc-950',
      secondary: 'text-zinc-700',
    },
    link: 'text-accent-600 active:text-accent-700 hover:text-accent-700',
  },
  dark: {
    text: {
      primary: 'text-zinc-100',
      secondary: 'text-zinc-300',
    },
    link: 'text-accent-400 active:text-accent-300 hover:text-accent-300',
  },
};

export const getColors = (colorScheme: 'light' | 'dark') => {
  return ColorStyles[colorScheme];
};
