const Pool = require('pg').Pool;
const pool = new Pool({
  user: 'postgres',
  password: 'contra1234$',
  host: 'localhost',
  port: 8080,
  database: 'CasaDavid',
});
module.exports = pool;
 