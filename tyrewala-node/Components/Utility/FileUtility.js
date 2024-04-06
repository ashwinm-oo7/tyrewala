const fs = require("fs");
const path = require("path");

const IMAGE_DELIMITER = "data:image/webp;base64,";
const PRODUCT_IMAGE_PATH = "/home/uploadedImages/";

function saveBase64Image(encodedString, id, fileNameWithExtension) {
  try {
    if (typeof id !== "string" || typeof fileNameWithExtension !== "string") {
      throw new Error("ID and fileNameWithExtension must be strings.");
    }

    // console.log("Saving", encodedString, id, fileNameWithExtension);

    const base64Data = encodedString.replace(/^data:image\/webp;base64,/, "");
    const folderPath = path.join(PRODUCT_IMAGE_PATH, String(id));

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    const imagePath = path.join(folderPath, fileNameWithExtension + ".webp");
    fs.writeFileSync(imagePath, base64Data, "base64");

    return imagePath;
  } catch (error) {
    console.error("Error saving image:", error);
    throw error;
  }
}

function saveBase64File(encodedString, fileName, fileExtension) {
  if (!encodedString) {
    throw new Error("Encoded string is undefined.");
  }

  const base64Data = encodedString.replace(/^data:image\/webp;base64,/, "");
  const filePath = path.join(
    PRODUCT_IMAGE_PATH,
    fileName + "." + fileExtension
  );

  if (!fs.existsSync(PRODUCT_IMAGE_PATH)) {
    fs.mkdirSync(PRODUCT_IMAGE_PATH, { recursive: true });
  }

  fs.writeFileSync(filePath, base64Data, "base64");
  return filePath;
}

function getBase64Image(filePath) {
  try {
    if (!filePath) {
      throw new Error("File path is null or undefined.");
    }
    const absolutePath = path.resolve(filePath);
    // console.log("filePath : ", absolutePath);
    if (fs.existsSync(absolutePath)) {
      const data = fs.readFileSync(absolutePath);
      const base64Image = Buffer.from(data).toString("base64");
      return IMAGE_DELIMITER + base64Image;
    } else {
      throw new Error("File not found: " + filePath);
    }
  } catch (error) {
    console.error("Error getting base64 image:", error);
    throw error;
  }
}

function deleteFile(filePath) {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

module.exports = {
  saveBase64Image,
  saveBase64File,
  getBase64Image,
  deleteFile,
};
