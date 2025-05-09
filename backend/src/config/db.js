import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: process.env.NODE_ENV !== 'production' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      freezeTableName: true, 
      underscored: true, 
    }
  }
);

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(' Database connection established.');

    if (process.env.NODE_ENV !== 'production') {
      await sequelize.sync({ alter: true });
      console.log(' Database models synchronized (development mode).');
    }
    } catch (error) {
      console.error('Database connection failed:', error.message);
      process.exit(1); 
    }
};

export default sequelize;