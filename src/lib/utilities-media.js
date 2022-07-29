import { fileURLToPath } from "url"
import { dirname, join } from "path"
import PdfPrinter from "pdfmake"
import fs from "fs-extra"

const { readJSON, writeJSON, writeFile, createReadStream, createWriteStream } = fs

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)),"../data")

export const readMedia = async () => fs.readJSON(join((dataFolderPath),"media.json"))

export const writeMedia = async (mediaArray) =>fs.writeJSON(join((dataFolderPath),"media.json"),mediaArray)

export const getPDFReadableStream = movie => {
    const fonts = {
      Roboto: {
        normal: "Helvetica",
        bold: "Helvetica-Bold",
      },
    }
  
    const printer = new PdfPrinter(fonts)

    const tableContent = [
        ["TITLE", "TYPE","YEAR","IMDB"],
       [movie.title,movie.type,movie.year,movie.id]
      ]
 

  
    const docDefinition = {
        content: [
            {
              style: "tableExample",
              table: {
                body: tableContent,
              },
            },
          ],
      
          styles: {
            header: {
              fontSize: 18,
              bold: true,
            },
            subheader: {
              fontSize: 15,
              bold: true,
            },
          },
        }
  
    const pdfReadableStream = printer.createPdfKitDocument(docDefinition, {})
    pdfReadableStream.end()
  
    return pdfReadableStream
  }

