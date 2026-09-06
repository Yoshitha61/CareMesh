import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const USERS_FILE = path.join(__dirname, "users.json");

// Ensure users file exists
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify([]));
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Auth APIs
  app.post("/api/auth/register", (req, res) => {
    const { email, password, name, role } = req.body;
    const users = JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));

    if (users.find((u: any) => u.email === email)) {
      return res.status(400).json({ error: "User already exists" });
    }

    const newUser = {
      id: `u${Date.now()}`,
      email,
      password, // In a real app, hash this!
      name,
      role
    };

    users.push(newUser);
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

    const { password: _, ...userWithoutPassword } = newUser;
    res.json(userWithoutPassword);
  });

  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    const users = JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));

    const user = users.find((u: any) => u.email === email && u.password === password);

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });

  // Mock Analysis API
  app.post("/api/analyze", (req, res) => {
    const { patientData, dosage } = req.body;
    
    // Simulate complex ML logic using fields from Diabetes and Heart Failure datasets
    const baseSuccess = 0.5 + Math.random() * 0.3;
    const ageFactor = (patientData.age / 100) * 0.1;
    const dosageFactor = (dosage / 100) * 0.2;
    
    // Heart failure factors
    const hfFactor = (60 - patientData.ejectionFraction) / 100; // Lower EF = higher risk
    const creatinineFactor = (patientData.serumCreatinine - 1.0) * 0.15;
    
    // Diabetes factors
    const diabetesFactor = patientData.A1Cresult === '>8' ? 0.2 : patientData.A1Cresult === '>7' ? 0.1 : 0;

    const treatments = [
      { 
        id: "drug-a", 
        name: "Drug A (Standard)", 
        success: Math.max(0.1, Math.min(0.95, baseSuccess + dosageFactor - diabetesFactor - ageFactor)), 
        risk: Math.min(0.95, 0.1 + ageFactor + creatinineFactor + (dosage > 75 ? 0.25 : 0)) 
      },
      { 
        id: "drug-b", 
        name: "Drug B (Targeted)", 
        success: Math.max(0.1, Math.min(0.98, baseSuccess * 1.2 - ageFactor - hfFactor + (dosageFactor * 0.5))), 
        risk: Math.min(0.95, 0.05 + (dosageFactor * 0.8) + hfFactor + creatinineFactor) 
      },
      { 
        id: "therapy-c", 
        name: "Gene Therapy C", 
        success: patientData.geneticMarkers.includes("BRCA1") ? 0.88 : 0.35, 
        risk: 0.1 + (patientData.smoking ? 0.15 : 0) + (dosage > 50 ? 0.2 : 0) + (ageFactor * 2)
      },
      { 
        id: "lifestyle-d", 
        name: "Lifestyle Mod + D", 
        success: Math.max(0.1, Math.min(0.92, (patientData.steps / 12000) * 0.5 + 0.2 - hfFactor - diabetesFactor)), 
        risk: 0.01 + (patientData.highBloodPressure ? 0.08 : 0) + (ageFactor * 0.5)
      }
    ];

    // Generate dynamic clinical alert with high granularity
    let clinicalAlert = "";
    let alertType: 'info' | 'warning' | 'critical' = 'info';

    if (dosage > 90) {
      clinicalAlert = `CRITICAL: Extreme dosage (${dosage}mg) detected. Immediate risk of hepatotoxicity and systemic failure for ${patientData.age}y patient.`;
      alertType = 'critical';
    } else if (dosage > 75) {
      clinicalAlert = `WARNING: High dosage (${dosage}mg). ${patientData.ejectionFraction < 40 ? 'Compromised cardiac output detected. ' : ''}Monitor for acute respiratory distress.`;
      alertType = 'critical';
    } else if (dosage > 60) {
      clinicalAlert = `CAUTION: Moderate-High dosage (${dosage}mg). ${patientData.smoking ? 'Smoking history increases pulmonary inflammation risk. ' : 'Observe for metabolic shifts.'}`;
      alertType = 'warning';
    } else if (dosage > 40) {
      clinicalAlert = `Optimal Range: Dosage of ${dosage}mg shows balanced efficacy. ${patientData.geneticMarkers.includes('BRCA1') ? 'Note: BRCA1 sensitivity is manageable at this level.' : 'Standard metabolic clearance expected.'}`;
      alertType = 'info';
    } else if (dosage > 20) {
      clinicalAlert = `Conservative Range: ${dosage}mg is likely sub-therapeutic for ${patientData.name}'s profile. Consider titration if response is limited.`;
      alertType = 'info';
    } else {
      clinicalAlert = `Micro-dosage: ${dosage}mg is below standard clinical thresholds. Primarily used for initial tolerance testing.`;
      alertType = 'info';
    }

    // Specific biomarker overrides
    if (patientData.serumCreatinine > 1.8 && dosage > 30) {
      clinicalAlert = `CRITICAL: Renal impairment (Creatinine: ${patientData.serumCreatinine}) prohibits dosage above 30mg. Current: ${dosage}mg.`;
      alertType = 'critical';
    } else if (patientData.A1Cresult === '>8' && dosage > 70) {
      clinicalAlert = `WARNING: Poor glycemic control (A1C > 8) may exacerbate side effects at ${dosage}mg.`;
      alertType = 'warning';
    }

    res.json({
      patientId: patientData.id,
      timestamp: new Date().toISOString(),
      recommendations: treatments,
      clinicalAlert,
      alertType,
      explanation: {
        topFactors: [
          { factor: "Genetic Marker BRCA1", impact: patientData.geneticMarkers.includes("BRCA1") ? 0.4 : -0.1 },
          { factor: "Ejection Fraction", impact: -hfFactor },
          { factor: "A1C Level", impact: -diabetesFactor },
          { factor: "Serum Creatinine", impact: -creatinineFactor },
          { factor: "Dosage Level", impact: -dosageFactor }
        ]
      }
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
