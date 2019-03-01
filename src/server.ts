import app from './app';
import { logger } from './common/logger';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '..' , '.env') });

const PORT = 3000;

app.listen(PORT, () => {
  logger.info(`Express server listening on port ${PORT}`);
});
