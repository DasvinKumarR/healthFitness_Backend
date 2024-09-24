import express from "express"
import {register, activateUser, getUserData, updateUserProfile, login, forgotPassword, resetPassword} from "../controllers/users.js"
//  initiate router
const userRoute = express.Router();
// users route
userRoute.post('/register', register);
userRoute.get('/activate/:token', activateUser)
userRoute.post('/login', login);
userRoute.post('/forgot-password', forgotPassword);
userRoute.post('/reset-password/:token', resetPassword);
userRoute.get('/get-user/:userId', getUserData);
userRoute.put('/update-profile/:userId', updateUserProfile);

export default userRoute;