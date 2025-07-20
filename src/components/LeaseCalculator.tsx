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
  maandbedrag: number;
  totaalBetaald: number;
  totaleKosten: number;
  restwaarde: number;
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
    const raw = unformatNumber(e.target.value);
    setter(formatNumber(raw));
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
    // Bereken het te financieren bedrag
    const teFinancierenBedrag = autoBedrag - eigenInbreng;
    
    // Maandelijkse rente
    const maandelijkseRente = jaarlijkseRente / 100 / 12;
    
    // Aantal maanden
    const aantalMaanden = looptijd * 12;
    
    // Annuïteit berekening voor het maandbedrag
    let maandbedrag = 0;
    if (maandelijkseRente > 0) {
      maandbedrag = teFinancierenBedrag * (maandelijkseRente * Math.pow(1 + maandelijkseRente, aantalMaanden)) / 
        (Math.pow(1 + maandelijkseRente, aantalMaanden) - 1);
    } else {
      // Als rente 0% is, gewoon delen door aantal maanden
      maandbedrag = teFinancierenBedrag / aantalMaanden;
    }
    
    // Totaal betaald over de looptijd
    const totaalBetaald = maandbedrag * aantalMaanden;
    
    // Totale kosten (inclusief eigen inbreng)
    const totaleKosten = totaalBetaald + eigenInbreng;
    
    return {
      maandbedrag: parseFloat(maandbedrag.toFixed(2)),
      totaalBetaald: parseFloat(totaalBetaald.toFixed(2)),
      totaleKosten: parseFloat(totaleKosten.toFixed(2)),
      restwaarde: parseFloat(restwaarde.toFixed(2)),
    };
  };

  // Automatisch berekenen bij elke wijziging
  useEffect(() => {
    if (!autoBedrag || !jaarlijkseRente || !looptijd || !restwaarde) {
      setResultaat(null);
      return;
    }
    const result = calculateLease({
      autoBedrag: parseFloat(unformatNumber(autoBedrag)),
      eigenInbreng: parseFloat(unformatNumber(eigenInbreng)),
      jaarlijkseRente: parseFloat(jaarlijkseRente),
      looptijd: parseInt(looptijd),
      restwaarde: parseFloat(unformatNumber(restwaarde)),
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
                type="text"
                value={autoBedrag}
                onChange={handleBedragChange(setAutoBedrag)}
                fullWidth
                inputProps={{ min: 0, inputMode: 'numeric', pattern: '[0-9]*' }}
                error={parseFloat(unformatNumber(autoBedrag)) < 0}
                helperText={parseFloat(unformatNumber(autoBedrag)) < 0 ? "Bedrag kan niet negatief zijn" : ""}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Eigen inbreng/inruil (€)"
                type="text"
                value={eigenInbreng}
                onChange={handleBedragChange(setEigenInbreng)}
                fullWidth
                inputProps={{ min: 0, inputMode: 'numeric', pattern: '[0-9]*' }}
                error={parseFloat(unformatNumber(eigenInbreng)) < 0}
                helperText={parseFloat(unformatNumber(eigenInbreng)) < 0 ? "Bedrag kan niet negatief zijn" : ""}
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
                label="Looptijd (jaren)"
                type="number"
                value={looptijd}
                onChange={(e) => setLooptijd(e.target.value)}
                fullWidth
                inputProps={{ min: 1, max: 10 }}
                error={parseInt(looptijd) < 1 || parseInt(looptijd) > 10}
                helperText={parseInt(looptijd) < 1 || parseInt(looptijd) > 10 ? "Looptijd moet tussen 1 en 10 jaar zijn" : ""}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Restwaarde (€)"
                type="text"
                value={restwaarde}
                onChange={handleBedragChange(setRestwaarde)}
                fullWidth
                inputProps={{ min: 0, inputMode: 'numeric', pattern: '[0-9]*' }}
                error={parseFloat(unformatNumber(restwaarde)) < 0}
                helperText={parseFloat(unformatNumber(restwaarde)) < 0 ? "Bedrag kan niet negatief zijn" : ""}
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
                        <Typography variant="h5" color="primary">
                          {formatCurrency(resultaat.maandbedrag)}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Totaal betaald over {looptijd} jaar
                        </Typography>
                        <Typography variant="h5">
                          {formatCurrency(resultaat.totaalBetaald)}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Totale kosten (incl. eigen inbreng)
                        </Typography>
                        <Typography variant="h5">
                          {formatCurrency(resultaat.totaleKosten)}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Restwaarde na {looptijd} jaar
                        </Typography>
                        <Typography variant="h5" color="success.main">
                          {formatCurrency(resultaat.restwaarde)}
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