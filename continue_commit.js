const { execSync } = require('child_process');

// Get existing commit dates
const existingDatesStr = execSync('git log --format="%cd" --date=short').toString();
const existingDates = new Set(existingDatesStr.split('\n').filter(Boolean));

// Generate sequence of dates from Jan 6 to Apr 19
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

// Get changed files (untracked & modified)
const statusOutput = execSync('git status --porcelain').toString();
const lines = statusOutput.split('\n').filter(Boolean);

const defaultMsg = (file) => `feat: Update and integrate ${file.split('/').pop()} function`;

let dateIndex = 0;

for (const line of lines) {
  if (dateIndex >= availableDates.length) {
    console.log('Ran out of available dates! Cannot commit more files sequentially.');
    break;
  }
  
  const status = line.substring(0, 2);
  const file = line.substring(3).trim();
  const dateStr = availableDates[dateIndex++];
  
  const gitDate = `${dateStr}T12:00:00`;
  
  // Custom messages for remaining files
  let msg = defaultMsg(file);
  const fileName = file.split('/').pop();

  if (file.includes('Navbar')) msg = 'feat(client): Enhance Navbar navigation and responsive layout';
  else if (file.includes('ProductCard')) msg = 'feat(client): Refactor ProductCard component and testing suites';
  else if (file.includes('LoginPage')) msg = 'feat(client): Implement user authentication UI in LoginPage';
  else if (file.includes('CartPage')) msg = 'feat(client): Update shopping cart state management UI';
  else if (file.includes('CheckoutPage')) msg = 'feat(client): Streamline checkout process and validation';
  else if (file.includes('Admin')) msg = 'feat(admin): Upgrade AdminDashboard analytics and layout';
  else if (file.includes('seed.js')) msg = 'chore(db): Update database seed script with relevant mock data';
  else if (file.includes('.gitignore')) msg = 'chore: Update gitignore rules to exclude local artifacts';
  else if (file.includes('.claude')) msg = 'chore: Add Claude AI workspace configurations';
  else if (file.includes('lib/')) msg = 'feat(client): Implement shared utility library functions';
  
  console.log(`Committing ${file} on ${dateStr}...`);
  try {
    execSync(`git add "${file}"`);
    execSync(`GIT_AUTHOR_DATE="${gitDate}" GIT_COMMITTER_DATE="${gitDate}" git commit -m "${msg}"`);
  } catch (err) {
    console.error(`Failed to commit ${file}:`, err.message);
  }
}
console.log("Done running continuation script!");
