import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  TextField,
  Card,
  CardContent,
  Stack,
  Box,
  useMediaQuery,
  useTheme,
} from '@mui/material';

interface LeaseResult {
  teFinancierenBedrag: number;
  totaleKredietvergoeding: number;
  totaalMetRente: number;
  totaalMinusSlottermijn: number;
  betaaldeRente: number;
  maandbedrag: number;
  totaalBetaald: number;
}

function formatNumber(value: string): string {
  if (!value) return '';
  // Verwijder alle niet-numerieke karakters behalve komma en punt
  const num = value.replace(/[^\d.,]/g, '');
  if (!num) return '';
  
  // Vervang komma door punt voor berekening
  const numWithDot = num.replace(',', '.');
  const number = parseFloat(numWithDot);
  
  if (isNaN(number)) return '';
  
  // Format met duizendtallen separator en 2 decimalen
  return number.toLocaleString('nl-NL', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });
}

function unformatNumber(value: string): string {
  // Vervang punt door lege string (duizendtallen separator) en komma door punt
  return value.replace(/\./g, '').replace(',', '.');
}

export function LeaseCalculator() {
  const [autoBedrag, setAutoBedrag] = useState<string>('');
  const [eigenInbreng, setEigenInbreng] = useState<string>('0');
  const [jaarlijkseRente, setJaarlijkseRente] = useState<string>('');
  const [looptijd, setLooptijd] = useState<string>('');
  const [restwaarde, setRestwaarde] = useState<string>('');
  const [resultaat, setResultaat] = useState<LeaseResult | null>(null);
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));

  const handleBedragChange = (setter: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setter(value);
  };

  const handleNumberChange = (setter: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setter(value);
  };

  const calculateLease = ({
    autoBedrag,
    eigenInbreng,
    jaarlijkseRente,
    looptijd,
    restwaarde,
  }: {
    autoBedrag: number;
    eigenInbreng: number;
    jaarlijkseRente: number;
    looptijd: number;
    restwaarde: number;
  }): LeaseResult => {
    // 1. Bereken het te financieren bedrag = aanschafprijs - inbreng
    const teFinancierenBedrag = autoBedrag - eigenInbreng;
    
    // 2. Maandelijkse rente
    const maandelijkseRente = jaarlijkseRente / 100 / 12;
    
    // 3. Annuïtaire berekening met PMT-formule
    // PMT = (PV * r * (1 + r)^n) / ((1 + r)^n - 1) - FV * r / ((1 + r)^n - 1)
    // Waar: PV = present value (te financieren bedrag), FV = future value (slottermijn), r = maandelijkse rente, n = aantal maanden
    let maandbedrag = 0;
    
    if (maandelijkseRente > 0) {
      const r = maandelijkseRente;
      const n = looptijd;
      const PV = teFinancierenBedrag;
      const FV = restwaarde;
      
      // PMT formule voor lease met slottermijn
      const numerator = PV * r * Math.pow(1 + r, n) - FV * r;
      const denominator = Math.pow(1 + r, n) - 1;
      maandbedrag = numerator / denominator;
    } else {
      // Als rente 0% is, gewoon (hoofdbedrag - slottermijn) / aantal maanden
      maandbedrag = (teFinancierenBedrag - restwaarde) / looptijd;
    }
    
    // 4. Bereken totale kredietvergoeding
    const totaalBetaald = maandbedrag * looptijd;
    const kredietvergoeding = totaalBetaald - teFinancierenBedrag + restwaarde;
    
    return {
      teFinancierenBedrag: parseFloat(teFinancierenBedrag.toFixed(2)),
      totaleKredietvergoeding: parseFloat(kredietvergoeding.toFixed(2)),
      totaalMetRente: parseFloat((teFinancierenBedrag + kredietvergoeding).toFixed(2)),
      totaalMinusSlottermijn: parseFloat((teFinancierenBedrag + kredietvergoeding - restwaarde).toFixed(2)),
      betaaldeRente: parseFloat(kredietvergoeding.toFixed(2)),
      maandbedrag: parseFloat(maandbedrag.toFixed(2)),
      totaalBetaald: parseFloat(totaalBetaald.toFixed(2)),
    };
  };

  // Automatisch berekenen bij elke wijziging
  useEffect(() => {
    if (!autoBedrag || !jaarlijkseRente || !looptijd || !restwaarde) {
      setResultaat(null);
      return;
    }
    const result = calculateLease({
      autoBedrag: parseFloat(autoBedrag),
      eigenInbreng: parseFloat(eigenInbreng),
      jaarlijkseRente: parseFloat(jaarlijkseRente),
      looptijd: parseInt(looptijd),
      restwaarde: parseFloat(restwaarde),
    });
    setResultaat(result);
  }, [autoBedrag, eigenInbreng, jaarlijkseRente, looptijd, restwaarde]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" gutterBottom sx={{ mb: 4, color: 'primary.main', fontWeight: 700 }}>
        Lease Calculator
      </Typography>

      <Grid container spacing={4}>
        {/* Formulier links */}
        <Grid item xs={12} lg={8}>
          <Typography variant="body1" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
            Bereken je maandbedrag voor een lease-auto. Deze calculator houdt rekening met de aanschafprijs, eigen inbreng, rente, looptijd en restwaarde.
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Aanschafprijs auto (€)"
                type="number"
                value={autoBedrag}
                onChange={handleNumberChange(setAutoBedrag)}
                fullWidth
                inputProps={{ min: 0, step: 0.01, inputMode: 'decimal' }}
                error={parseFloat(autoBedrag || '0') < 0}
                helperText={parseFloat(autoBedrag || '0') < 0 ? "Bedrag kan niet negatief zijn" : ""}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Eigen inbreng/inruil (€)"
                type="number"
                value={eigenInbreng}
                onChange={handleNumberChange(setEigenInbreng)}
                fullWidth
                inputProps={{ min: 0, step: 0.01, inputMode: 'decimal' }}
                error={parseFloat(eigenInbreng || '0') < 0}
                helperText={parseFloat(eigenInbreng || '0') < 0 ? "Bedrag kan niet negatief zijn" : ""}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Jaarlijkse rente (%)"
                type="number"
                value={jaarlijkseRente}
                onChange={(e) => setJaarlijkseRente(e.target.value)}
                fullWidth
                inputProps={{ min: 0, step: 0.1 }}
                error={parseFloat(jaarlijkseRente) < 0}
                helperText={parseFloat(jaarlijkseRente) < 0 ? "Percentage kan niet negatief zijn" : ""}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Looptijd (maanden)"
                type="number"
                value={looptijd}
                onChange={(e) => setLooptijd(e.target.value)}
                fullWidth
                inputProps={{ min: 1, max: 120 }}
                error={parseInt(looptijd) < 1 || parseInt(looptijd) > 120}
                helperText={parseInt(looptijd) < 1 || parseInt(looptijd) > 120 ? "Looptijd moet tussen 1 en 120 maanden zijn" : ""}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Restwaarde (€)"
                type="number"
                value={restwaarde}
                onChange={handleNumberChange(setRestwaarde)}
                fullWidth
                inputProps={{ min: 0, step: 0.01, inputMode: 'decimal' }}
                error={parseFloat(restwaarde || '0') < 0}
                helperText={parseFloat(restwaarde || '0') < 0 ? "Bedrag kan niet negatief zijn" : ""}
              />
            </Grid>
          </Grid>
        </Grid>

        {/* Resultaten rechts */}
        <Grid item xs={12} lg={4}>
          <div style={{ position: 'sticky', top: isDesktop ? 76 : 20 }}>
            <Card elevation={3} sx={{
              background: 'linear-gradient(135deg, var(--md-sys-color-surface-container-low) 0%, var(--md-sys-color-surface-container) 100%)',
              border: '1px solid var(--md-sys-color-outline-variant)',
            }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 700, mb: 2 }}>
                  Resultaten
                </Typography>
                <Stack spacing={2}>
                  {resultaat ? (
                    <>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Maandbedrag
                        </Typography>
                        <Typography variant="h5" color="success.main">
                          {formatCurrency(resultaat.maandbedrag)}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Betaalde rente over {looptijd} maanden
                        </Typography>
                        <Typography variant="h5" color="error.main">
                          {formatCurrency(resultaat.betaaldeRente)}
                        </Typography>
                      </Box>
                    </>
                  ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                      Vul de gegevens in om je lease-maandbedrag te berekenen.
                    </Typography>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </div>
        </Grid>
      </Grid>
    </Container>
  );
} 