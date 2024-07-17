import jwt from "jsonwebtoken";
const SECRET_KEY = process.env.JWT_SECRET;

export default function JWTverifier(req, res, next) {
  const token = req.cookies.jwt; // Read the token from cookies
console.log(token);
  if (!token) {
    return res.status(401).json({
      message: "No token Header",
    });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(500).json({
        message: "Invalid Token",
      });
    }
    req.user = user;
    next();
  });
}
