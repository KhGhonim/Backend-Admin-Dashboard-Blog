import jwt from "jsonwebtoken";
const SECRET_KEY = process.env.JWT_SECRET;

export default function JWTverifier(req, res, next) {
  const authorization = req.headers.token;
  console.log(authorization);
  console.log(req.headers.cookie);

  if (!authorization) {
    return res.status(401).json({
      message: "No Authorization Header",
    });
  }

  if (!req.headers.cookie) {
    return res.status(401).json({
      message: "No Cookies Found",
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
