import { DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';
import sequelize from '../config/db.js';

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
      notEmpty: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [6, 128] // Minimum 6 characters
    }
  },
  is_admin: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  tableName: 'users', // Explicit table name
  timestamps: true,   // Adds createdAt and updatedAt
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

// Instance method to compare passwords
User.prototype.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Class method to find by credentials
User.findByCredentials = async (email, password) => {
  const user = await User.findOne({ where: { email } });
  
  if (!user) {
    throw new Error('Invalid email or password');
  }
  
  const isMatch = await user.matchPassword(password);
  
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }
  
  return user;
};

export default User;