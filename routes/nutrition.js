import express from "express"
import {logFood, getFoodData, deleteFoodData} from "../controllers/nutrition.js"
// initiate router
const nutriRoute = express.Router();
// nutrition routes
nutriRoute.post('/log', logFood);
nutriRoute.get('/data', getFoodData);
nutriRoute.delete('/delete/:id', deleteFoodData);

export default nutriRoute