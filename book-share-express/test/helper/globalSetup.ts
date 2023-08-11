export default function globalSetup() {
  process.env.DATABASE_URL = 'postgresql://bs_ut:bs_ut@localhost:${DB_PORT}/bs_ut?schema=bs_ut';
}
