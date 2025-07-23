const Utilisateur = require('../models/Utilisateur');
const bcrypt = require('bcrypt');

describe('Utilisateur model', () => {
  it('crée un utilisateur avec hachage du mot de passe', async () => {
    const utilisateur = new Utilisateur({
      nom: 'Alice',
      email: 'alice@example.com',
      mot_de_passe: 'Monmot@depasse123'
    });

    await utilisateur.save();

    const saved = await Utilisateur.findOne({ email: 'alice@example.com' });
    expect(saved.nom).toBe('Alice');
    expect(saved.mot_de_passe).not.toBe('monmotdepasse');
    const isValid = await bcrypt.compare('Monmot@depasse123', saved.mot_de_passe);
    expect(isValid).toBe(true);
  });
});
