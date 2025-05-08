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
    logging: console.log, // Enable logging for debugging
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      freezeTableName: true, // Prevent pluralization
      underscored: true, // Use snake_case for column names
    }
  }
);

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Sync all models (development only)
    if (process.env.NODE_ENV !== 'production') {
      await sequelize.sync({ 
        force: false,    // Don't drop tables
        alter: true      // Automatically update tables
      });
      console.log('Database models synchronized');
    }

    return true;
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

export default sequelize;