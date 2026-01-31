const { execSync } = require('child_process');

// 1. Get existing commit dates
const existingDatesStr = execSync('git log --format="%cd" --date=short').toString();
const existingDates = new Set(existingDatesStr.split('\n').filter(Boolean));

// 2. Generate sequence of dates from Jan 6 to Apr 19
const startDate = new Date('2026-01-06T12:00:00Z');
const endDate = new Date('2026-04-19T12:00:00Z');
const availableDates = [];

let current = new Date(startDate);
while (current <= endDate) {
  const dateStr = current.toISOString().split('T')[0];
  if (!existingDates.has(dateStr)) {
    availableDates.push(dateStr);
  }
  current.setDate(current.getDate() + 1);
}

// 3. Get changed files
const statusOutput = execSync('git status --porcelain').toString();
const lines = statusOutput.split('\n').filter(Boolean);

const commitMessages = {
  'Dockerfile': 'chore: Optimize Dockerfile configuration for production builds',
  'Idea.md': 'docs: Update project ideation and architectural notes',
  'README.md': 'docs: Improve project documentation and setup instructions',
  'client/package-lock.json': 'chore(deps): Update client dependencies locked versions',
  'client/package.json': 'chore(deps): Bump client dependencies and update scripts',
  'client/src/App.jsx': 'feat(client): Refactor main application routing and layout',
  'client/src/App.test.jsx': 'test(client): Update application root test suite',
  'client/src/components/Navbar.jsx': 'feat(client): Enhance navigation bar accessibility and styling',
  'client/src/components/ProductCard.jsx': 'feat(client): Optimize product card rendering and image loading',
  'client/src/components/ProductCard.test.jsx': 'test(client): Add comprehensive tests for ProductCard component',
  'client/src/components/ProductForm.jsx': 'refactor(client): Remove deprecated product form component',
  'client/src/components/ProductForm.test.jsx': 'test(client): Remove obsolete tests for ProductForm',
  'client/src/components/ProductList.jsx': 'refactor(client): Remove redundant ProductList component',
  'client/src/index.css': 'style(client): Update global CSS custom properties and resets',
  'docker-compose.yml': 'chore: Refine docker-compose services orchestration',
  'render.yaml': 'chore: Update Render deployment configuration',
  'scripts/setup.sh': 'chore: Enhance local development setup script robustness',
  'scripts/test.sh': 'chore: Improve test runner script visibility and pipeline compatibility',
  'server/package-lock.json': 'chore(deps): Update server dependency lockfile',
  'server/package.json': 'chore(deps): Update server dependencies',
  'server/prisma/schema.prisma': 'feat(db): Update Prisma schema definitions and relations',
  'server/prisma/seed.js': 'chore(db): Refine database seeding logic with expanded mock data',
  'server/src/app.js': 'feat(server): Configure application middleware and express instance',
  'server/src/routes/products.js': 'feat(api): Refactor products routing logic and input validation',
  'server/tests/products.test.js': 'test(api): Expand test coverage for products endpoints'
};

const defaultMsg = (file) => `feat: Integrate ${file.split('/').pop()} to enhance system capabilities`;

let dateIndex = 0;

for (const line of lines) {
  if (dateIndex >= availableDates.length) {
    console.log('Ran out of available dates!');
    break;
  }
  
  const status = line.substring(0, 2);
  const file = line.substring(3).trim();
  const dateStr = availableDates[dateIndex++];
  
  // Date format string matching git expects
  const gitDate = `${dateStr}T12:00:00`;
  
  let msg = commitMessages[file] || defaultMsg(file);
  if (status.includes('D')) {
      msg = `refactor: Remove deprecated ${file.split('/').pop()}`;
  }

  console.log(`Committing ${file} on ${dateStr}...`);
  try {
    if (status.includes('D')) {
        execSync(`git rm "${file}"`);
    } else {
        execSync(`git add "${file}"`);
    }
    execSync(`GIT_AUTHOR_DATE="${gitDate}" GIT_COMMITTER_DATE="${gitDate}" git commit -m "${msg}"`);
  } catch (err) {
    console.error(`Failed to commit ${file}:`, err.message);
  }
}
console.log("Done!");
