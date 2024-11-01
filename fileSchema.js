import mongoose, { Schema } from "mongoose";

const pdfSchema = new mongoose.Schema({
    filename: String,
    content: Buffer,
    sender: String,
    receiver: String
});

const PdfFile = mongoose.model('PdfFile', pdfSchema);

export default PdfFile