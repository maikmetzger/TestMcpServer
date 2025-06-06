import GitController from '../../src/controllers/GitController.js';

describe('Git Diff Tool', () => {
  it('should show no diff for clean HEAD', async () => {
    const controller = new GitController();
    const result = await controller.handleDiff('HEAD', 'HEAD');
    expect(result.isError).toBe(false);
    expect(result.content[0].text).toContain('No diff');
  });
});
