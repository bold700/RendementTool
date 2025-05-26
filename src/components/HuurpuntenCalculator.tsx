import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Button,
  Grid,
  Alert,
  Divider,
  Card,
  CardContent,
  useMediaQuery,
} from '@mui/material';

const energyLabels = [
  'A++++', 'A+++', 'A++', 'A+', 'A', 'B', 'C', 'D', 'E', 'F', 'G'
];

// WWS 2024 puntentabel
const wwsPuntenTabel = [
  { punten: 0, huur: 0 },
  { punten: 136, huur: 879.66 },
  { punten: 143, huur: 972.87 },
  { punten: 144, huur: 979.12 },
  { punten: 145, huur: 985.37 },
  { punten: 146, huur: 991.62 },
  { punten: 147, huur: 997.87 },
  { punten: 148, huur: 1004.12 },
  { punten: 149, huur: 1010.37 },
  { punten: 150, huur: 1016.62 },
  { punten: 160, huur: 1089.12 },
  { punten: 170, huur: 1161.62 },
  { punten: 180, huur: 1234.12 },
  { punten: 186, huur: 1276.87 },
  { punten: 200, huur: 1371.62 },
  { punten: 250, huur: 1704.12 },
];

const energyLabelPoints = {
  'A++++': 56,
  'A+++': 54,
  'A++': 52,
  'A+': 50,
  'A': 44,
  'B': 32,
  'C': 20,
  'D': 10,
  'E': 6,
  'F': 2,
  'G': 0,
};

function getMaxHuur(punten: number) {
  let max = wwsPuntenTabel[0].huur;
  for (let i = 0; i < wwsPuntenTabel.length; i++) {
    if (punten >= wwsPuntenTabel[i].punten) {
      max = wwsPuntenTabel[i].huur;
    } else {
      break;
    }
  }
  return max;
}

function getSector(punten: number) {
  if (punten < 143) return 'Sociale huur';
  if (punten <= 186) return 'Gereguleerde middenhuur';
  return 'Vrije sector';
}

