import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Paper,
  Divider,
} from '@mui/material';

interface FormData {
  aankoopprijs: number;
  maandelijkseHuur: number;
  maandelijkseKosten: number;
  eigenInbreng: number;
  hypotheekbedrag: number;
  rentepercentage: number;
}

interface FormErrors {
  [key: string]: string;
}

interface Resultaten {
  brutoRendement: number;
  maandlastHypotheek: number;
  maandelijkseCashflow: number;
  nettoRendement: number | null;
  terugverdientijd: number | null;
}

const CalculatorForm = () => {
  const [formData, setFormData] = useState<FormData>({
    aankoopprijs: 0,
    maandelijkseHuur: 0,
    maandelijkseKosten: 0,
    eigenInbreng: 0,
    hypotheekbedrag: 0,
    rentepercentage: 0,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [resultaten, setResultaten] = useState<Resultaten | null>(null);

  const validateField = (name: string, value: number): string => {
    if (isNaN(value)) return 'Voer een geldig getal in';
    if (value < 0) return 'Waarde moet positief zijn';
    
    switch (name) {
      case 'rentepercentage':
        if (value > 100) return 'Rentepercentage kan niet hoger zijn dan 100%';
        break;
      case 'eigenInbreng':
        if (value > formData.aankoopprijs) return 'Eigen inbreng kan niet hoger zijn dan aankoopprijs';
        break;
      case 'hypotheekbedrag':
        if (value > formData.aankoopprijs) return 'Hypotheekbedrag kan niet hoger zijn dan aankoopprijs';
        break;
    }
    return '';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value) || 0;
    
    setFormData(prev => ({
      ...prev,
      [name]: numValue
    }));

    const error = validateField(name, numValue);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const isFormValid = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    Object.entries(formData).forEach(([name, value]) => {
      const error = validateField(name, value);
      if (error) {
        newErrors[name] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const formatCurrency = (value: number): string => {
    return `€${value.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatPercentage = (value: number): string => {
    return `${value.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`;
  };

  const berekenResultaten = () => {
    if (!isFormValid()) return;

    const {
      aankoopprijs,
      maandelijkseHuur,
      maandelijkseKosten,
      eigenInbreng,
      hypotheekbedrag,
      rentepercentage
    } = formData;

    // Bruto rendement
    const jaarhuur = maandelijkseHuur * 12;
    const brutoRendement = (jaarhuur / aankoopprijs) * 100;

    // Maandlast hypotheek (annuïteit)
    const maandelijkseRente = rentepercentage / 100 / 12;
    const maandlastHypotheek = (maandelijkseRente * hypotheekbedrag) / (1 - Math.pow(1 + maandelijkseRente, -360));

    // Maandelijkse cashflow
    const maandelijkseCashflow = maandelijkseHuur - maandelijkseKosten - maandlastHypotheek;

    // Netto rendement op eigen geld
    const jaarlijkseCashflow = maandelijkseCashflow * 12;
    const nettoRendement = eigenInbreng > 0 ? (jaarlijkseCashflow / eigenInbreng) * 100 : null;

    // Terugverdientijd
    const terugverdientijd = eigenInbreng > 0 && jaarlijkseCashflow > 0 ? eigenInbreng / jaarlijkseCashflow : null;

    setResultaten({
      brutoRendement,
      maandlastHypotheek,
      maandelijkseCashflow,
      nettoRendement,
      terugverdientijd
    });
  };

  const resetForm = () => {
    setFormData({
      aankoopprijs: 0,
      maandelijkseHuur: 0,
      maandelijkseKosten: 0,
      eigenInbreng: 0,
      hypotheekbedrag: 0,
      rentepercentage: 0,
    });
    setErrors({});
    setResultaten(null);
  };

  return (
    <Box component="form" noValidate autoComplete="off">
      <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Aankoopprijs woning"
              name="aankoopprijs"
              type="number"
              value={formData.aankoopprijs || ''}
              onChange={handleInputChange}
              error={!!errors.aankoopprijs}
              helperText={errors.aankoopprijs || 'Totale aankoopprijs van de woning'}
              InputProps={{
                startAdornment: <Typography sx={{ mr: 1 }}>€</Typography>,
              }}
              variant="outlined"
              size="medium"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Maandelijkse huurinkomsten"
              name="maandelijkseHuur"
              type="number"
              value={formData.maandelijkseHuur || ''}
              onChange={handleInputChange}
              error={!!errors.maandelijkseHuur}
              helperText={errors.maandelijkseHuur}
              InputProps={{
                startAdornment: <Typography sx={{ mr: 1 }}>€</Typography>,
              }}
              variant="outlined"
              size="medium"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Maandelijkse kosten"
              name="maandelijkseKosten"
              type="number"
              value={formData.maandelijkseKosten || ''}
              onChange={handleInputChange}
              error={!!errors.maandelijkseKosten}
              helperText={errors.maandelijkseKosten || 'Onderhoud, VvE, beheer, etc.'}
              InputProps={{
                startAdornment: <Typography sx={{ mr: 1 }}>€</Typography>,
              }}
              variant="outlined"
              size="medium"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Eigen inbreng"
              name="eigenInbreng"
              type="number"
              value={formData.eigenInbreng || ''}
              onChange={handleInputChange}
              error={!!errors.eigenInbreng}
              helperText={errors.eigenInbreng}
              InputProps={{
                startAdornment: <Typography sx={{ mr: 1 }}>€</Typography>,
              }}
              variant="outlined"
              size="medium"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Hypotheekbedrag"
              name="hypotheekbedrag"
              type="number"
              value={formData.hypotheekbedrag || ''}
              onChange={handleInputChange}
              error={!!errors.hypotheekbedrag}
              helperText={errors.hypotheekbedrag}
              InputProps={{
                startAdornment: <Typography sx={{ mr: 1 }}>€</Typography>,
              }}
              variant="outlined"
              size="medium"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Rentepercentage hypotheek"
              name="rentepercentage"
              type="number"
              value={formData.rentepercentage || ''}
              onChange={handleInputChange}
              error={!!errors.rentepercentage}
              helperText={errors.rentepercentage || 'Jaarlijks rentepercentage'}
              InputProps={{
                endAdornment: <Typography sx={{ ml: 1 }}>%</Typography>,
              }}
              variant="outlined"
              size="medium"
            />
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ 
              display: 'flex', 
              gap: 2, 
              justifyContent: 'center',
              flexDirection: { xs: 'column', sm: 'row' },
              mt: 2
            }}>
              <Button
                variant="contained"
                color="primary"
                onClick={berekenResultaten}
                size="large"
                fullWidth
                sx={{ 
                  height: 40,
                  borderRadius: '20px',
                  textTransform: 'none',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  letterSpacing: '0.0892857143em',
                  padding: '0 24px',
                  '&:hover': {
                    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
                  },
                  '&:active': {
                    boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.2)',
                  }
                }}
              >
                Bereken
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={resetForm}
                size="large"
                fullWidth
                sx={{ 
                  height: 40,
                  borderRadius: '20px',
                  textTransform: 'none',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  letterSpacing: '0.0892857143em',
                  padding: '0 24px',
                  borderWidth: '1px',
                  '&:hover': {
                    borderWidth: '1px',
                    backgroundColor: 'rgba(74, 99, 99, 0.04)',
                  },
                  '&:active': {
                    backgroundColor: 'rgba(74, 99, 99, 0.12)',
                  }
                }}
              >
                Reset
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {resultaten && (
        <Paper 
          elevation={0}
          sx={{ 
            p: 3,
            borderRadius: 2,
            background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
          }}
        >
          <Typography variant="h5" gutterBottom color="primary" sx={{ mb: 3 }}>
            Resultaten
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                py: 1.5,
              }}>
                <Typography variant="body1" color="text.secondary">
                  Bruto rendement
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {formatPercentage(resultaten.brutoRendement)}
                </Typography>
              </Box>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                py: 1.5,
              }}>
                <Typography variant="body1" color="text.secondary">
                  Maandlast hypotheek
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {formatCurrency(resultaten.maandlastHypotheek)}
                </Typography>
              </Box>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                py: 1.5,
              }}>
                <Typography variant="body1" color="text.secondary">
                  Maandelijkse cashflow
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {formatCurrency(resultaten.maandelijkseCashflow)}
                </Typography>
              </Box>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                py: 1.5,
              }}>
                <Typography variant="body1" color="text.secondary">
                  Netto rendement op eigen geld
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {resultaten.nettoRendement !== null ? formatPercentage(resultaten.nettoRendement) : '–'}
                </Typography>
              </Box>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                py: 1.5,
              }}>
                <Typography variant="body1" color="text.secondary">
                  Terugverdientijd eigen inbreng
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {resultaten.terugverdientijd !== null ? `${resultaten.terugverdientijd.toFixed(2)} jaar` : '–'}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      )}
    </Box>
  );
};

export default CalculatorForm; 