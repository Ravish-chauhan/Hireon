const axios = require("axios");
const pdfParse = require("pdf-parse");

module.exports.extractTextFromPDF = async function (pdfUrl) {
  try {
    // Download file as array buffer
    const response = await axios.get(pdfUrl, { responseType: "arraybuffer" });

    const pdfData = response.data;

    const parsed = await pdfParse(pdfData);

    return parsed.text || "";
  } catch (err) {
    console.error("❌ PDF Extraction Failed:", err);
    return "";
  }
};