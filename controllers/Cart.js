const Cart = require("../models/Cart");

// exports.create=async(req,res)=>{
//     try {
//         const created=await new Cart(req.body).populate({path:"product"});
//         await created.save()
//         res.status(201).json(created)
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({message:'Error adding product to cart, please trying again later'})
//     }
// }

exports.create = async (req, res) => {
  try {
    const { user, product, size, quantity } = req.body;
    

   

    //checking if the product is already in the cart
    let cartItem = await Cart.findOne({ user, product, size });

    if (cartItem) {
      cartItem.quantity += quantity || 1;
    } else {
      cartItem = new Cart({ user, product, size, quantity });
    }

    await cartItem.save();
    await cartItem.populate({ path: "product" })

    res.status(201).json(cartItem);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error adding product to cart, Please try again later",
    });
  }
};

exports.getByUserId = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Cart.find({ user: id }).populate({
      path: "product",
    });

    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error fetching cart items, please trying again later",
    });
  }
};

// exports.updateById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { quantity, size } = req.body;
//     //
//     const updated = await Cart.findByIdAndUpdate(id, req.body, {
//       new: true,
//     }).populate({ path: "product", populate: { path: "brand" } });
//     res.status(200).json(updated);
//   } catch (error) {
//     console.log(error);
//     return res
//       .status(500)
//       .json({
//         message: "Error updating cart items, please trying again later",
//       });
//   }
// };

exports.updateById = async (req, res) => {
  try {
    const { id } = req.params;
    const { size, quantity } = req.body;

    //finding the cart item
    const cartItem = await Cart.findById(id);

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    //checking if the size is changed
    if (size && size !== cartItem.size) {
      const existingItem = await Cart.findOne({
        user: cartItem.user,
        product: cartItem.product,
        size,
      });

      if (existingItem) {
        return res
          .status(400)
          .json({ message: "Item already exists in the cart" });
      }
    }

    //updating the cart item
    cartItem.size = size || cartItem.size;
    cartItem.quantity = quantity || cartItem.quantity;

    await cartItem.save();
    await cartItem.populate({ path: "product" })

    res.status(200).json(cartItem);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error updating cart items, please trying again later",
    });
  }
};

exports.deleteById = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Cart.findByIdAndDelete(id);
    res.status(200).json(deleted);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error deleting cart item, please trying again later" });
  }
};

exports.deleteByUserId = async (req, res) => {
  try {
    const { id } = req.params;
    await Cart.deleteMany({ user: id });
    res.sendStatus(204);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Some Error occured while resetting your cart" });
  }
};
