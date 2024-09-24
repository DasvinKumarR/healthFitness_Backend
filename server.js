import express from "express"
import {connectDB} from "./config/db.js"
import cors from "cors"
import userRoute from "./routes/users.js"
import nutriRoute from "./routes/nutrition.js"
import fitnessRoute from "./routes/fitness.js"
import goalRoute from "./routes/goals.js"

const app = express();

app.use(express.json());
app.use(cors());

// db connection 
connectDB();

//Routes
app.use('/users', userRoute);
app.use('/fitness', fitnessRoute);
app.use('/nutrition', nutriRoute);
app.use('/goals', goalRoute);
// start the server
app.listen(process.env.PORT || 5000, ()=>{console.log(`server is up at ${process.env.PORT || 5000}`)})