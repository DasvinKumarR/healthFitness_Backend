import express from "express"
import {logExercise, getExerciseData, deleteExerciseData} from "../controllers/fitness.js"
// initiate Router
const fitnessRoute = express.Router();
// fitness routes
fitnessRoute.post('/log', logExercise);
fitnessRoute.get('/data', getExerciseData);
fitnessRoute.delete('/delete/:id', deleteExerciseData)

export default fitnessRoute;