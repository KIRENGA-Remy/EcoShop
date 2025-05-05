import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './userModel.js';
import Product from './productModel.js';

const Order = sequelize.define('Order', {
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: false
  },
  paymentCurrency: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'USD'
  },
  paymentResult: {
    type: DataTypes.JSON,
    allowNull: true
  },
  totalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  isPaid: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  paidAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  isDelivered: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  deliveredAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  shippingAddress: {
    type: DataTypes.JSON,
    allowNull: false
  }
}, {
  timestamps: true
});

// Relationships
Order.belongsTo(User);
User.hasMany(Order);

// Order items join table
const OrderItem = sequelize.define('OrderItem', {
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}, {
  timestamps: false
});

Order.belongsToMany(Product, { through: OrderItem });
Product.belongsToMany(Order, { through: OrderItem });

export default Order;
export { OrderItem };