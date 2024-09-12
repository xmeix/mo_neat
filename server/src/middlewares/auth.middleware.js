import jwt from "jsonwebtoken";
import prisma from "../db/prismaClient.js";

export const generateJWT = (user, exp, secret) => {
  const payload = {
    UserInfo: {
      id: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
    },
  };

  const options = {
    expiresIn: exp,
  };

  return jwt.sign(payload, secret, options);
};

export const verifyCookieToken = async (req, res, next) => {
  const cookies = req.cookies;
  console.log(cookies);
  jwt.verify(
    cookies?.access_token,
    process.env.ACCESS_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) {
        console.log(
          "Access token expired or doesn't exist, looking for refresh token..."
        );
        jwt.verify(
          cookies?.refresh_token,
          process.env.REFRESH_TOKEN_SECRET,
          async (err, dec) => {
            if (err) {
              console.log(
                "Refresh token expired or doesn't exist, logging out..."
              );
              res.cookie("refresh_token", null, {
                expires: new Date(0),
                secure: true,
                sameSite: "none",
                httpOnly: true,
              });
              res.cookie("access_token", null, {
                expires: new Date(0),
                secure: true,
                sameSite: "none",
                httpOnly: true,
              });
              console.log("here----------------");
              //res.redirect("http://localhost:5173/auth/");
            } else {
              console.log(dec);

              const foundUser = await prisma.user.findFirst({
                where: { email: dec.UserInfo.email },
              });

              if (!foundUser) {
                console.log("User not found, logging out...");
                res.cookie("refresh_token", null, {
                  expires: new Date(0),
                  secure: true,
                  sameSite: "none",
                  httpOnly: true,
                });
                res.cookie("access_token", null, {
                  expires: new Date(0),
                  secure: true,
                  sameSite: "none",
                  httpOnly: true,
                });
                console.log("here----------------");
                //res.redirect("http://localhost:5173/auth/");
              }

              const newAccessToken = generateJWT(
                foundUser,
                "5m",
                process.env.ACCESS_TOKEN_SECRET
              );

              res.cookie("access_token", newAccessToken, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: 5 * 60 * 1000,
              });
              console.log(cookies.access_token);
              req.user = dec.UserInfo;

              next();
            }
          }
        );
      } else {
        req.user = decoded.UserInfo;
        next();
      }
    }
  );
};

export const verifyCookieTokenAndAdmin = (req, res, next) => {
  verifyCookieToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      return res.status(401).json("Unauthorized!");
    }
  });
};
