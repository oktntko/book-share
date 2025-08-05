import supertest from 'supertest';
import { app } from '~/app';

export async function authorizedAgent() {
  const agent = supertest.agent(app);

  await agent.post('/api/trpc/auth.create').send({ json: { email: 'example@example.com' } });

  return agent;
}

export async function authorized(agent: supertest.SuperAgentTest) {
  return agent.post('/api/trpc/auth.create').send({ json: { email: 'example@example.com' } });
}
