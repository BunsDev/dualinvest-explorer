import { createTheme, Theme, styled, ThemeProvider as MuiThemeProvider } from '@material-ui/core'

interface Gradient {
  gradient1: string
}

interface Height {
  header: string
  mobileHeader: string
}

interface TextColor {
  text1: string
  text2: string
  text3: string
  text4: string
  text5: string
  primary: string
}

interface BgColor {
  bg1: string
  bg2: string
  bg3: string
  bg4: string
  bg5: string
}

declare module '@material-ui/core/styles/createTheme' {
  interface ThemeOptions {
    textColor: TextColor
    bgColor: BgColor
    gradient: Gradient
    height: Height
  }
  interface Theme {
    textColor: TextColor
    bgColor: BgColor
    gradient: Gradient
    height: Height
  }
}

export const theme = {
  palette: {
    primary: {
      light: '#2E2247',
      main: '#9867FF',
      dark: '#7433FF',
      contrastText: '#FFFFFF'
    },
    secondary: {
      light: '#1D152D',
      main: '#211735',
      dark: '#3E276B',
      contrastText: '#9867FF'
    },
    error: {
      main: '#F53030'
    },
    warning: {
      main: '#9867FF'
    },
    info: {
      main: '#9867FF'
    },
    success: {
      main: '#2DAB50'
    },
    background: {
      default: '#131315',
      paper: '#191919'
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#333333',
      disabled: '#999999'
    },
    action: {
      disabledOpacity: 0.8
    },
    grey: {
      A700: '#191919',
      A400: '#252525',
      A200: '#303030',
      A100: '#A1A1A1'
    }
  },
  textColor: {
    text1: '#FFFFFF',
    text2: '#CCCCCC',
    text3: '#999999',
    text4: '#727272',
    text5: '#333333',
    primary: '#9867FF'
  },
  bgColor: {
    bg1: '#000000',
    bg2: '#191919',
    bg3: '#252525',
    bg4: '#303030',
    bg5: '#A1A1A1'
  },
  gradient: {
    gradient1: 'linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0) 100%), #000000'
  },
  height: {
    header: '88px',
    mobileHeader: '77px'
  },
  shape: {
    borderRadius: 10
  }

  // gray: {
  //   main: '#333333',
  //   dark: '#262626',
  // },
}

export const override = {
  MuiButton: {
    root: {
      color: theme.palette.primary.contrastText,
      fontWeight: 500,
      borderRadius: theme.shape.borderRadius,
      transition: '.3s',
      textTransform: 'none' as const
    },
    contained: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      boxShadow: 'unset',
      '&:hover, :active': {
        boxShadow: 'unset',
        backgroundColor: theme.palette.primary.dark
      },
      '&:disabled': {
        backgroundColor: theme.palette.primary.light,
        color: '#464647'
      }
    },
    containedSecondary: {
      backgroundColor: theme.palette.secondary.main,
      color: theme.palette.secondary.contrastText,
      boxShadow: 'unset',
      '&:hover, :active': {
        boxShadow: 'unset',
        backgroundColor: theme.palette.secondary.dark
      },
      '&:disabled': {
        backgroundColor: theme.palette.secondary.light,
        color: '#412E6A'
      }
    },
    outlined: {
      borderColor: theme.palette.primary.contrastText,
      color: theme.palette.primary.contrastText,
      '&:hover, :active': {
        backgroundColor: 'transparent',
        borderColor: theme.palette.primary.main,
        color: theme.palette.primary.main
      }
    },
    outlinedPrimary: {
      backgroundColor: 'transparent',
      borderColor: theme.palette.primary.main,
      color: theme.palette.primary.main,
      '&:hover, :active': {
        backgroundColor: 'transparent',
        borderColor: theme.palette.primary.dark,
        color: theme.palette.primary.dark
      }
    },
    text: {
      backgroundColor: 'transparent',
      color: theme.palette.primary.contrastText,
      '&:hover, :active': {
        backgroundColor: 'transparent',
        color: theme.palette.primary.main
      }
    },
    textPrimary: {
      color: theme.palette.primary.main,
      backgroundColor: 'transparent',
      '&:hover, :active': {
        backgroundColor: 'transparent',
        color: theme.palette.primary.dark
      }
    },
    textSecondary: {
      color: theme.palette.secondary.main,
      backgroundColor: 'transparent',
      '&:hover, :active': {
        backgroundColor: 'transparent',
        color: theme.palette.secondary.dark
      }
    }
  },
  MuiTypography: {
    root: {
      fontFamily: 'Roboto'
    },
    inherit: {
      inherit: 16
    },
    body1: {
      fontSize: 14
    },
    body2: {
      fontSize: 12
    },
    h5: {
      fontFamily: 'Futura PT',
      fontSize: 28
    },
    h6: {
      fontFamily: 'Futura PT',
      fontSize: 22
    },
    caption: {
      fontSize: 12,
      color: theme.textColor.text3
    },
    subtitle1: {},
    subtitle2: {}
  }
}

export const HideOnMobile = styled('div')(({ theme, breakpoint }: { theme: Theme; breakpoint?: 'sm' | 'md' }) => ({
  [theme.breakpoints.down(breakpoint ?? 'sm')]: {
    display: 'none'
  }
}))

export const ShowOnMobile = styled('div')(({ theme, breakpoint }: { theme: Theme; breakpoint?: 'sm' | 'md' }) => ({
  display: 'none',
  [theme.breakpoints.down(breakpoint ?? 'sm')]: {
    display: 'block'
  }
}))

export default createTheme({
  ...theme,
  overrides: {
    ...override
  }
})

export function ThemeProvider({ children, theme }: any) {
  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
}
