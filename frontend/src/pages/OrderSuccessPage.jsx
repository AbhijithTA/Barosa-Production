import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import { resetCurrentOrder, selectCurrentOrder } from "../features/order/OrderSlice";
import { selectUserInfo } from "../features/user/UserSlice";
import { axiosi } from "../config/axios";
import { Button, Stack, Typography, Paper, Box } from "@mui/material";
import Lottie from "lottie-react";
import { orderSuccessAnimation } from "../assets";

export const OrderSuccessPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userDetails = useSelector(selectUserInfo);
  const currentOrder = useSelector(selectCurrentOrder);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        let response;

        if (id?.startsWith("cs_")) {
          response = await axiosi.get(`/checkout/get-order?session_id=${id}`);
        } else if (id) {
          response = await axiosi.get(`/orders/${id}`);
        } else if (userDetails?._id) {
          response = await axiosi.get(`/orders/user/${userDetails._id}`);
          if (response.data.length > 0) {
            response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            response = { data: { order: response.data[0] } };
          } else {
            throw new Error("No orders found.");
          }
        }

        setOrder(response.data.order);
      } catch (err) {
        console.error("Error fetching order details:", err);
        setError("Failed to fetch order details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, userDetails]);

  useEffect(() => {
    return () => {
      dispatch(resetCurrentOrder());
    };
  }, [dispatch]);

  if (loading) {
    return (
      <Stack width="100vw" height="100vh" justifyContent="center" alignItems="center">
        <Typography variant="h6">Loading order details...</Typography>
      </Stack>
    );
  }

  if (error) {
    return (
      <Stack width="100vw" height="100vh" justifyContent="center" alignItems="center">
        <Typography variant="h6" color="error">{error}</Typography>
        <Button component={Link} to="/" variant="contained">Go to Home</Button>
      </Stack>
    );
  }

  const orderNumber = order?.orderNo ? `#${order.orderNo}` : "N/A";

  console.log(order,"this is the order details");
  console.log(orderNumber,"this is the order number");

  return (
    <Stack width="100vw" height="100vh" justifyContent="center" alignItems="center">
      <Stack component={Paper} rowGap={3} elevation={1} p={4} justifyContent="center" alignItems="center">
        <Box width="10rem" height="7rem">
          <Lottie animationData={orderSuccessAnimation} />
        </Box>

        <Stack textAlign="center" justifyContent="center" alignItems="center" rowGap={1}>
          <Typography variant="h6">Hey {userDetails?.name}</Typography>
          <Typography variant="h5">Your Order #<strong>{orderNumber}</strong> is confirmed</Typography>
          <Typography variant="body2" color="text.secondary">
            Thank you for shopping with us ❤️
          </Typography>
        </Stack>

        <Button component={Link} to="/orders" onClick={() => dispatch(resetCurrentOrder())} variant="contained">
          Check order status
        </Button>
      </Stack>
    </Stack>
  );
};
