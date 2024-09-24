import crypto from "crypto"
// function to return token
export const generateToken = () => crypto.randomBytes(20).toString('hex');