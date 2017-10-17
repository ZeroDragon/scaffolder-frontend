import bunyan from 'bunyan';

function setupLogger() {
  global.logger = bunyan.createLogger({
    name: config.APP_NAME,
    src: config.ENVIRONMENT !== 'production',
    streams: [
      {
        level: 'trace',
        stream: process.stdout
      }
    ]
  });
}
if (global.logger == null) {
  setupLogger();
  global.logger.info('logger initialized');
  process.on('unhandledRejection', error => {
    global.logger.error(error);
  });
}
