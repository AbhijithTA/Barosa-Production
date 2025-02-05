import {
  Box,
  IconButton,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Stack } from "@mui/material";
import React from "react";
import {
  QRCodePng,
  appStorePng,
  googlePlayPng,
  facebookPng,
  instagramPng,
  twitterPng,
  linkedinPng,
} from "../../assets";
import SendIcon from "@mui/icons-material/Send";
import { MotionConfig, motion } from "framer-motion";
import { Link } from "react-router-dom";

export const Footer = () => {
  const theme = useTheme();
  const is700 = useMediaQuery(theme.breakpoints.down(700));

  const labelStyles = {
    fontWeight: 300,
    cursor: "pointer",
  };

  return (
    <Stack
      sx={{
        backgroundColor: theme.palette.primary.main,
        paddingTop: "3rem",
        paddingLeft: is700 ? "1rem" : "3rem",
        paddingRight: is700 ? "1rem" : "3rem",
        paddingBottom: "1.5rem",
        rowGap: "5rem",
        color: theme.palette.primary.light,
        justifyContent: "space-around",
      }}
    >
      {/* upper */}
      <Stack
        flexDirection={"row"}
        rowGap={"1rem"}
        justifyContent={is700 ? "" : "space-around"}
        flexWrap={"wrap"}
      >
        <Stack rowGap={"1rem"} padding={"1rem"}>
          <Typography variant="h6" fontSize={"1.5rem"}>
            Exclusive
          </Typography>
          <Typography variant="h6">Subscribe</Typography>
          <Typography sx={labelStyles}>Get 10% off your first order</Typography>
          <TextField
            placeholder="Enter your email"
            sx={{ border: "1px solid white", borderRadius: "6px" }}
            InputProps={{
              endAdornment: (
                <IconButton>
                  <SendIcon sx={{ color: theme.palette.primary.light }} />
                </IconButton>
              ),
              style: { color: "whitesmoke" },
            }}
          />
        </Stack>

        <Stack rowGap={"1rem"} padding={"1rem"}>
          <Typography variant="h6">Support</Typography>
          <Typography sx={labelStyles}>
            11th Main Street, Dhaka, DH 1515, UAE.
          </Typography>
          <Typography sx={labelStyles}>exclusive@gmail.com</Typography>
          <Typography sx={labelStyles}>+88015-88888-9999</Typography>
        </Stack>

        <Stack rowGap={"1rem"} padding={"1rem"}>
          <Typography variant="h6">Account</Typography>
          <Link to="/my-account">
            <Typography sx={labelStyles}>My Account</Typography>
          </Link>
          <Link to="/login">
            <Typography sx={labelStyles}>Login / Register</Typography>
          </Link>
          <Link to="/cart">
            <Typography sx={labelStyles}>Cart</Typography>
          </Link>
          <Link to="/wishlist">
            <Typography sx={labelStyles}>Wishlist</Typography>
          </Link>
        </Stack>

        <Stack rowGap={"1rem"} padding={"1rem"}>
          <Typography variant="h6">Quick Links</Typography>
          <Typography sx={labelStyles}>Privacy Policy</Typography>
          <Typography sx={labelStyles}>Terms Of Use</Typography>
          <Typography sx={labelStyles}>FAQ</Typography>
          <Link to="/contact-us">
            <Typography sx={labelStyles}>Contact</Typography>
          </Link>
        </Stack>

        <Stack rowGap={"1rem"} padding={"1rem"}>
          <Typography variant="h6">Follow Us On</Typography>

          <Stack mt={0.6} flexDirection={"row"} columnGap={"2rem"}>
            <MotionConfig whileHover={{ scale: 1.1 }} whileTap={{ scale: 1 }}>
              <motion.img
                style={{ cursor: "pointer" }}
                src={facebookPng}
                alt="Facebook"
              />
              <motion.img
                style={{ cursor: "pointer" }}
                src={twitterPng}
                alt="Twitter"
              />
              <motion.img
                style={{ cursor: "pointer" }}
                src={instagramPng}
                alt="Instagram"
              />
              <motion.img
                style={{ cursor: "pointer" }}
                src={linkedinPng}
                alt="Linkedin"
              />
            </MotionConfig>
          </Stack>
        </Stack>
      </Stack>

      {/* lower */}
      <Stack alignSelf={"center"}>
        <Typography color={"GrayText"}>
          &copy; Barosa Store {new Date().getFullYear()}. All right reserved
        </Typography>
      </Stack>
    </Stack>
  );
};
