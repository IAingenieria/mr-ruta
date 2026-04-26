const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const distDir = path.join(__dirname, 'dist');

// Crear carpeta dist si no existe
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Copiar archivos HTML estáticos
const staticFiles = [
  'MrRuta_Website_Final.html',
  'formulario.html',
  'cuestionario.html'
];

console.log('Copiando archivos estáticos...');
staticFiles.forEach(file => {
  const src = path.join(__dirname, file);
  const dest = path.join(distDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`✓ ${file}`);
  }
});

// Build del CRM
console.log('\nBuildando CRM...');
const crmDir = path.join(__dirname, 'CRM Hub', 'digital-hub-crm');
process.chdir(crmDir);

try {
  execSync('npm install', { stdio: 'inherit' });
  execSync('npm run build', { stdio: 'inherit' });
  console.log('\n✓ Build completado exitosamente');
} catch (error) {
  console.error('Error durante el build:', error.message);
  process.exit(1);
}
