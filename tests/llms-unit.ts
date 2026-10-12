import assert from 'node:assert/strict';
import { buildLlmsTxt, normalizeLlmsUrl, validateLlmsInput, type LlmsTxtInput } from '../lib/llmsTxt';

const validInput: LlmsTxtInput = {
  siteName: 'Acme [Studio]',
  siteUrl: 'acme.example',
  summary: 'Useful tools for teams.',
  guidance: 'Use the linked pages as the source of truth.\n\nDo not infer unsupported claims.',
  sections: [{
    id: 'about',
    title: 'About and contact',
    links: [
      { id: 'home', title: 'Home', url: 'https://acme.example/', description: 'Company overview.' },
      { id: 'work', title: 'Selected work', url: 'https://acme.example/work?type=web', description: '' }
    ]
  }]
};

assert.equal(normalizeLlmsUrl('example.com'), 'https://example.com/');
assert.equal(normalizeLlmsUrl('ftp://example.com'), null);
assert.equal(normalizeLlmsUrl('https://user:secret@example.com'), null);
assert.deepEqual(validateLlmsInput(validInput), { sectionTitles: {}, linkTitles: {}, linkUrls: {}, linkDescriptions: {} });

const output = buildLlmsTxt(validInput);
assert.ok(output.startsWith('# Acme \\[Studio\\]\n\n> Useful tools for teams\\.'));
assert.ok(output.includes('Canonical website: https://acme.example/'));
assert.ok(output.includes('## About and contact'));
assert.ok(output.includes('- [Home](https://acme.example/): Company overview\\.'));
assert.ok(output.includes('- [Selected work](https://acme.example/work?type=web)'));
assert.ok(output.includes('Use the linked pages as the source of truth\\.'));
assert.ok(output.endsWith('\n'));

const invalidInput: LlmsTxtInput = {
  ...validInput,
  siteName: '',
  siteUrl: 'javascript:alert(1)',
  summary: '',
  sections: [{ id: 'section-1', title: '', links: [{ id: 'link-1', title: '', url: 'bad url', description: '' }] }]
};
const errors = validateLlmsInput(invalidInput);
assert.ok(errors.siteName);
assert.ok(errors.siteUrl);
assert.ok(errors.summary);
assert.ok(errors.sectionTitles['section-1']);
assert.ok(errors.linkTitles['link-1']);
assert.ok(errors.linkUrls['link-1']);
const longDescription = validateLlmsInput({
  ...validInput,
  sections: [{ id: 'section-1', title: 'Pages', links: [{ id: 'link-1', title: 'Home', url: 'https://example.com', description: 'x'.repeat(241) }] }]
});
assert.ok(longDescription.linkDescriptions['link-1']);
assert.ok(!buildLlmsTxt({ ...validInput, sections: [{ id: 'empty', title: 'Empty', links: [{ id: 'blank', title: '', url: '', description: '' }] }] }).includes('## Empty'));

console.log('llms.txt builder checks passed');