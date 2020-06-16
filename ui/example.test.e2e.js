describe('initial runs', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:9080');
  });

  it('should display "something"', async () => {
    await page.waitForSelector('#nic');
  });
});
