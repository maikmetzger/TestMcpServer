import GitController from '../../src/controllers/GitController.js';

describe('Git Commit History Tool', () => {
  it('should retrieve commit history', async () => {
    const controller = new GitController();
    const result = await controller.handleCommitHistory(1);
    expect(result.isError).toBe(false);
    expect(result.content[0].text.length).toBeGreaterThan(0);
  });
});
