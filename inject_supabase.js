const fs = require('fs');
const path = require('path');

const dir = 'c:\\Users\\lenovo\\Desktop\\web\\yemen-engineer';
const htmlFiles = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const OLD_SCRIPT = '<script src="assets/js/storage.js"></script>';
const NEW_SCRIPTS = `<script src="assets/js/supabase-config.js"></script>\n    <script src="assets/js/storage.js"></script>`;

let updatedCount = 0;
htmlFiles.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes(OLD_SCRIPT) && !content.includes('supabase-config.js')) {
        content = content.replace(OLD_SCRIPT, NEW_SCRIPTS);
        fs.writeFileSync(filePath, content, 'utf8');
        updatedCount++;
        console.log(`[OK] Updated: ${file}`);
    } else {
        console.log(`[SKIP] Already updated or no match: ${file}`);
    }
});
console.log(`\nDone. Updated ${updatedCount} files.`);
