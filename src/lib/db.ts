import { connect, type Config } from "@planetscale/database";

function getConnection() {
  const config = {
    host: process.env.DATABASE_HOST,
    password: process.env.DATABASE_PASSWORD,
    username: process.env.DATABASE_USERNAME,
  } satisfies Config;
  return connect(config);
}

export { getConnection };
