const ColorStyles = {
  light: {
    bg: {
      body: 'bg-white',
      input: 'bg-white',
      muted: 'bg-zinc-50',
      accent: 'bg-accent-500',
      danger: 'bg-red-500',
    },
    text: {
      foreground: 'text-zinc-950',
      muted: 'text-zinc-600',
      danger: 'text-red-700',
      accent: 'text-accent-600',
    },
    border: {
      gray: 'border-zinc-300',
      accent: 'border-accent-400',
    },
    link: {
      accent: 'text-accent-600 active:text-accent-700 hover:text-accent-700',
    },
    button: {
      foreground: 'text-white bg-zinc-900 active:bg-zinc-800 hover:bg-zinc-800',
      danger: 'text-white bg-red-600 active:bg-red-500 hover:bg-red-500',
      opaque: 'bg-transparent active:bg-black/5 hover:bg-black/5',
    },
  },
  dark: {
    bg: {
      body: 'bg-zinc-900',
      input: 'bg-zinc-900',
      muted: 'bg-zinc-950',
      accent: 'bg-accent-700',
      danger: 'bg-red-700',
    },
    text: {
      foreground: 'text-zinc-100',
      muted: 'text-zinc-400',
      danger: 'text-red-300',
      accent: 'text-accent-400',
    },
    border: {
      gray: 'border-zinc-700',
      accent: 'border-accent-700',
    },
    link: {
      accent: 'text-accent-400 active:text-accent-300 hover:text-accent-300',
    },
    button: {
      foreground: 'text-white bg-zinc-800 active:bg-zinc-700 hover:bg-zinc-700',
      danger: 'text-white bg-red-500 active:bg-red-400 hover:bg-red-400',
      opaque: 'bg-transparent active:bg-white/5 hover:bg-white/5',
    },
  },
};

export const getColors = (colorScheme: 'light' | 'dark') => {
  return ColorStyles[colorScheme];
};
