import jwt from "jsonwebtoken";
export const signToken = ({ payload, privateKey, options }) => {
  return new Promise((resolve, reject) => {
    const token = jwt.sign(payload, privateKey, {
      expiresIn: "1d",
      ...options,
    });
    if (!token) {
      throw reject(token);
    } else {
      resolve(token);
    }
  });
};