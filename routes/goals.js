import express from "express"
import {setGoal, getGoals, updateProgress, deleteGoal} from "../controllers/goals.js"
// initiate Router
const goalRoute = express.Router();
// goals routes
goalRoute.post('/set', setGoal);
goalRoute.get('/all', getGoals);
goalRoute.put('/update', updateProgress);
goalRoute.delete('/delete/:goalId', deleteGoal);

export default goalRoute;