export const HuurpuntenCalculator: React.FC = () => {
  const [form, setForm] = useState({
    oppervlakte: '',
    woz: '',
    energy: '',
    aanrecht: '',
    keuken: { koelkast: false, oven: false, vaatwasser: false, afzuigkap: false },
    toiletten: '',
    badkamers: '',
    extraSanitair: { wastafel: false, tweedeDouche: false },
    buiten: { balkon: false, tuin: false, dakterras: false },
    verwarming: '',
    woningtype: '',
  });
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<any>(null);
  const isDesktop = useMediaQuery('(min-width:600px)');

  // Functie voor berekenen (puur, zonder side effects)
  const berekenResultaten = () => {
    const oppervlakte = Math.max(0, Number(form.oppervlakte));
    const woz = Math.max(0, Number(form.woz));
    const aanrecht = Math.max(0, Number(form.aanrecht));
    const toiletten = Math.max(0, Number(form.toiletten));
    const badkamers = Math.max(0, Number(form.badkamers));

    // Alleen berekenen als minimaal oppervlakte is ingevuld
    if (!oppervlakte) {
      return null;
    }

    let punten = oppervlakte;
    punten += energyLabelPoints[form.energy] || 0;
    
    if (aanrecht >= 100 && aanrecht <= 150) punten += 1;
    if (aanrecht > 150) punten += 2;
    if (form.keuken.koelkast) punten += 1;
    if (form.keuken.oven) punten += 2;
    if (form.keuken.vaatwasser) punten += 2;
    if (form.keuken.afzuigkap) punten += 1;
    
    punten += toiletten * 2;
    punten += badkamers * 3;
    if (form.extraSanitair.wastafel) punten += 1;
    if (form.extraSanitair.tweedeDouche) punten += 1;
    
    if (form.buiten.balkon) punten += 2;
    if (form.buiten.tuin) punten += 2;
    if (form.buiten.dakterras) punten += 2;
    
    if (form.verwarming === 'cv') punten += 2;
    if (form.verwarming === 'hr') punten += 4;
    
    let wozPunten = 0;
    if (oppervlakte > 0 && woz > 0) {
      wozPunten = (woz / oppervlakte) / 242;
      let puntenZonderWOZ = punten;
      let maxWOZ = puntenZonderWOZ / 2;
      if (wozPunten > maxWOZ) wozPunten = maxWOZ;
      punten += wozPunten;
    }
    
    punten = Math.round(punten);
    const maxHuur = getMaxHuur(punten);
    const sector = getSector(punten);
    
    return { punten, maxHuur, sector };
  };

  // Auto-berekenen bij veranderingen
  useEffect(() => {
    const resultaat = berekenResultaten();
    setResult(resultaat);
    setShowResult(!!resultaat);
  }, [form]);

  const handleChange = (field: string, value: any) => {
    setForm(f => ({ ...f, [field]: value }));
  };

  const handleNestedChange = (group: string, field: string, value: any) => {
    setForm(f => ({ ...f, [group]: { ...f[group], [field]: value } }));
  };

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Huurpunten Calculator (WWS 2024)
      </Typography>

      <Grid container spacing={4}>
        {/* Formulier links */}
        <Grid item xs={12} lg={8}>
          <Typography variant="body1" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
            Deze calculator is gebaseerd op het officiële Woningwaarderingsstelsel (WWS) van 2024. De uitkomst bepaalt welke huur je mag vragen en of je gebonden bent aan maximale prijzen.
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Woonoppervlakte (m²)"
                type="number"
                fullWidth
                required
                inputProps={{ min: 0 }}
                value={form.oppervlakte}
                onChange={e => handleChange('oppervlakte', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="WOZ-waarde (€)"
                type="number"
                fullWidth
                required
                inputProps={{ min: 0, step: 1 }}
                value={form.woz}
                onChange={e => handleChange('woz', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Energielabel</InputLabel>
                <Select
                  label="Energielabel"
                  value={form.energy}
                  onChange={e => handleChange('energy', e.target.value)}
                >
                  {energyLabels.map(label => (
                    <MenuItem key={label} value={label}>{label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Aanrechtlengte (cm)"
                type="number"
                fullWidth
                inputProps={{ min: 0 }}
                value={form.aanrecht}
                onChange={e => handleChange('aanrecht', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Keukenapparatuur</Typography>
              <FormGroup row>
                <FormControlLabel 
                  control={<Checkbox checked={form.keuken.koelkast} onChange={e => handleNestedChange('keuken', 'koelkast', e.target.checked)} />} 
                  label="Koelkast" 
                />
                <FormControlLabel 
                  control={<Checkbox checked={form.keuken.oven} onChange={e => handleNestedChange('keuken', 'oven', e.target.checked)} />} 
                  label="Oven" 
                />
                <FormControlLabel 
                  control={<Checkbox checked={form.keuken.vaatwasser} onChange={e => handleNestedChange('keuken', 'vaatwasser', e.target.checked)} />} 
                  label="Vaatwasser" 
                />
                <FormControlLabel 
                  control={<Checkbox checked={form.keuken.afzuigkap} onChange={e => handleNestedChange('keuken', 'afzuigkap', e.target.checked)} />} 
                  label="Afzuigkap" 
                />
              </FormGroup>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Aantal toiletten"
                type="number"
                fullWidth
                inputProps={{ min: 0 }}
                value={form.toiletten}
                onChange={e => handleChange('toiletten', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Aantal badkamers"
                type="number"
                fullWidth
                inputProps={{ min: 0 }}
                value={form.badkamers}
                onChange={e => handleChange('badkamers', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2" gutterBottom>Extra sanitair</Typography>
              <FormGroup>
                <FormControlLabel 
                  control={<Checkbox checked={form.extraSanitair.wastafel} onChange={e => handleNestedChange('extraSanitair', 'wastafel', e.target.checked)} />} 
                  label="Wastafel op slaapkamer" 
                />
                <FormControlLabel 
                  control={<Checkbox checked={form.extraSanitair.tweedeDouche} onChange={e => handleNestedChange('extraSanitair', 'tweedeDouche', e.target.checked)} />} 
                  label="2e douche/voorziening" 
                />
              </FormGroup>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>Buitenruimte</Typography>
              <FormGroup row>
                <FormControlLabel 
                  control={<Checkbox checked={form.buiten.balkon} onChange={e => handleNestedChange('buiten', 'balkon', e.target.checked)} />} 
                  label="Balkon" 
                />
                <FormControlLabel 
                  control={<Checkbox checked={form.buiten.tuin} onChange={e => handleNestedChange('buiten', 'tuin', e.target.checked)} />} 
                  label="Tuin" 
                />
                <FormControlLabel 
                  control={<Checkbox checked={form.buiten.dakterras} onChange={e => handleNestedChange('buiten', 'dakterras', e.target.checked)} />} 
                  label="Dakterras" 
                />
              </FormGroup>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Verwarming</InputLabel>
                <Select
                  label="Verwarming"
                  value={form.verwarming}
                  onChange={e => handleChange('verwarming', e.target.value)}
                >
                  <MenuItem value="cv">CV</MenuItem>
                  <MenuItem value="hr">HR-ketel</MenuItem>
                  <MenuItem value="geen">Geen verwarming</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Type woning</InputLabel>
                <Select
                  label="Type woning"
                  value={form.woningtype}
                  onChange={e => handleChange('woningtype', e.target.value)}
                >
                  <MenuItem value="appartement">Appartement</MenuItem>
                  <MenuItem value="eengezinswoning">Eengezinswoning</MenuItem>
                </Select>
              </FormControl>
            </Grid>
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
                
                {result ? (
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="body1" sx={{ fontSize: '1.1rem', fontWeight: 600 }}>
                        Totaal aantal punten: <span style={{ color: 'var(--md-sys-color-primary)' }}>{result.punten}</span>
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body1" sx={{ fontSize: '1.1rem', fontWeight: 600 }}>
                        Maximale kale huur: <span style={{ color: 'var(--md-sys-color-primary)' }}>€{result.maxHuur.toFixed(2)}</span>
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body1" sx={{ fontSize: '1.1rem', fontWeight: 600 }}>
                        Sector: <span style={{ 
                          color: result.sector === 'Sociale huur' ? 'var(--md-sys-color-tertiary)' : 
                                result.sector === 'Gereguleerde middenhuur' ? 'var(--md-sys-color-secondary)' : 
                                'var(--md-sys-color-primary)'
                        }}>{result.sector}</span>
                      </Typography>
                    </Grid>
                  </Grid>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Vul de woonoppervlakte in om te beginnen met berekenen.
                  </Typography>
                )}
              </CardContent>
            </Card>
          </div>
        </Grid>
      </Grid>
    </Container>
  );
}; 