import { rest } from 'msw';

import { office, user } from 'mocks/data';

export const handlers = [
  rest.get('/api/office', async (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(office));
  }),

  rest.post('/api/login', async (req, res, ctx) => {
    const data = await req.json();
    user.id = data.id;
    return res(ctx.status(200), ctx.json(user));
  }),
  rest.post('/api/logout', (req, res, ctx) => {
    user.id = '';
    return res(ctx.status(200), ctx.json(user));
  }),
];

export default handlers;
