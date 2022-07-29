import express from "express";
import listEndpoints from "express-list-endpoints"
import createHttpError from "http-errors"
import cors from "cors"
import mediaRouter from "./apis/media/index.js"
import filesRouter from "./apis/files/index.js";

const server = express()

const port = process.env.PORT || 3001

const whitelist = [process.env.VERCEL, process.env.LOCAL]

server.use(
    cors({
      origin: (origin, corsNext) => {
        
        console.log("ORIGIN: ", origin)
  
        if (!origin || whitelist.indexOf(origin) !== -1) {
          
          corsNext(null, true)
        } else {
          
          corsNext(createHttpError(400, `Cors Error! Your origin ${origin} is not in the list!`))
        }
      },
    })
  )

  server.use(express.json())

  server.use("/media",mediaRouter)
  server.use("/files",filesRouter)

  server.listen(port, () => {
    console.table(listEndpoints(server))
    console.log("Server is running on port: ", port)
  })