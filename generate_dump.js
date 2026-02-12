const fs = require('fs');
const path = require('path');

const rootDir = 'c:/Users/samcl/Downloads/Val';
const outputFile = 'C:/Users/samcl/.gemini/antigravity/brain/654b4abc-2a73-4f0d-84df-2a0dfef821a6/project_dump.md';

const ignoreDirs = new Set(['node_modules', '.next', '.git', '.vscode', 'coverage', 'dist', 'build']);
const ignoreFiles = new Set(['package-lock.json', 'yarn.lock', '.DS_Store', '.env.local', '.env', 'project_dump.md', 'generate_dump.js']);

const allowedExtensions = new Set(['.ts', '.tsx', '.js', '.jsx', '.json', '.css', '.md', '.prisma', '.mjs']);

function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);

    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function (file) {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (!ignoreDirs.has(file)) {
                console.log(`Scanning dir: ${file}`);
                arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
            }
        } else {
            if (!ignoreFiles.has(file)) {
                arrayOfFiles.push(fullPath);
            }
        }
    });

    return arrayOfFiles;
}

const allFiles = getAllFiles(rootDir);

let outputContent = '# Full Project Dump\n\n';

// 1. File Tree
outputContent += '## 1️⃣ Full Project Folder Tree\n\n```\n';
allFiles.forEach(f => {
    const relativePath = path.relative(rootDir, f).replace(/\\/g, '/');
    outputContent += `${relativePath}\n`;
});
outputContent += '```\n\n';

// 2. File Contents
outputContent += '## 2️⃣ File Contents\n\n';

const priorityFiles = [
    'package.json',
    'tsconfig.json',
    'tailwind.config.ts',
    'postcss.config.js',
    'next.config.mjs',
    'middleware.ts',
    '.env.local' // Special handling for example
];

// Sort to put priority files first, then alphabetical
allFiles.sort((a, b) => {
    const nameA = path.basename(a);
    const nameB = path.basename(b);
    const isPriorityA = priorityFiles.includes(nameA);
    const isPriorityB = priorityFiles.includes(nameB);

    if (isPriorityA && !isPriorityB) return -1;
    if (!isPriorityA && isPriorityB) return 1;
    return a.localeCompare(b);
});

allFiles.forEach(f => {
    const relativePath = path.relative(rootDir, f).replace(/\\/g, '/');
    const ext = path.extname(f);

    // Skip if binary or not allowed extension (mostly to avoid media files)
    if (!allowedExtensions.has(ext) && !priorityFiles.includes(path.basename(f))) {
        return;
    }

    // Special handling for .env.local -> .env.example
    let headerName = relativePath;
    let content = fs.readFileSync(f, 'utf8');

    if (path.basename(f) === '.env.local') {
        headerName = '.env.example';
        // Replace secrets with placeholders
        content = content.replace(/=".+"/g, '="YOUR_SECRET_HERE"');
        content = content.replace(/postgresql:\/\/.+@/, 'postgresql://USER:PASSWORD@');
    }

    outputContent += `===== FILE: ${headerName} =====\n`;
    outputContent += `${content}\n\n`;
});

fs.writeFileSync(outputFile, outputContent);
console.log(`Dump generated at ${outputFile}`);
