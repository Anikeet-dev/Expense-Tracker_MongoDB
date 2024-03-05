const Razorpay = require('razorpay');
const Order = require('../models/orders');
const User = require('../models/user'); 

exports.purchasePremium = async (req, res) => {
    try {
        const rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });

        const amount = 100;

        rzp.orders.create({ amount, currency: "INR" }, async (err, order) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            console.log('Order:', order);
            try {
                const newOrder = new Order({ orderid: order.id, status: 'PENDING' });
                await newOrder.save();

                return res.status(201).json({ order, key_id: rzp.key_id });
            } catch (err) {
                return res.status(500).json({ error: err.message });
            }
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Something went wrong' });
    }
};

exports.updateTransactionStatus = async (req, res) => {
    try {
        const { payment_id, order_id } = req.body;
        const order = await Order.findOne({ orderid: order_id });

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        if (payment_id) {
            await Promise.all([
                order.updateOne({ paymentid: payment_id, status: 'SUCCESSFUL' }),
                User.findOneAndUpdate({ _id: req.user._id }, { ispremiumuser: true })
            ]);
            return res.status(202).json({ success: true, message: 'Transaction Successful' });
        } else {
            await order.updateOne({ status: 'FAILED' });
            return res.status(402).json({ success: false, message: 'Transaction FAILED' });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Something went wrong' });
    }
};
