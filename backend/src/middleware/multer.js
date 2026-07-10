// middleware/multer.js
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// Configure storage
const profileStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "profile_pictures", //Cloudinary folder
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  },
});


// ✅ Document Storage (any file type)
const documentStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "user_documents",
    resource_type: "auto", // auto-detect image, pdf, docx, etc.
    allowed_formats: ["jpg", "jpeg", "png", "pdf", "doc", "docx"],
  },
});

const resumeStorage = new CloudinaryStorage({
  cloudinary,
    params: {
      folder: "user_resumes",
      resource_type: "raw",
      allowed_formats: ["pdf", "doc", "docx"],
    }
})

// Initialize upload middleware

const uploadProfile= multer({
  storage: profileStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max file size
});

const uploadDocuments = multer({
  storage: documentStorage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB max
});

const uploadResume = multer({
  storage: resumeStorage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB max
})



module.exports = {uploadProfile, uploadDocuments, uploadResume};
