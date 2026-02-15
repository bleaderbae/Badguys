const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validEmails = [
  'user@example.com',
  'user.name@example.co.uk',
  'user+tag@example.org',
  '123@example.com',
];

const invalidEmails = [
  'plainaddress',
  '@example.com',
  'Joe Smith <email@example.com>',
  'email.example.com',
  'email@example@example.com',
  '.email@example.com',
  'email.@example.com',
  'email..email@example.com',
  'email@example.com (Joe Smith)',
  'email@example',
  'email@-example.com',
  'email@example.web',
  'email@111.222.333.44444',
  'email@example..com',
  'Abc..123@example.com',
];

const potentiallyDangerous = [
  'a'.repeat(1000) + '@example.com', // Long local part
  'user@' + 'a'.repeat(1000) + '.com', // Long domain
  '<script>alert("xss")</script>@example.com', // XSS attempt
];

console.log('--- Valid Emails ---');
validEmails.forEach(email => {
  const isValid = emailRegex.test(email);
  console.log(`${email}: ${isValid ? 'PASS' : 'FAIL'}`);
});

console.log('\n--- Invalid Emails ---');
invalidEmails.forEach(email => {
  const isValid = emailRegex.test(email);
  console.log(`${email}: ${isValid ? 'FAIL (Expected)' : 'PASS (Unexpected)'}`);
});

console.log('\n--- Dangerous Inputs ---');
potentiallyDangerous.forEach(email => {
    const start = process.hrtime();
    const isValid = emailRegex.test(email);
    const end = process.hrtime(start);
    const timeInMs = (end[0] * 1000 + end[1] / 1e6).toFixed(3);
    console.log(`${email.substring(0, 20)}...: Valid=${isValid}, Time=${timeInMs}ms`);
});
