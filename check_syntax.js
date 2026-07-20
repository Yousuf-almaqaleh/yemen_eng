const fs = require('fs');
const path = require('path');
const vm = require('vm');

const files = [
    'requests.html',
    'request-details.html',
    'post-request.html',
    'engineer-details.html',
    'office-details.html',
    'assets/js/storage.js'
];

const basePath = 'c:\\Users\\lenovo\\Desktop\\web\\yemen-engineer';

files.forEach(file => {
    const filePath = path.join(basePath, file);
    if (!fs.existsSync(filePath)) {
        console.error(`File does not exist: ${filePath}`);
        return;
    }
    const content = fs.readFileSync(filePath, 'utf8');
    if (file.endsWith('.js')) {
        try {
            new vm.Script(content);
            console.log(`[OK] JS Syntax: ${file}`);
        } catch (err) {
            console.error(`[ERROR] JS Syntax in ${file}:`, err.message);
        }
    } else {
        const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
        let match;
        let index = 1;
        while ((match = scriptRegex.exec(content)) !== null) {
            const scriptContent = match[1];
            if (scriptContent.trim()) {
                try {
                    new vm.Script(scriptContent);
                    console.log(`[OK] Script #${index} in ${file}`);
                } catch (err) {
                    console.error(`[ERROR] Script #${index} in ${file}:`, err.message);
                }
            }
            index++;
        }
    }
});
