import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { AdvancedCalculator } from './components/AdvancedCalculator';
import { HuurpuntenCalculator } from './components/HuurpuntenCalculator';
import { CompoundCalculator } from './components/CompoundCalculator';

// Material Symbols icon component
const MaterialIcon = ({ name, size = 32, color, filled = false }: { name: string; size?: number; color?: string; filled?: boolean }) => (
  <span 
    className="material-symbols-rounded" 
    style={{ 
      fontSize: size, 
      color: color,
      lineHeight: 1,
      display: 'inline-block',
      fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' 24`
    }}
  >
    {name}
  </span>
);

const navItems = [
  {
    label: 'Rendement',
    iconName: 'percent',
  },
  {
    label: 'Huurpunten', 
    iconName: 'home',
  },
  {
    label: 'Compound',
    iconName: 'trending_up',
  },
];

// Helper om CSS-variabelen op te halen
const getCssVar = (name: string) =>
  getComputedStyle(document.body).getPropertyValue(name).trim();

function useMaterialTheme() {
  const [theme, setTheme] = React.useState(() => createTheme({
    palette: {
      mode: document.body.classList.contains('dark') ? 'dark' : 'light',
      primary: {
        main: getCssVar('--md-sys-color-primary'),
        contrastText: getCssVar('--md-sys-color-on-primary'),
      },
      secondary: {
        main: getCssVar('--md-sys-color-secondary'),
        contrastText: getCssVar('--md-sys-color-on-secondary'),
      },
      background: {
        default: getCssVar('--md-sys-color-background'),
        paper: getCssVar('--md-sys-color-surface'),
      },
      error: {
        main: getCssVar('--md-sys-color-error'),
        contrastText: getCssVar('--md-sys-color-on-error'),
      },
      text: {
        primary: getCssVar('--md-sys-color-on-surface'),
        secondary: getCssVar('--md-sys-color-on-surface-variant'),
      },
    },
    shape: {
      borderRadius: 20,
    },
    typography: {
      fontFamily: '"Noto Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      
      // Headers en titles: Bebas Neue
      h1: {
        fontFamily: '"Bebas Neue", "Arial Black", "Helvetica Neue", Helvetica, sans-serif',
        fontSize: '3.5rem',
        fontWeight: 400,
        letterSpacing: '-0.25px',
        color: getCssVar('--md-sys-color-primary'),
      },
      h2: {
        fontFamily: '"Bebas Neue", "Arial Black", "Helvetica Neue", Helvetica, sans-serif',
        fontSize: '2.8rem',
        fontWeight: 400,
        letterSpacing: '0px',
        color: getCssVar('--md-sys-color-primary'),
      },
      h3: {
        fontFamily: '"Bebas Neue", "Arial Black", "Helvetica Neue", Helvetica, sans-serif',
        fontSize: '2.25rem',
        fontWeight: 400,
        letterSpacing: '0px',
        color: getCssVar('--md-sys-color-primary'),
      },
      h4: {
        fontFamily: '"Bebas Neue", "Arial Black", "Helvetica Neue", Helvetica, sans-serif',
        fontSize: '2rem',
        fontWeight: 400,
        letterSpacing: '0px',
        color: getCssVar('--md-sys-color-primary'),
      },
      h5: {
        fontFamily: '"Bebas Neue", "Arial Black", "Helvetica Neue", Helvetica, sans-serif',
        fontSize: '1.75rem',
        fontWeight: 400,
        letterSpacing: '0px',
        color: getCssVar('--md-sys-color-primary'),
      },
      h6: {
        fontFamily: '"Bebas Neue", "Arial Black", "Helvetica Neue", Helvetica, sans-serif',
        fontSize: '1.375rem',
        fontWeight: 400,
        letterSpacing: '0px',
        color: getCssVar('--md-sys-color-primary'),
      },
      
      // Body tekst: Noto Sans
      body1: {
        fontFamily: '"Noto Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        fontSize: '1rem',
        fontWeight: 400,
        lineHeight: 1.5,
        letterSpacing: '0.5px',
      },
      body2: {
        fontFamily: '"Noto Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        fontSize: '0.875rem',
        fontWeight: 400,
        lineHeight: 1.43,
        letterSpacing: '0.25px',
      },
      
      // Subtitles: Bebas Neue
      subtitle1: {
        fontFamily: '"Bebas Neue", "Arial Black", "Helvetica Neue", Helvetica, sans-serif',
        fontSize: '1rem',
        fontWeight: 500,
        lineHeight: 1.75,
        letterSpacing: '0.15px',
      },
      subtitle2: {
        fontFamily: '"Bebas Neue", "Arial Black", "Helvetica Neue", Helvetica, sans-serif',
        fontSize: '0.875rem',
        fontWeight: 500,
        lineHeight: 1.57,
        letterSpacing: '0.1px',
      },
      
      // Knoppen en labels: Noto Sans
      button: {
        fontFamily: '"Noto Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        fontSize: '0.875rem',
        fontWeight: 500,
        lineHeight: 1.75,
        letterSpacing: '0.1px',
        textTransform: 'none' as const,
      },
      caption: {
        fontFamily: '"Noto Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        fontSize: '0.75rem',
        fontWeight: 400,
        lineHeight: 1.66,
        letterSpacing: '0.4px',
      },
      overline: {
        fontFamily: '"Noto Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        fontSize: '0.75rem',
        fontWeight: 500,
        lineHeight: 2.66,
        letterSpacing: '1px',
        textTransform: 'uppercase' as const,
      },
    },
  }));

  React.useEffect(() => {
    const updateTheme = () => {
      setTheme(createTheme({
        palette: {
          mode: document.body.classList.contains('dark') ? 'dark' : 'light',
          primary: {
            main: getCssVar('--md-sys-color-primary'),
            contrastText: getCssVar('--md-sys-color-on-primary'),
          },
          secondary: {
            main: getCssVar('--md-sys-color-secondary'),
            contrastText: getCssVar('--md-sys-color-on-secondary'),
          },
          background: {
            default: getCssVar('--md-sys-color-background'),
            paper: getCssVar('--md-sys-color-surface'),
          },
          error: {
            main: getCssVar('--md-sys-color-error'),
            contrastText: getCssVar('--md-sys-color-on-error'),
          },
          text: {
            primary: getCssVar('--md-sys-color-on-surface'),
            secondary: getCssVar('--md-sys-color-on-surface-variant'),
          },
        },
        shape: {
          borderRadius: 20,
        },
        typography: {
          fontFamily: '"Noto Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          
          // Headers en titles: Bebas Neue
          h1: {
            fontFamily: '"Bebas Neue", "Arial Black", "Helvetica Neue", Helvetica, sans-serif',
            fontSize: '3.5rem',
            fontWeight: 400,
            letterSpacing: '-0.25px',
            color: getCssVar('--md-sys-color-primary'),
          },
          h2: {
            fontFamily: '"Bebas Neue", "Arial Black", "Helvetica Neue", Helvetica, sans-serif',
            fontSize: '2.8rem',
            fontWeight: 400,
            letterSpacing: '0px',
            color: getCssVar('--md-sys-color-primary'),
          },
          h3: {
            fontFamily: '"Bebas Neue", "Arial Black", "Helvetica Neue", Helvetica, sans-serif',
            fontSize: '2.25rem',
            fontWeight: 400,
            letterSpacing: '0px',
            color: getCssVar('--md-sys-color-primary'),
          },
          h4: {
            fontFamily: '"Bebas Neue", "Arial Black", "Helvetica Neue", Helvetica, sans-serif',
            fontSize: '2rem',
            fontWeight: 400,
            letterSpacing: '0px',
            color: getCssVar('--md-sys-color-primary'),
          },
          h5: {
            fontFamily: '"Bebas Neue", "Arial Black", "Helvetica Neue", Helvetica, sans-serif',
            fontSize: '1.75rem',
            fontWeight: 400,
            letterSpacing: '0px',
            color: getCssVar('--md-sys-color-primary'),
          },
          h6: {
            fontFamily: '"Bebas Neue", "Arial Black", "Helvetica Neue", Helvetica, sans-serif',
            fontSize: '1.375rem',
            fontWeight: 400,
            letterSpacing: '0px',
            color: getCssVar('--md-sys-color-primary'),
          },
          
          // Body tekst: Noto Sans
          body1: {
            fontFamily: '"Noto Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            fontSize: '1rem',
            fontWeight: 400,
            lineHeight: 1.5,
            letterSpacing: '0.5px',
          },
          body2: {
            fontFamily: '"Noto Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            fontSize: '0.875rem',
            fontWeight: 400,
            lineHeight: 1.43,
            letterSpacing: '0.25px',
          },
          
          // Subtitles: Bebas Neue
          subtitle1: {
            fontFamily: '"Bebas Neue", "Arial Black", "Helvetica Neue", Helvetica, sans-serif',
            fontSize: '1rem',
            fontWeight: 500,
            lineHeight: 1.75,
            letterSpacing: '0.15px',
          },
          subtitle2: {
            fontFamily: '"Bebas Neue", "Arial Black", "Helvetica Neue", Helvetica, sans-serif',
            fontSize: '0.875rem',
            fontWeight: 500,
            lineHeight: 1.57,
            letterSpacing: '0.1px',
          },
          
          // Knoppen en labels: Noto Sans
          button: {
            fontFamily: '"Noto Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            fontSize: '0.875rem',
            fontWeight: 500,
            lineHeight: 1.75,
            letterSpacing: '0.1px',
            textTransform: 'none' as const,
          },
          caption: {
            fontFamily: '"Noto Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            fontSize: '0.75rem',
            fontWeight: 400,
            lineHeight: 1.66,
            letterSpacing: '0.4px',
          },
          overline: {
            fontFamily: '"Noto Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            fontSize: '0.75rem',
            fontWeight: 500,
            lineHeight: 2.66,
            letterSpacing: '1px',
            textTransform: 'uppercase' as const,
          },
        },
      }));
    };
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateTheme);
    return () => window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', updateTheme);
  }, []);

  return theme;
}

