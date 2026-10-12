export type BusinessStage = 'idea' | 'preparing' | 'trading' | 'relaunch';
export type OfferType = 'service' | 'physical' | 'digital' | 'undecided';
export type SalesMode = 'online' | 'in-person' | 'both' | 'undecided';
export type LaunchTiming = 'soon' | 'few-months' | 'exploring';
export type ChecklistGroup = 'Get clear' | 'Get ready' | 'Open the doors' | 'Learn and improve';

export interface LaunchAnswers {
  stage: BusinessStage;
  offer: OfferType;
  salesMode: SalesMode;
  timing: LaunchTiming;
  businessName: string;
}

export interface LaunchTask {
  id: string;
  group: ChecklistGroup;
  title: string;
  detail: string;
  action: string;
  link?: { label: string; href: string };
}

const SETUP_LINK = { label: 'Read the UK government start-up guide', href: 'https://www.gov.uk/set-up-business' };

export function createLaunchPlan(answers: LaunchAnswers): { summary: string; tasks: LaunchTask[] } {
  const summaryByStage: Record<BusinessStage, string> = {
    idea: 'Start small: check that real people want the offer before spending heavily on setup.',
    preparing: 'Focus on the essentials that let you confidently serve your first customers.',
    trading: 'Build on what already works and choose one practical area to improve next.',
    relaunch: 'Use what you have learned so far to make the next version clearer and easier to buy.'
  };

  const tasks: LaunchTask[] = [];

  if (answers.stage === 'relaunch') {
    tasks.push({
      id: 'review-what-changed',
      group: 'Get clear',
      title: 'Decide what needs to be different this time',
      detail: 'Look at customer feedback, sales and the parts of the business that felt difficult.',
      action: 'Write down one thing to keep, one thing to change and one thing to stop.'
    });
  } else if (answers.stage === 'trading') {
    tasks.push({
      id: 'choose-next-goal',
      group: 'Get clear',
      title: 'Choose one goal for the next few months',
      detail: 'A clear focus makes it easier to decide what deserves your time and money.',
      action: 'Pick one: more enquiries, more repeat customers, a better offer or smoother day-to-day work.'
    });
  } else {
    tasks.push({
      id: 'describe-customer',
      group: 'Get clear',
      title: 'Describe who you want to help',
      detail: 'A specific customer and need make the offer easier to explain.',
      action: 'Finish this sentence: “I help ___ who need ___ by offering ___.”'
    });
  }

  if (answers.offer === 'undecided') {
    tasks.push({
      id: 'choose-first-offer',
      group: 'Get clear',
      title: 'Choose one simple first offer',
      detail: 'You can expand later. Start with something you can explain and deliver well.',
      action: 'Write down what the customer gets, who it is for and what is not included.'
    });
  } else {
    tasks.push({
      id: 'test-the-offer',
      group: 'Get clear',
      title: answers.stage === 'idea' ? 'Ask potential customers about the idea' : 'Ask customers what would make the offer clearer',
      detail: 'Friendly conversations can reveal questions and concerns before you invest more time.',
      action: answers.stage === 'idea'
        ? 'Speak to five people who fit your audience. Ask about their needs before pitching your idea.'
        : 'Ask three customers what helped them choose you and what nearly stopped them.'
    });
  }

  tasks.push({
    id: 'check-the-numbers',
    group: 'Get ready',
    title: 'Work out the basic numbers',
    detail: 'Know what it costs to provide the offer and what you need to bring in.',
    action: 'List your regular costs, cost per sale and a realistic starting price. Get qualified advice for tax or financial decisions.'
  });

  tasks.push({
    id: 'business-admin',
    group: 'Get ready',
    title: 'Check which business setup steps apply to you',
    detail: 'Registration, records, insurance and permissions depend on your circumstances and what you do.',
    action: 'Use the official guide, then confirm any tax, legal or regulated-industry requirements with a qualified adviser.',
    link: SETUP_LINK
  });

  if (answers.offer === 'physical') {
    tasks.push({
      id: 'product-delivery',
      group: 'Get ready',
      title: 'Plan stock, delivery and returns',
      detail: 'Customers need to know what is available, when it will arrive and what happens if plans change.',
      action: 'Write down how you will store, package and deliver the first orders, and how you will handle returns.'
    });
  } else if (answers.offer === 'digital') {
    tasks.push({
      id: 'digital-delivery',
      group: 'Get ready',
      title: 'Make digital delivery easy to understand',
      detail: 'Explain what the customer receives and how they access it after paying.',
      action: 'Test the purchase and delivery steps yourself, including the confirmation email and help contact.'
    });
  } else if (answers.offer === 'service') {
    tasks.push({
      id: 'service-process',
      group: 'Get ready',
      title: 'Set expectations before the work starts',
      detail: 'A clear scope and next step help both you and the customer know what to expect.',
      action: 'Write down what is included, how a customer books, how long it takes and how changes are handled.'
    });
  }

  if (answers.salesMode === 'online' || answers.salesMode === 'both') {
    tasks.push({
      id: 'online-ordering',
      group: 'Get ready',
      title: 'Test how someone will enquire or buy online',
      detail: 'A customer should be able to understand the offer and complete the next step without getting stuck.',
      action: 'Ask someone unfamiliar with the business to try the website, booking or payment process on their phone.'
    });
  }

  if (answers.salesMode === 'in-person' || answers.salesMode === 'both') {
    tasks.push({
      id: 'in-person-sales',
      group: 'Get ready',
      title: 'Prepare for an in-person sale',
      detail: 'Make it simple to explain the offer, take payment and follow up afterwards.',
      action: 'Prepare a short explanation, a way to take payment and a way to capture customer questions or feedback.'
    });
  }

  if (answers.salesMode === 'undecided') {
    tasks.push({
      id: 'choose-sales-route',
      group: 'Get ready',
      title: 'Choose the easiest way to make your first sale',
      detail: 'You do not need every channel on day one.',
      action: 'Choose one starting route: direct conversations, local visits, a simple website, a marketplace or referrals.'
    });
  }

  tasks.push({
    id: 'tell-people',
    group: 'Open the doors',
    title: answers.stage === 'trading' ? 'Tell existing customers what is changing' : 'Tell people clearly what you offer',
    detail: 'People are more likely to act when the offer and next step are easy to understand.',
    action: 'Prepare one short description, one useful photo or example and a clear way to contact or buy.'
  });

  tasks.push({
    id: 'first-customer',
    group: 'Open the doors',
    title: answers.timing === 'soon' ? 'Set one small launch date' : 'Choose a simple first-customer milestone',
    detail: 'A small, achievable milestone helps turn preparation into action.',
    action: answers.timing === 'soon'
      ? 'Pick a date and list only the essentials that must be ready before it.'
      : 'For example: have five customer conversations, make one test sale or book one first appointment.'
  });

  tasks.push({
    id: 'review-and-adjust',
    group: 'Learn and improve',
    title: 'Review what customers do and ask',
    detail: 'The first version is a chance to learn, not a test you have to get perfect.',
    action: 'After your first few sales or conversations, note what people asked, where they found you and what you should change.'
  });

  return { summary: summaryByStage[answers.stage], tasks };
}

export function formatLaunchPlan(answers: LaunchAnswers, tasks: LaunchTask[], checkedIds: string[]): string {
  const title = answers.businessName.trim() ? `Launch checklist: ${answers.businessName.trim()}` : 'My business launch checklist';
  const lines = [`# ${title}`, '', 'General planning guide. Check local rules and get qualified advice where needed.', ''];

  for (const group of ['Get clear', 'Get ready', 'Open the doors', 'Learn and improve'] as ChecklistGroup[]) {
    const groupTasks = tasks.filter((task) => task.group === group);
    if (groupTasks.length === 0) continue;
    lines.push(`## ${group}`, '');
    for (const task of groupTasks) {
      lines.push(`- [${checkedIds.includes(task.id) ? 'x' : ' '}] ${task.title}`, `  ${task.action}`);
      if (task.link) lines.push(`  ${task.link.label}: ${task.link.href}`);
    }
    lines.push('');
  }

  return `${lines.join('\n').trimEnd()}\n`;
}