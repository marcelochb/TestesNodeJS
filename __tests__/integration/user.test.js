import request from 'supertest';
import bcrypt from 'bcrypt';
import app from '../../src/app';

import truncate from '../util/truncate';
import User from '../../src/app/models/User';

describe('User', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should encrypt user passord when new user created', async () => {
    const user = await User.create({
      name: 'Marcelo Block',
      email: 'marcelochb@gmail.com',
      password: '123456',
    });

    const compareHash = bcrypt.compare('123456', user.password_hash);

    expect(compareHash).toBe(true);
  });

  it('should be able to register', async () => {
    const response = await request(app)
      .post('/users')
      .send({
        name: 'Marcelo Block',
        email: 'marcelochb@gmail.com',
        password: '123456',
      });

    expect(response.body).toHaveProperty('id');
  });

  it('should not be able to register with duplicated email', async () => {
    await request(app)
      .post('/users')
      .send({
        name: 'Marcelo Block',
        email: 'marcelochb@gmail.com',
        password: '123456',
      });

    const response = await request(app)
      .post('/users')
      .send({
        name: 'Marcelo Block',
        email: 'marcelochb@gmail.com',
        password: '123456',
      });

    expect(response.status).toBe(400);
  });
});
