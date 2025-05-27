import React, { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  TextField,
  Switch,
  FormControlLabel,
  RadioGroup,
  Radio,
  FormControl,
  FormLabel,
  Tooltip,
  IconButton,
  Divider,
  Alert,
  Card,
  CardContent,
  useMediaQuery,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

interface CalculatorState {
  woningType: 'bestaand' | 'nieuwbouw';
  doel: 'zelf' | 'verhuur';
  aankoopprijs: string;
  hypotheekbedrag: string;
  hypotheekRente: string;
  eigenInbreng: string;
  bijkomendeKosten: string;
  huur: string;
  maandelijkseKosten: string;
  waardestijging: string;
  wozWaarde: string;
  verhuurType: 'box3' | 'box1' | 'bv';
  jaarlijksInkomen: string;
}

const InfoTooltip: React.FC<{ title: string }> = ({ title }) => (
  <Tooltip title={title} arrow placement="top">
    <IconButton size="small">
      <InfoIcon fontSize="small" />
    </IconButton>
  </Tooltip>
);

function formatNumber(value: string): string {
  if (!value) return '';
  const num = value.replace(/\D/g, '');
  if (!num) return '';
  return parseInt(num, 10).toLocaleString('nl-NL');
}

function unformatNumber(value: string): string {
  return value.replace(/\./g, '');
}

const bedragVelden = [
  'aankoopprijs',
  'hypotheekbedrag',
  'eigenInbreng',
  'huur',
  'maandelijkseKosten',
  'wozWaarde',
  'jaarlijksInkomen',
];
const procentVelden = [
  'bijkomendeKosten',
  'hypotheekRente',
  'waardestijging',
];

const parseBedrag = (val: string) => val === '' ? 0 : parseFloat(unformatNumber(val));
const parseProcent = (val: string) => val === '' ? 0 : parseFloat(val.replace(',', '.'));

export const AdvancedCalculator: React.FC = () => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [values, setValues] = useState<CalculatorState>({
    woningType: 'bestaand',
    doel: 'verhuur',
    aankoopprijs: '',
    hypotheekbedrag: '',
    hypotheekRente: '',
    eigenInbreng: '',
    bijkomendeKosten: '',
    huur: '',
    maandelijkseKosten: '',
    waardestijging: '',
    wozWaarde: '',
    verhuurType: 'box3',
    jaarlijksInkomen: '',
  });
  const isDesktop = useMediaQuery('(min-width:600px)');

  const handleChange = (field: keyof CalculatorState) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let value = event.target.value;
    if (bedragVelden.includes(field)) {
      value = formatNumber(unformatNumber(value));
    }
    setValues(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const berekenResultaten = () => {
    const aankoopprijs = parseBedrag(values.aankoopprijs);
    const hypotheekbedrag = parseBedrag(values.hypotheekbedrag);
    const eigenInbreng = parseBedrag(values.eigenInbreng);
    const huur = parseBedrag(values.huur);
    const maandelijkseKosten = parseBedrag(values.maandelijkseKosten);
    const wozWaarde = parseBedrag(values.wozWaarde);
    const jaarlijksInkomen = parseBedrag(values.jaarlijksInkomen);
    const bijkomendeKosten = parseProcent(values.bijkomendeKosten);
    const hypotheekRente = parseProcent(values.hypotheekRente);
    const waardestijging = parseProcent(values.waardestijging);

    const totaleInvestering = aankoopprijs * (1 + bijkomendeKosten / 100);
    const werkelijkeInbreng = totaleInvestering - hypotheekbedrag;
    
    // Maandelijkse hypotheeklast berekenen (annuïteit)
    const maandelijkseRente = hypotheekRente / 100 / 12;
    const aantalMaanden = 30 * 12; // 30 jaar hypotheek
    const maandelijkseHypotheekLast = hypotheekbedrag > 0 && maandelijkseRente > 0
      ? hypotheekbedrag * (maandelijkseRente * Math.pow(1 + maandelijkseRente, aantalMaanden)) / 
        (Math.pow(1 + maandelijkseRente, aantalMaanden) - 1)
      : 0;
    
    // Fictief rendement Box 3 berekening (per maand)
    const fictiefRendement = ((wozWaarde || aankoopprijs) - hypotheekbedrag) * 0.0588 / 12;
    const box3Belasting = fictiefRendement * 0.36;
    
    // Belasting berekening per scenario (per maand)
    let belasting = 0;
    if (values.verhuurType === 'box3') {
      belasting = box3Belasting;
    } else if (values.verhuurType === 'box1') {
      const belastingTarief = jaarlijksInkomen > 73031 ? 0.495 : 0.37;
      belasting = (huur - maandelijkseKosten) * belastingTarief;
    }
    
    const nettoMaandOpbrengst = huur - maandelijkseKosten - belasting - maandelijkseHypotheekLast;
    const nettoRendement = werkelijkeInbreng > 0 ? (nettoMaandOpbrengst * 12 / werkelijkeInbreng) * 100 : 0;
    const terugverdientijd = Number(nettoMaandOpbrengst) > 0 ? werkelijkeInbreng / (nettoMaandOpbrengst * 12) : 0;

    // Waardestijging berekening
    const waardeNa5Jaar = aankoopprijs * Math.pow(1 + waardestijging / 100, 5);
    const vermogenswinst = waardeNa5Jaar - aankoopprijs;
    const totaalRendement = werkelijkeInbreng > 0 ? (nettoMaandOpbrengst * 12 * 5 + vermogenswinst) / werkelijkeInbreng * 100 : 0;

    return {
      totaleInvestering,
      werkelijkeInbreng,
      maandelijkseHypotheekLast,
      nettoMaandOpbrengst,
      belasting,
      nettoRendement,
      terugverdientijd,
      waardeNa5Jaar,
      totaalRendement,
    };
  };

  const resultaten = berekenResultaten();

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Vastgoed Rendement Calculator
      </Typography>
      
      <Grid container spacing={4}>
        {/* Formulier links */}
        <Grid item xs={12} lg={8}>
          <Typography variant="body1" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
            Bereken het rendement van jouw vastgoedinvestering. Deze calculator houdt rekening met alle kosten, belastingen en mogelijke waardestijging.
          </Typography>
          
          <Grid container spacing={3}>
            {/* Basis informatie */}
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Type woning</FormLabel>
                <RadioGroup
                  value={values.woningType}
                  onChange={handleChange('woningType')}
                  row
                >
                  <FormControlLabel
                    value="bestaand"
                    control={<Radio />}
                    label="Bestaande bouw"
                  />
                  <FormControlLabel
                    value="nieuwbouw"
                    control={<Radio />}
                    label="Nieuwbouw (v.o.n.)"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Doel</FormLabel>
                <RadioGroup
                  value={values.doel}
                  onChange={handleChange('doel')}
                  row
                >
                  <FormControlLabel
                    value="zelf"
                    control={<Radio />}
                    label="Zelf bewonen"
                  />
                  <FormControlLabel
                    value="verhuur"
                    control={<Radio />}
                    label="Verhuren (belegging)"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>

            {/* Financiële gegevens */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Aankoopprijs"
                type="text"
                value={values.aankoopprijs}
                onChange={handleChange('aankoopprijs')}
                InputProps={{
                  startAdornment: '€',
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Hypotheekbedrag"
                type="text"
                value={values.hypotheekbedrag}
                onChange={handleChange('hypotheekbedrag')}
                InputProps={{
                  startAdornment: '€',
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Hypotheekrente"
                type="text"
                value={values.hypotheekRente}
                onChange={handleChange('hypotheekRente')}
                InputProps={{
                  endAdornment: '%',
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Eigen inbreng"
                type="text"
                value={values.eigenInbreng}
                onChange={handleChange('eigenInbreng')}
                InputProps={{
                  startAdornment: '€',
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={showAdvanced}
                    onChange={(e) => setShowAdvanced(e.target.checked)}
                  />
                }
                label="Toon geavanceerde berekening"
              />
            </Grid>

            {showAdvanced && (
              <>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid item xs={12} md={6}>
                  <div>
                    <TextField
                      fullWidth
                      label="Bijkomende kosten"
                      type="text"
                      value={values.bijkomendeKosten}
                      onChange={handleChange('bijkomendeKosten')}
                      InputProps={{
                        endAdornment: '%',
                      }}
                    />
                    <InfoTooltip title="Bijv. overdrachtsbelasting, notaris, advies. Vaak 8-10% bij bestaande bouw." />
                  </div>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Maandelijkse huur"
                    type="text"
                    value={values.huur}
                    onChange={handleChange('huur')}
                    InputProps={{
                      startAdornment: '€',
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <div>
                    <TextField
                      fullWidth
                      label="Maandelijkse kosten"
                      type="text"
                      value={values.maandelijkseKosten}
                      onChange={handleChange('maandelijkseKosten')}
                      InputProps={{
                        startAdornment: '€',
                      }}
                    />
                    <InfoTooltip title="Onderhoud, VvE, verzekering, OZB" />
                  </div>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Verwachte jaarlijkse waardestijging"
                    type="text"
                    value={values.waardestijging}
                    onChange={handleChange('waardestijging')}
                    InputProps={{
                      endAdornment: '%',
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <div>
                    <TextField
                      fullWidth
                      label="WOZ-waarde"
                      type="text"
                      value={values.wozWaarde}
                      onChange={handleChange('wozWaarde')}
                      InputProps={{
                        startAdornment: '€',
                      }}
                    />
                    <InfoTooltip title="Alleen nodig voor Box 3 leegwaarderatio" />
                  </div>
                </Grid>
                <Grid item xs={12}>
                  <FormControl component="fieldset">
                    <FormLabel component="legend">Investeervorm</FormLabel>
                    <RadioGroup
                      value={values.verhuurType}
                      onChange={handleChange('verhuurType')}
                    >
                      <FormControlLabel
                        value="box3"
                        control={<Radio />}
                        label="Particulier (Box 3)"
                      />
                      <FormControlLabel
                        value="box1"
                        control={<Radio />}
                        label="Actieve verhuur (Box 1)"
                      />
                      <FormControlLabel
                        value="bv"
                        control={<Radio />}
                        label="BV / Zakelijk"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                {values.verhuurType === 'box1' && (
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Jaarlijks belastbaar inkomen"
                      type="text"
                      value={values.jaarlijksInkomen}
                      onChange={handleChange('jaarlijksInkomen')}
                      InputProps={{
                        startAdornment: '€',
                      }}
                    />
                  </Grid>
                )}

                {(values.verhuurType === 'box1' || values.verhuurType === 'bv') && (
                  <Grid item xs={12}>
                    <Alert severity="warning">
                      Let op: bij actieve verhuur of BV gelden andere belastingregels. Dit wordt in een volgende versie meegenomen.
                    </Alert>
                  </Grid>
                )}
              </>
            )}
          </Grid>
        </Grid>

        {/* Resultaten rechts */}
        <Grid item xs={12} lg={4}>
          <div style={{ position: 'sticky', top: isDesktop ? '76px' : '20px' }}>
            <Card elevation={3} sx={{ 
              background: 'linear-gradient(135deg, var(--md-sys-color-surface-container-low) 0%, var(--md-sys-color-surface-container) 100%)',
              border: '1px solid var(--md-sys-color-outline-variant)',
            }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{
                  color: 'primary.main',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  mb: 2,
                }}>
                  Resultaten
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="body1" sx={{ fontSize: '1rem', fontWeight: 500 }}>
                      Totale investering: <span style={{ color: 'var(--md-sys-color-primary)', fontWeight: 600 }}>€{resultaten.totaleInvestering.toLocaleString('nl-NL')}</span>
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body1" sx={{ fontSize: '1rem', fontWeight: 500 }}>
                      Eigen inbreng: <span style={{ color: 'var(--md-sys-color-primary)', fontWeight: 600 }}>€{resultaten.werkelijkeInbreng.toLocaleString('nl-NL')}</span>
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body1" sx={{ fontSize: '1rem', fontWeight: 500 }}>
                      Maandelijkse hypotheeklast: <span style={{ color: 'var(--md-sys-color-primary)', fontWeight: 600 }}>€{resultaten.maandelijkseHypotheekLast.toLocaleString('nl-NL')}</span>
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body1" sx={{ fontSize: '1rem', fontWeight: 500 }}>
                      Netto winst per maand: <span style={{ 
                        color: resultaten.nettoMaandOpbrengst >= 0 ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-error)', 
                        fontWeight: 600 
                      }}>€{resultaten.nettoMaandOpbrengst.toLocaleString('nl-NL')}</span>
                    </Typography>
                  </Grid>
                  {values.verhuurType === 'box3' && (
                    <Grid item xs={12}>
                      <Typography variant="body1" sx={{ fontSize: '1rem', fontWeight: 500 }}>
                        Box 3 belasting: <span style={{ color: 'var(--md-sys-color-tertiary)', fontWeight: 600 }}>€{resultaten.belasting.toLocaleString('nl-NL')}</span>
                      </Typography>
                    </Grid>
                  )}
                  <Grid item xs={12}>
                    <Typography variant="body1" sx={{ fontSize: '1.1rem', fontWeight: 600 }}>
                      Netto rendement: <span style={{ 
                        color: resultaten.nettoRendement >= 0 ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-error)',
                        fontSize: '1.2rem'
                      }}>{resultaten.nettoRendement.toFixed(2)}%</span>
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body1" sx={{ fontSize: '1rem', fontWeight: 500 }}>
                      Terugverdientijd: <span style={{ color: 'var(--md-sys-color-secondary)', fontWeight: 600 }}>{resultaten.terugverdientijd.toFixed(1)} jaar</span>
                    </Typography>
                  </Grid>
                  {parseFloat(values.waardestijging || '0') > 0 && (
                    <>
                      <Grid item xs={12}>
                        <Typography variant="body1" sx={{ fontSize: '1rem', fontWeight: 500 }}>
                          Waarde na 5 jaar: <span style={{ color: 'var(--md-sys-color-primary)', fontWeight: 600 }}>€{resultaten.waardeNa5Jaar.toLocaleString('nl-NL')}</span>
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body1" sx={{ fontSize: '1rem', fontWeight: 500 }}>
                          Totaal rendement (incl. waardestijging): <span style={{ color: 'var(--md-sys-color-primary)', fontWeight: 600 }}>{resultaten.totaalRendement.toFixed(2)}%</span>
                        </Typography>
                      </Grid>
                    </>
                  )}
                </Grid>
              </CardContent>
            </Card>
          </div>
        </Grid>
      </Grid>
    </Container>
  );
}; 