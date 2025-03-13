import {
  IconButton,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Stack, Box } from "@mui/material";
import React from "react";
import { facebookPng, instagramPng, tiktok } from "../../assets";
import SendIcon from "@mui/icons-material/Send";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import { MotionConfig, motion } from "framer-motion";
import { Link } from "react-router-dom";

export const Footer = () => {
  const theme = useTheme();
  const is700 = useMediaQuery(theme.breakpoints.down(700));
  const is480 = useMediaQuery(theme.breakpoints.down(480));

  const labelStyles = {
    fontWeight: 300,
    cursor: "pointer",
    transition: "color 0.3s ease",
    "&:hover": {
      color: theme.palette.secondary.main,
    },
  };

  const contactItemStyle = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "0.5rem",
    transition: "transform 0.2s ease",
    "&:hover": {
      transform: "translateX(5px)",
    },
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
            sx={{
              border: "1px solid white",
              borderRadius: "6px",
              "&:hover": {
                boxShadow: "0 0 8px rgba(255,255,255,0.3)",
              },
            }}
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

        <Stack
          rowGap={"1rem"}
          padding={"1rem"}
          width={is480 ? "100%" : "auto"}
          maxWidth="280px"
        >
          <Typography variant="h6" sx={{ marginBottom: "0.5rem" }}>
            Support
          </Typography>

          <Box sx={contactItemStyle}>
            <LocationOnIcon sx={{ color: theme.palette.secondary.main }} />
            <Typography sx={{ ...labelStyles, lineHeight: "1.6" }}>
              Barosa Trendz Fashion,
              <br />
              Al Zahiryah E1602,
              <br />
              Navigate area,
              <br />
              Abu Dhabi
            </Typography>
          </Box>

          <Box sx={contactItemStyle}>
            <EmailIcon sx={{ color: theme.palette.secondary.main }} />
            <Typography sx={labelStyles}>barosatrendz@gmail.com</Typography>
          </Box>

          <Box sx={contactItemStyle}>
            <PhoneIcon sx={{ color: theme.palette.secondary.main }} />
            <Typography sx={labelStyles}>+971 56 643 4873</Typography>
          </Box>
        </Stack>

        <Stack rowGap={"1rem"} padding={"1rem"}>
          <Typography variant="h6">Account</Typography>
          <Link to="/my-account" style={{ textDecoration: "none" }}>
            <Typography sx={labelStyles}>My Account</Typography>
          </Link>
          <Link to="/login" style={{ textDecoration: "none" }}>
            <Typography sx={labelStyles}>Login / Register</Typography>
          </Link>
          <Link to="/cart" style={{ textDecoration: "none" }}>
            <Typography sx={labelStyles}>Cart</Typography>
          </Link>
          <Link to="/wishlist" style={{ textDecoration: "none" }}>
            <Typography sx={labelStyles}>Wishlist</Typography>
          </Link>
        </Stack>

        <Stack rowGap={"1rem"} padding={"1rem"}>
          <Typography variant="h6">Quick Links</Typography>
          <Typography sx={labelStyles}>Privacy Policy</Typography>
          <Typography sx={labelStyles}>Terms Of Use</Typography>
          <Typography sx={labelStyles}>FAQ</Typography>
          <Link to="/contact-us" style={{ textDecoration: "none" }}>
            <Typography sx={labelStyles}>Contact</Typography>
          </Link>
        </Stack>

        <Stack rowGap={"1rem"} padding={"1rem"}>
          <Typography variant="h6">Follow Us On</Typography>

          <Stack
            mt={0.6}
            flexDirection={"row"}
            columnGap={"1rem"}
            flexWrap="wrap"
          >
            <a
              href="https://www.facebook.com/people/Barosa-Trendz/61573365819717/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <motion.img
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                style={{ cursor: "pointer" }}
                src={facebookPng}
                alt="Facebook"
              />
            </a>

            <a
              href="https://www.instagram.com/barosatrendz/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <motion.img
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                style={{ cursor: "pointer",width:"20px",height:"20px" }}
                src={instagramPng}
                alt="Instagram"
              />
            </a>
            
            <a
              href="https://www.tiktok.com/@barosatrendz"
              target="_blank"
              rel="noopener noreferrer"
            >
              <motion.img
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                style={{ cursor: "pointer",width:"20px",height:"20px" }}
                src={tiktok}
                alt="TikTok"
              />
            </a>
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