import tinycolor from 'tinycolor2';

type BaseColor = {
  bg: string;
  fg: string;
  primary: string;
};

const generateLightPalette = ({ bg, fg, primary }: BaseColor) => {
  return {
    'base-100': bg, // Main background
    'base-200': tinycolor(bg).darken(5).toHexString(), // Slightly darker
    'base-300': tinycolor(bg).darken(15).toHexString(), // More darker
    'base-content': fg, // Main text color
    neutral: tinycolor(bg).darken(15).desaturate(20).toHexString(), // Muted neutral
    'neutral-content': tinycolor(fg).lighten(20).desaturate(20).toHexString(), // Slightly lighter text
    primary: primary,
    secondary: tinycolor(primary).lighten(20).toHexString(), // Lighter secondary
    accent: tinycolor(primary).analogous()[1]!.toHexString(), // Analogous accent
  };
};

const generateDarkPalette = ({ bg, fg, primary }: BaseColor) => {
  return {
    'base-100': bg, // Main background
    'base-200': tinycolor(bg).lighten(5).toHexString(), // Slightly lighter
    'base-300': tinycolor(bg).lighten(15).toHexString(), // More lighter
    'base-content': fg, // Main text color
    neutral: tinycolor(bg).lighten(15).desaturate(20).toHexString(), // Muted neutral
    'neutral-content': tinycolor(fg).darken(20).desaturate(20).toHexString(), // Darkened text
    primary: primary,
    secondary: tinycolor(primary).darken(20).toHexString(), // Darker secondary
    accent: tinycolor(primary).triad()[1]!.toHexString(), // Triad accent
  };
};

export const themes = [
  {
    name: 'default',
    label: 'Default',
    colors: {
      light: generateLightPalette({ fg: '#171717', bg: '#ffffff', primary: '#0066cc' }),
      dark: generateDarkPalette({ fg: '#e0e0e0', bg: '#222222', primary: '#77bbee' }),
    },
  },
  {
    name: 'gray',
    label: 'Gray',
    colors: {
      light: generateLightPalette({ fg: '#222222', bg: '#e0e0e0', primary: '#4488cc' }),
      dark: generateDarkPalette({ fg: '#c6c6c6', bg: '#444444', primary: '#88ccee' }),
    },
  },
  {
    name: 'sepia',
    label: 'Sepia',
    colors: {
      light: generateLightPalette({ fg: '#5b4636', bg: '#f1e8d0', primary: '#008b8b' }),
      dark: generateDarkPalette({ fg: '#ffd595', bg: '#342e25', primary: '#48d1cc' }),
    },
  },
  {
    name: 'grass',
    label: 'Grass',
    colors: {
      light: generateLightPalette({ fg: '#232c16', bg: '#d7dbbd', primary: '#177b4d' }),
      dark: generateDarkPalette({ fg: '#d8deba', bg: '#333627', primary: '#a6d608' }),
    },
  },
  {
    name: 'cherry',
    label: 'Cherry',
    colors: {
      light: generateLightPalette({ fg: '#4e1609', bg: '#f0d1d5', primary: '#de3838' }),
      dark: generateDarkPalette({ fg: '#e5c4c8', bg: '#462f32', primary: '#ff646e' }),
    },
  },
  {
    name: 'sky',
    label: 'Sky',
    colors: {
      light: generateLightPalette({ fg: '#262d48', bg: '#cedef5', primary: '#2d53e5' }),
      dark: generateDarkPalette({ fg: '#babee1', bg: '#282e47', primary: '#ff646e' }),
    },
  },
  {
    name: 'solarized',
    label: 'Solarized',
    colors: {
      light: generateLightPalette({ fg: '#586e75', bg: '#fdf6e3', primary: '#268bd2' }),
      dark: generateDarkPalette({ fg: '#93a1a1', bg: '#002b36', primary: '#268bd2' }),
    },
  },
  {
    name: 'gruvbox',
    label: 'Gruvbox',
    colors: {
      light: generateLightPalette({ fg: '#3c3836', bg: '#fbf1c7', primary: '#076678' }),
      dark: generateDarkPalette({ fg: '#ebdbb2', bg: '#282828', primary: '#83a598' }),
    },
  },
  {
    name: 'nord',
    label: 'Nord',
    colors: {
      light: generateLightPalette({ fg: '#2e3440', bg: '#eceff4', primary: '#5e81ac' }),
      dark: generateDarkPalette({ fg: '#d8dee9', bg: '#2e3440', primary: '#88c0d0' }),
    },
  },
];