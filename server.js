import express from "express"
import  dotenv  from "dotenv"
import cors from "cors"
import { Mongo_Db_Connection } from "./config/db.js"
import logger from "./config/logger.js"
import { routes } from "./routes/index.js"

dotenv.config()
const app = express()
app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))
Mongo_Db_Connection()
app.use('/api' , routes)

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5002;
  app.listen(PORT, () => {
    logger.info(`Server is running on Port ${PORT} 🛸`);
  });
}

export default app;
