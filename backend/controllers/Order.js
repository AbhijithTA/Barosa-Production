const Cart = require("../models/Cart");
const Counter = require("../models/Counter");
const Order = require("../models/Order");
const { sendMail } = require("../utils/Emails");
const Product = require("../models/Product");

exports.create = async (req, res) => {
  try {
    const { user, items, address, paymentMode, total } = req.body;

    //Validating required fields
    if (!user || !items || !address || !paymentMode || !total) {
      return res.status(400).json({ message: "Invalid request body" });
    }

    console.log("Items received:", items);

    //find and increment the counter in one atomic operation
    const counter = await Counter.findOneAndUpdate(
      { name: "order" },
      { $inc: { value: 1 } },
      { new: true, upsert: true }
    );

    // get the new order number
    const orderNo = counter.value;

    //creating the order
    const created = new Order({
      user,
      items,
      address,
      paymentMode,
      total,
      orderNo,
      status: "Pending",
    });

    for (const item of items) {
  const { product, size, quantity } = item;

  if (!product || !size || quantity == null) {
    return res.status(400).json({ message: "Missing product, size, or quantity in one of the items" });
  }

  const productDoc = await Product.findById(product);
  if (!productDoc) {
    return res.status(404).json({ message: `Product not found: ${product}` });
  }

  const currentStock = productDoc.stockQuantity.get(size);
  if (currentStock === undefined) {
    return res.status(400).json({ message: `Variant/size '${size}' not found for product '${productDoc.title}'` });
  }

  if (currentStock < quantity) {
    return res.status(400).json({ message: `Insufficient stock for '${productDoc.title}' size '${size}'` });
  }

  productDoc.stockQuantity.set(size, currentStock - quantity);
  await productDoc.save();
}


    // save the order to the database
    await created.save();

    //clearing the user cart
    await Cart.deleteMany({ user });

    //Send Email Notification to the owner
    const ownerEmail = process.env.OWNER_EMAIL;
    const subject = "New Order Received - Barosa Shopping";

    const emailBody = 
    `<h2>New Order Received</h2>
    <p>A new order has been placed. Please check the system for details.</p>
    <p><strong>Order Total:</strong> AED${total}</p>
    <p><strong>Payment Mode:</strong> ${paymentMode}</p>
    <p>Kindly process the order as soon as possible.</p>`
;

    await sendMail(ownerEmail, subject, emailBody);

    res.status(201).json(created);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error creating an order, please trying again later" });
  }
};

exports.getByUserId = async (req, res) => {
  try {
    const { id } = req.params;
    const results = await Order.find({ user: id }).populate({
      path: "items.product",
      model: "Product",
    });

    res.status(200).json(results);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error fetching orders, please trying again later" });
  }
};

exports.getByOrderId = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id).populate({
      path: "items.product",
      model: "Product",
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching orders, please try again later" });
  }
};

exports.getAll = async (req, res) => {
  try {
    let skip = 0;
    let limit = 0;

    if (req.query.page && req.query.limit) {
      const pageSize = req.query.limit;
      const page = req.query.page;
      skip = pageSize * (page - 1);
      limit = pageSize;
    }

    const totalDocs = await Order.find({}).countDocuments().exec();
    const results = await Order.find({})
      .skip(skip)
      .limit(limit)
      .populate("items.product")
      .exec();

    res.header("X-Total-Count", totalDocs);
    res.status(200).json(results);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error fetching orders, please try again later" });
  }
};

exports.updateById = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Order.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error updating order, please try again later" });
  }
};
