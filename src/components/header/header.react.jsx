import React from "react";
import {
  AppBar,
  Box,
  List,
  ListItemButton,
  Toolbar,
  Button,
  Divider,
  Container,
} from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";
import LogoWithText from "../../assets/images/logo-with-text2-removebg-preview.png";

const drawerWidth = 240;

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <>
      {/* Navbar */}

      <Container
        sx={{
          background: "#00040f",
          display: "flex",
          flexDirection: "column",
          justifyContent: { lg: "space-between", xs: "flex-start" },
          alignItems: "flex-start",
          gap: 1,
        }}
      >
        <Link to="/">
          <Box
            sx={{
              display: { lg: "flex", md: "flex", sm: "flex", xs: "flex" },
              justifyContent: {
                md: "flex-start",
                sm: "flex-start",
                xs: "flex-start",
              },
              alignItems: { md: "center", sm: "center", xs: "center" },
              width: { lg: "100%", md: "100%", sm: "100%", xs: "100%" },
            }}
          >
            <img src={LogoWithText} alt="logo" width="100%"></img>
          </Box>
        </Link>

        <List
          sx={{
            width: "60%",
          }}
        >
          <Divider
            color="#fff"
            sx={{
              width: "80%",
            }}
          />
          <Link to="/Login" className="link" onClick={handleDrawerToggle}>
            <ListItemButton>
              <Button variant="contained" color="secondary">
                Sign In
              </Button>
            </ListItemButton>
          </Link>
        </List>
      </Container>
      {/* Navbar */}
    </>
  );
  return (
    <>
      {/* Navbar */}

      <Box
        sx={{
          position: "relative",
          top: 0,
          left: 0,
          zIndex: 1000,
        }}
      >
        <AppBar
          component="nav"
          position="relative"
          sx={{
            boxShadow: " 0 0 10px 0 #ffffff64",
          }}
        >
          <Toolbar
            sx={{
              display: "flex",
              justifyContent: {
                lg: "center",
                md: "flex-start",
                sm: "flex-start",
                xs: "center",
              },
              aligncenter: "center",
              background: "primary",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Link to="/">
                <Box
                  sx={{
                    display: { lg: "flex", md: "flex", sm: "flex", xs: "flex" },
                    justifyContent: {
                      md: "flex-start",
                      sm: "flex-start",
                      xs: "flex-start",
                    },
                    alignItems: { md: "center", sm: "center", xs: "center" },
                    width: { lg: "32%", sm: "32%", xs: "52%" },
                  }}
                >
                  <img src={LogoWithText} alt="logo" width="100%"></img>
                </Box>
              </Link>
              <Link to="/login" className="link">
                <Button
                  variant="contained"
                  color="secondary"
                  sx={{
                    display: { lg: "none", xs: "flex", md: "flex", sm: "flex" },
                    width: "100%",
                    fontSize: "15px",
                  }}
                >
                  Login
                </Button>
              </Link>
            </Box>
            <Box
              sx={{
                display: { lg: "flex", xs: "none", md: "none", sm: "none" },
                justifyContent: "center",
                alignItems: "center",
                gap: 1,
                textTransform: "capitalize",
                color: "#ffffff",
              }}
            >
              <Link to="/login" className="link">
                <Button variant="contained" color="secondary">
                  SignIn
                </Button>
              </Link>
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
    </>
  );
};

export default Header;