function App() {
  const [value, setValue] = useState(0);
  const theme = useMaterialTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const renderContent = () => {
    switch (value) {
      case 0:
        return <AdvancedCalculator />;
      case 1:
        return <HuurpuntenCalculator />;
      case 2:
        return <CompoundCalculator />;
      default:
        return <AdvancedCalculator />;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          bgcolor: 'background.default',
        }}
      >
        {/* Top navigatiebalk voor desktop/tablet */}
        <Box
          sx={{
            position: 'fixed',
            left: 0,
            right: 0,
            top: 0,
            zIndex: 1200,
            display: { xs: 'none', sm: 'flex' },
            borderBottom: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
          }}
        >
          <BottomNavigation
            value={value}
            onChange={(_, v) => setValue(v)}
            showLabels
            sx={{ width: '100%', bgcolor: 'transparent' }}
          >
            {navItems.map((item, idx) => (
              <BottomNavigationAction
                key={item.label}
                label={item.label}
                icon={<MaterialIcon name={item.iconName} size={28} filled={value === idx} />}
              />
            ))}
          </BottomNavigation>
        </Box>

        <Box
          component="main"
          flex={1}
          p={{ xs: 1, sm: 4 }}
          pb={{ xs: isMobile ? 10 : 0, sm: 0 }}
          mt={isMobile ? 7 : 8}
        >
          {renderContent()}
        </Box>

        {/* Bottom navigatiebalk voor mobiel */}
        <Box
          sx={{
            position: 'fixed',
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1200,
            display: { xs: 'flex', sm: 'none' },
            borderTop: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
          }}
        >
          <BottomNavigation
            value={value}
            onChange={(_, v) => setValue(v)}
            showLabels
            sx={{ width: '100%', bgcolor: 'transparent' }}
          >
            {navItems.map((item, idx) => (
              <BottomNavigationAction
                key={item.label}
                label={item.label}
                icon={<MaterialIcon name={item.iconName} size={28} filled={value === idx} />}
              />
            ))}
          </BottomNavigation>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App; 