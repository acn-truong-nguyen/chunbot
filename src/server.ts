import app from './app';
import './common/env';
import { logger } from './common/logger';

const PORT = 3000;

app.listen(PORT, () => {
  logger.info(`Express server listening on port ${PORT}`);
});
