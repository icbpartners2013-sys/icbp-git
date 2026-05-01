const fs = require('fs');
const path = require('path');

const dirs = [
    'src/pages/client/personal',
    'src/pages/client/business',
    'src/pages/client/cipc',
    'src/pages/client/features',
    'src/pages/staff/features'
];

dirs.forEach(d => {
    const fullPath = path.join(__dirname, d);
    if (fs.existsSync(fullPath)) {
        const files = fs.readdirSync(fullPath).filter(f => f.endsWith('.tsx'));
        files.forEach(file => {
            const filepath = path.join(fullPath, file);
            const basename = path.basename(file, '.tsx');
            const depth = d.split('/').length - 1; // e.g., src/pages/client/personal -> 4 segments. From there to root is 3 dots?
            // Actually: src is 0, pages is 1, client is 2, personal is 3. So depth is 3.
            // But we want to go from personal to components. So `../../../components/PuckPageRenderer`
            const relativeDots = '../'.repeat(depth);
            const content = `import PuckPageRenderer from '${relativeDots}components/PuckPageRenderer';\n\nexport default function ${basename}() {\n  return <PuckPageRenderer title="${basename}" />;\n}\n`;
            fs.writeFileSync(filepath, content);
        });
    }
});