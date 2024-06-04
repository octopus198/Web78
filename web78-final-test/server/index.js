import express from 'express';
import userRoute from './routes/users.routes.js';
import databaseService from './services/database.service.js';
import movieRoute from './routes/movies.routes.js';
import cors from 'cors'

const app = express();

app.use(cors({
    origin: 'http://localhost:3000'
}));

const PORT = 4000;

app.use(express.json());


databaseService.connect();

app.use("/users", userRoute);
app.use("/movies", movieRoute);

app.use((err, req, res, next) => {
    if (err.message) {
        return res.json({error: err.message})
    } else {
        return res.json({err})
    }
}) 

app.listen(PORT, (err) => {
    console.log(`Your app is listening on ${PORT}`)
})
