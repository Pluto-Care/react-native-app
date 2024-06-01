import twColors from 'tailwindcss/colors';

const green = twColors.lime;
const yellow = twColors.amber;
const gray = twColors.slate;

export type ThemeColors = {
  fg: Record<
    'accent' | 'attention' | 'default' | 'muted' | 'onEmphasis' | 'subtle',
    string
  >;
  bg: Record<
    | 'accent'
    | 'accentEmphasis'
    | 'attention'
    | 'attentionEmphasis'
    | 'default'
    | 'emphasis'
    | 'inset'
    | 'subtle',
    string
  >;
  border: Record<
    | 'accent'
    | 'accentEmphasis'
    | 'attention'
    | 'attentionEmphasis'
    | 'default'
    | 'muted',
    string
  >;
};

const darkTheme: ThemeColors = {
  fg: {
    accent: green[400],
    attention: yellow[400],
    default: gray[50],
    muted: gray[300],
    onEmphasis: gray[950],
    subtle: gray[500],
  },
  bg: {
    accent: green[900],
    accentEmphasis: green[300],
    attention: yellow[900],
    attentionEmphasis: yellow[300],
    default: 'black',
    emphasis: gray[50],
    inset: gray[950],
    subtle: gray[900],
  },
  border: {
    accent: green[600],
    accentEmphasis: green[400],
    attention: yellow[600],
    attentionEmphasis: yellow[400],
    default: gray[600],
    muted: gray[800],
  },
};

const lightTheme: ThemeColors = {
  fg: {
    accent: green[600],
    attention: yellow[600],
    default: gray[900],
    muted: gray[700],
    onEmphasis: gray[50],
    subtle: gray[500],
  },
  bg: {
    accent: green[100],
    accentEmphasis: green[500],
    attention: yellow[100],
    attentionEmphasis: yellow[500],
    default: gray[50],
    emphasis: gray[950],
    inset: 'white',
    subtle: gray[200],
  },
  border: {
    accent: green[300],
    accentEmphasis: green[500],
    attention: yellow[300],
    attentionEmphasis: yellow[500],
    default: gray[400],
    muted: gray[200],
  },
};

export const getThemeColors = (scheme: 'light' | 'dark'): ThemeColors => {
  return {
    ...(scheme === 'light' ? lightTheme : darkTheme),
  };
};
