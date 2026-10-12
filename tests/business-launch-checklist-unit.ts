import assert from 'node:assert/strict';
import { createLaunchPlan, formatLaunchPlan, type LaunchAnswers } from '../lib/businessLaunchChecklist';

const ideaAnswers: LaunchAnswers = {
  stage: 'idea',
  offer: 'physical',
  salesMode: 'online',
  timing: 'soon',
  businessName: 'Bright Goods'
};

const ideaPlan = createLaunchPlan(ideaAnswers);
assert.ok(ideaPlan.summary.includes('check that real people want'));
assert.ok(ideaPlan.tasks.some((task) => task.id === 'describe-customer'));
assert.ok(ideaPlan.tasks.some((task) => task.id === 'product-delivery'));
assert.ok(ideaPlan.tasks.some((task) => task.id === 'online-ordering'));
assert.ok(ideaPlan.tasks.some((task) => task.id === 'business-admin' && task.link?.href.includes('gov.uk')));
assert.ok(ideaPlan.tasks.some((task) => task.id === 'first-customer' && task.title.includes('launch date')));

const relaunchPlan = createLaunchPlan({ ...ideaAnswers, stage: 'relaunch', offer: 'service', salesMode: 'in-person', timing: 'exploring' });
assert.ok(relaunchPlan.tasks.some((task) => task.id === 'review-what-changed'));
assert.ok(relaunchPlan.tasks.some((task) => task.id === 'service-process'));
assert.ok(relaunchPlan.tasks.some((task) => task.id === 'in-person-sales'));
assert.ok(!relaunchPlan.tasks.some((task) => task.id === 'online-ordering'));

const text = formatLaunchPlan(ideaAnswers, ideaPlan.tasks, ['describe-customer']);
assert.ok(text.startsWith('# Launch checklist: Bright Goods'));
assert.ok(text.includes('- [x] Describe who you want to help'));
assert.ok(text.includes('- [ ] Plan stock, delivery and returns'));
assert.ok(text.includes('https://www.gov.uk/set-up-business'));

console.log('business launch checklist checks passed');