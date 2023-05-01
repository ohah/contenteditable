/* eslint-disable import/prefer-default-export */
import { setupWorker } from 'msw';

import handlers from 'mocks/handlers';

export const worker = setupWorker(...handlers);
