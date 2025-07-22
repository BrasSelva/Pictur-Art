const CodeTemporaire = require('../models/CodeTemporaire');

describe('CodeTemporaire model', () => {
  it('crée un code temporaire avec expiration', async () => {
    const now = new Date();
    const expire = new Date(now.getTime() + 1000);
    const code = await CodeTemporaire.create({ email: 'test@example.com', code: '123456', expireAt: expire });

    expect(code.code).toBe('123456');
    expect(code.email).toBe('test@example.com');
  });
});
