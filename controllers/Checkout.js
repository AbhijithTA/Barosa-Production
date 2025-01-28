const Order = require("../models/Order");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.createCheckoutSession = async (req, res) => {
  try {
    
    const { products, order } = req.body;
    // validating the request body
    if (!products || !order) {
      return res.status(400).json({ message: "Invalid request body" });
    }

    //creating the order in the database
    // const newOrder = new Order(Order);
    // await newOrder.save();

    // creating the line items array
    const lineItems = products.map((item) => ({
      price_data: {
        currency: "aed",
        product_data: {
          name: item.product.title,
        },
        unit_amount: Math.round(item.product.price * 100),
      },
      quantity: item.quantity,
    }));

    // creating the stripe checkout session

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: 'http://localhost:3000/order-success/{CHECKOUT_SESSION_ID}',
      cancel_url: 'http://localhost:3000/cart',
      metadata: {
        order_id: order._id,
      },
    });

    // return the session ID to the front end
    res.status(200).json({ id: session.id });
  } catch (err) {
    console.error("Error creating checkout session  ", err);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
};
