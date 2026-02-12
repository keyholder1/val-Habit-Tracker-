const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

try {
    const envPath = path.join(process.cwd(), '.env.local');
    const envContent = fs.readFileSync(envPath, 'utf8');
    const env = {};
    envContent.split(/\r?\n/).forEach(line => {
        const firstEq = line.indexOf('=');
        if (firstEq !== -1) {
            const key = line.substring(0, firstEq).trim();
            const value = line.substring(firstEq + 1).trim().replace(/^"|"$/g, '');
            if (key) env[key] = value;
        }
    });

    console.log('Running npx prisma db push...');
    execSync('npx prisma db push', {
        stdio: 'inherit',
        env: { ...process.env, ...env }
    });
    console.log('Schema applied successfully.');
} catch (error) {
    console.error('Failed to apply schema:', error.message);
    process.exit(1);
}
