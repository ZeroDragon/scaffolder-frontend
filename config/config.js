export const { ENVIRONMENT, APP_NAME } = process.env;

export const HTTP_SERVER_PORT = (env =>
  ({ production: 3000, test: 4004, development: 5005 }[env] || 6006))(
  ENVIRONMENT
);
