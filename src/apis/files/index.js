import express from "express";
import multer from "multer"
import {v2 as cloudinary} from "cloudinary"
import { CloudinaryStorage } from "multer-storage-cloudinary";
import {pipeline} from "stream"
import { readMedia, writeMedia } from "../../lib/utilities-media.js";

const cloudinaryUploader = multer({
    storage: new CloudinaryStorage({
      cloudinary, 
      params: {
        folder: "jul29/media",
      },
    }),
    limits: { fileSize: 1024 * 1024 },
  }).single("poster")


const filesRouter = express.Router()

filesRouter.post("/:id", cloudinaryUploader ,async (req,res,next) => {
    try {

        const media = await readMedia()

        const movieToUpdateIndex = media.findIndex(movie => movie.id === req.params.id)

        if(movieToUpdateIndex !== -1){
            
            const movieToUpdate = {...media[movieToUpdateIndex], poster: req.file.path }

            media[movieToUpdateIndex] = movieToUpdate

            await writeMedia(media)
        }

        res.status(201).send({message:"Movie poster updated with:" + req.file.path})

        
        


    } catch (error) {
       next(error)
        
    }
})

export default filesRouter