import express from "express";
import uniqid from "uniqid";
import createHttpError from "http-errors"
import { pipeline } from "stream"
import {readMedia,writeMedia,getPDFReadableStream} from "../../lib/utilities-media.js"

const mediaRouter = express.Router()

mediaRouter.post("/", async (req,res,next) => {
    try {

        const media = await readMedia()

        const newMedia = {...req.body, createdAt: new Date() , id: uniqid()}

        media.push(newMedia)

        await writeMedia(media)

        res.status(201).send({id:newMedia.id})

    } catch (error) {
        next(error)
    }
})

mediaRouter.get("/", async (req,res,next) => {
    try {

        const media = await readMedia()

        

        res.status(200).send(media)

    } catch (error) {
        next(error)
    }
})

mediaRouter.get("/:id", async (req,res,next) => {
    try {

        const media = await readMedia()

        const foundMovie = media.find( movie => movie.id === req.params.id)

        if(foundMovie) {
          
            res.status(200).send(foundMovie)
        } else {
            next(createHttpError(404, `Movie with id ${req.params.id} not found!`))

        }

        

        

    } catch (error) {
        next(error)
    }
})


mediaRouter.get("/:id/pdf", async (req,res,next) => {
    try {

        const media = await readMedia()

        const foundMovie = media.find( movie => movie.id === req.params.id)

        if(foundMovie) {

            res.setHeader("Content-Disposition", `attachment; filename=${req.params.id}.pdf`)
            const source = getPDFReadableStream(foundMovie)
            const destination = res
            pipeline(source, destination, err => {
              if (err) console.log(err)
          
            
        })
    }
        
        

    } catch (error) {
        next(error)
    }
})


export default mediaRouter