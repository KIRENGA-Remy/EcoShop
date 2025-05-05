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
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully');
    
    // Sync models with database (in development)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('Database models synchronized');
    }
  } catch (error) {
    console.error('Unable to connect to the database:', error.message);
    process.exit(1);
  }
};

export default sequelize;