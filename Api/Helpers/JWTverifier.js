import jwt from "jsonwebtoken";
const SECRET_KEY = process.env.JWT_SECRET;

export default function JWTverifier(req, res, next) {
  const authorization = req.cookies.token;
  if (!authorization) {
    return res.status(401).json({
      message: "No Authorization Header",
    });
  }

  jwt.verify(authorization, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(500).json({
        message: "Invalid Token",
      });
    }
    req.user = user;
    next();
  });
}
