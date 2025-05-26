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

interface CompoundResult {
  eindwaarde: number;
  totaalIngelegd: number;
  winst: number;
}

function formatNumber(value: string): string {
  if (!value) return '';
  const num = value.replace(/\D/g, '');
  if (!num) return '';
  return parseInt(num, 10).toLocaleString('nl-NL');
}

function unformatNumber(value: string): string {
  return value.replace(/\./g, '');
}

export function CompoundCalculator() {
  const [startBedrag, setStartBedrag] = useState<string>('');
  const [groeipercentage, setGroeipercentage] = useState<string>('');
  const [aantalJaren, setAantalJaren] = useState<string>('');
  const [jaarlijkseInleg, setJaarlijkseInleg] = useState<string>('0');
  const [resultaat, setResultaat] = useState<CompoundResult | null>(null);
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));

  const handleBedragChange = (setter: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = unformatNumber(e.target.value);
    setter(formatNumber(raw));
  };

  const calculateCompoundGrowth = ({
    startBedrag,
    groeipercentage,
    aantalJaren,
    jaarlijkseInleg = 0,
  }: {
    startBedrag: number;
    groeipercentage: number;
    aantalJaren: number;
    jaarlijkseInleg?: number;
  }): CompoundResult => {
    const groeiFactor = 1 + groeipercentage / 100;
    let eindwaarde = startBedrag;
    let totaalIngelegd = startBedrag;

    for (let i = 1; i <= aantalJaren; i++) {
      eindwaarde = (eindwaarde + jaarlijkseInleg) * groeiFactor;
      totaalIngelegd += jaarlijkseInleg;
    }

    const winst = eindwaarde - totaalIngelegd;

    return {
      eindwaarde: parseFloat(eindwaarde.toFixed(2)),
      totaalIngelegd: parseFloat(totaalIngelegd.toFixed(2)),
      winst: parseFloat(winst.toFixed(2)),
    };
  };

  // Automatisch berekenen bij elke wijziging
  useEffect(() => {
    if (!startBedrag || !groeipercentage || !aantalJaren) {
      setResultaat(null);
      return;
    }
    const result = calculateCompoundGrowth({
      startBedrag: parseFloat(unformatNumber(startBedrag)),
      groeipercentage: parseFloat(groeipercentage),
      aantalJaren: parseInt(aantalJaren),
      jaarlijkseInleg: parseFloat(unformatNumber(jaarlijkseInleg)),
    });
    setResultaat(result);
  }, [startBedrag, groeipercentage, aantalJaren, jaarlijkseInleg]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" gutterBottom sx={{ mb: 4, color: 'primary.main', fontWeight: 700 }}>
        Compound Calculator
      </Typography>

      <Grid container spacing={4}>
        {/* Formulier links */}
        <Grid item xs={12} lg={8}>
          <Typography variant="body1" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
            Bereken het effect van samengestelde groei (compound growth) over tijd. Deze calculator helpt je om te zien hoe je investering groeit met rente-op-rente effect.
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Startbedrag (€)"
                type="text"
                value={startBedrag}
                onChange={handleBedragChange(setStartBedrag)}
                fullWidth
                inputProps={{ min: 0, inputMode: 'numeric', pattern: '[0-9]*' }}
                error={parseFloat(unformatNumber(startBedrag)) < 0}
                helperText={parseFloat(unformatNumber(startBedrag)) < 0 ? "Bedrag kan niet negatief zijn" : ""}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Jaarlijks groeipercentage (%)"
                type="number"
                value={groeipercentage}
                onChange={(e) => setGroeipercentage(e.target.value)}
                fullWidth
                inputProps={{ min: 0 }}
                error={parseFloat(groeipercentage) < 0}
                helperText={parseFloat(groeipercentage) < 0 ? "Percentage kan niet negatief zijn" : ""}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Aantal jaren"
                type="number"
                value={aantalJaren}
                onChange={(e) => setAantalJaren(e.target.value)}
                fullWidth
                inputProps={{ min: 1 }}
                error={parseInt(aantalJaren) < 1}
                helperText={parseInt(aantalJaren) < 1 ? "Aantal jaren moet minimaal 1 zijn" : ""}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Jaarlijkse extra inleg (€)"
                type="text"
                value={jaarlijkseInleg}
                onChange={handleBedragChange(setJaarlijkseInleg)}
                fullWidth
                inputProps={{ min: 0, inputMode: 'numeric', pattern: '[0-9]*' }}
                error={parseFloat(unformatNumber(jaarlijkseInleg)) < 0}
                helperText={parseFloat(unformatNumber(jaarlijkseInleg)) < 0 ? "Bedrag kan niet negatief zijn" : ""}
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
                          Eindwaarde na {aantalJaren} jaar
                        </Typography>
                        <Typography variant="h5" color="primary">
                          {formatCurrency(resultaat.eindwaarde)}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Totaal ingelegd
                        </Typography>
                        <Typography variant="h5">
                          {formatCurrency(resultaat.totaalIngelegd)}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Totale groei/winst
                        </Typography>
                        <Typography 
                          variant="h5" 
                          color={resultaat.winst >= 0 ? "success.main" : "error.main"}
                        >
                          {formatCurrency(resultaat.winst)}
                        </Typography>
                      </Box>
                    </>
                  ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                      Vul de gegevens in en klik op 'Bereken' om de resultaten te zien.
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