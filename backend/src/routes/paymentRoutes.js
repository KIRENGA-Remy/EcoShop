import express from 'express';
import { 
  processStripePayment,
  createBitpayInvoice,
  bitpayWebhook
} from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/stripe', protect, processStripePayment);
router.post('/bitpay', protect, createBitpayInvoice);
router.post('/bitpay/webhook', bitpayWebhook);

export default router;