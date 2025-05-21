import React, { useEffect } from 'react';
import { CartItem } from './CartItem';
import { Button, Chip, Paper, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import { resetCartItemRemoveStatus, selectCartItemRemoveStatus, selectCartItems, deleteCartItemByIdAsync } from '../CartSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { SHIPPING, TAXES } from '../../../constants';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';


export const Cart = ({ checkout }) => {
    const items = useSelector(selectCartItems);
    const dispatch = useDispatch();
    const cartItemRemoveStatus = useSelector(selectCartItemRemoveStatus);

    const theme = useTheme();
    const is900 = useMediaQuery(theme.breakpoints.down(900));

    // ✅ Only include items with valid product info
    const validItems = items.filter(item => item.product !== null);

    const subtotal = validItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    const totalItems = validItems.reduce((acc, item) => acc + item.quantity, 0);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, []);

    useEffect(() => {
        if (items.length === 0 || validItems.length === 0) {
            toast.info('Your cart is empty. Add items to proceed.');
        }
    }, [items, validItems.length]);

    useEffect(() => {
        if (cartItemRemoveStatus === 'fulfilled') {
            toast.success('Product removed from cart');
        } else if (cartItemRemoveStatus === 'rejected') {
            toast.error('Error removing product from cart, please try again later');
        }
    }, [cartItemRemoveStatus]);

    useEffect(() => {
        dispatch(resetCartItemRemoveStatus());
    }, [dispatch]);

    if (validItems.length === 0) {
        return (
            <Stack justifyContent="center" alignItems="center" height="100vh">
                <Typography variant="h5" gutterBottom>
                    Your cart is empty
                </Typography>
                <Button variant="contained" component={Link} to="/">
                    Continue Shopping
                </Button>
            </Stack>
        );
    }

    return (
        <Stack justifyContent="flex-start" alignItems="center" mb="5rem">
            <Stack width={is900 ? 'auto' : '50rem'} mt="3rem" pl={checkout ? 0 : 2} pr={checkout ? 0 : 2} rowGap={4}>

                {/* Cart Items */}
                <Stack rowGap={2}>
                    {items.map(item => {
                        if (!item.product) {
                            // Show a warning for deleted product and allow removal
                            return (
                                <Paper key={item._id} sx={{ padding: 2, backgroundColor: '#ffe6e6', border: '1px solid red', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography color="red" fontWeight="bold">
                                        This product was deleted from the store.
                                    </Typography>
                                    <Button variant="outlined" color="error" onClick={() => dispatch(deleteCartItemByIdAsync(item._id))}>
                                        Remove
                                    </Button>
                                </Paper>
                            );
                        }

                        return (
                            <CartItem
                                key={item._id}
                                id={item._id}
                                title={item.product.title}
                                size={item.size}
                                category={item.product.category.name}
                                price={item.product.price}
                                quantity={item.quantity}
                                thumbnail={item.product.thumbnail}
                                stockQuantity={item.product.stockQuantity}
                                productId={item.product._id}
                            />
                        );
                    })}
                </Stack>

                {/* Subtotal Section */}
                <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
                    {checkout ? (
                        <Stack rowGap={2} width="100%">
                            <Stack flexDirection="row" justifyContent="space-between">
                                <Typography>Subtotal</Typography>
                                <Typography>AED {subtotal}</Typography>
                            </Stack>
                            <Stack flexDirection="row" justifyContent="space-between">
                                <Typography>Shipping</Typography>
                                <Typography>AED {SHIPPING}</Typography>
                            </Stack>
                            <Stack flexDirection="row" justifyContent="space-between">
                                <Typography>Taxes</Typography>
                                <Typography>AED {TAXES}</Typography>
                            </Stack>
                            <hr />
                            <Stack flexDirection="row" justifyContent="space-between">
                                <Typography>Total</Typography>
                                <Typography>AED {subtotal + SHIPPING + TAXES}</Typography>
                            </Stack>
                        </Stack>
                    ) : (
                        <>
                            <Stack>
                                <Typography variant="h6" fontWeight={500}>Subtotal</Typography>
                                <Typography>Total items in cart {totalItems}</Typography>
                                <Typography variant="body1" color="text.secondary">
                                    Shipping and taxes will be calculated at checkout.
                                </Typography>
                            </Stack>
                            <Stack>
                                <Typography variant="h6" fontWeight={500}>AED {subtotal}</Typography>
                            </Stack>
                        </>
                    )}
                </Stack>

                {/* Buttons */}
                {!checkout && (
                    <Stack rowGap="1rem">
                        <Button variant="contained" component={Link} to="/checkout">Checkout</Button>
                        <motion.div style={{ alignSelf: 'center' }} whileHover={{ y: 2 }}>
                            <Chip sx={{ cursor: 'pointer', borderRadius: '8px' }} component={Link} to="/" label="or continue shopping" variant="outlined" />
                        </motion.div>
                    </Stack>
                )}
            </Stack>
        </Stack>
    );
};
