import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const rootDir = path.dirname(__filename);
const zipName = 'ajmalrifa-invitation.zip';
const zipPath = path.join(rootDir, zipName);

console.log('📦 Starting project zip packaging...');
console.log(`📁 Target Archive: ${zipName}`);

// Remove previous zip if it exists
if (fs.existsSync(zipPath)) {
  try {
    fs.unlinkSync(zipPath);
    console.log('🗑️  Removed existing archive.');
  } catch (err) {
    console.warn('⚠️  Could not remove previous archive:', err.message);
  }
}

let success = false;

// Method 1: Using built-in tar (available natively in Windows 10/11, macOS, and Linux)
try {
  console.log('⚙️  Compressing files (excluding node_modules and .git)...');
  execSync(
    `tar -a -c -f "${zipName}" --exclude="node_modules" --exclude=".git" --exclude="${zipName}" .`,
    { cwd: rootDir, stdio: 'inherit' }
  );
  if (fs.existsSync(zipPath)) {
    success = true;
  }
} catch (tarErr) {
  console.log('ℹ️  tar command failed or unavailable, trying Python fallback...');
}

// Method 2: Python zipfile fallback
if (!success) {
  try {
    const pyScript = `
import os, zipfile
root = r"${rootDir}"
out = r"${zipPath}"
exclude_dirs = {"node_modules", ".git"}
exclude_files = {"${zipName}"}
with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as z:
    for base, dirs, files in os.walk(root):
        dirs[:] = [d for d in dirs if d not in exclude_dirs]
        for f in files:
            if f not in exclude_files:
                fp = os.path.join(base, f)
                rel = os.path.relpath(fp, root)
                z.write(fp, rel)
`;
    execSync(`python -c "${pyScript.replace(/\n/g, ' ')}"`, { cwd: rootDir, stdio: 'inherit' });
    if (fs.existsSync(zipPath)) {
      success = true;
    }
  } catch (pyErr) {
    console.log('ℹ️  Python fallback failed or unavailable, trying PowerShell...');
  }
}

// Method 3: PowerShell fallback
if (!success) {
  try {
    const psCmd = `powershell -Command "Get-ChildItem -Path . -Exclude 'node_modules','.git','${zipName}' | Compress-Archive -DestinationPath '${zipName}' -Force"`;
    execSync(psCmd, { cwd: rootDir, stdio: 'inherit' });
    if (fs.existsSync(zipPath)) {
      success = true;
    }
  } catch (psErr) {
    console.error('❌ Error: Could not create zip using any method.', psErr.message);
    process.exit(1);
  }
}

if (fs.existsSync(zipPath)) {
  const stats = fs.statSync(zipPath);
  const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`✅ Success! Zip created successfully:`);
  console.log(`   File: ${zipName}`);
  console.log(`   Path: ${zipPath}`);
  console.log(`   Size: ${sizeMB} MB (${stats.size.toLocaleString()} bytes)`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
} else {
  console.error('❌ Failed to verify created zip archive.');
  process.exit(1);
}
