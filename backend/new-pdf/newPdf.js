import { PDFDocument, rgb } from "pdf-lib";
import * as fontkit from "fontkit";
import fs from "fs";

const shouldFillField = (value) => {
  return (
    value !== null && value !== undefined && value !== "" && value !== false
  );
};

const getTextFieldValue = (value) => {
  if (value === null || value === undefined || value === "") {
    return null;
  }
  return value;
};

const fieldCoordinates = {
  page1: {
    patientName: { x: 127, y: 135, fontSize: 12 },
    patientNumber: { x: 424, y: 135, fontSize: 12 },
    serviceEndDate: { x: 148, y: 182, fontSize: 12 },
    currentServiceType: { x: 146, y: 218, fontSize: 12 },
  },
  page2: {
    currentPlanInfo: { x: 54, y: 178, fontSize: 10 },
    additionalInfo: { x: 54, y: 249, fontSize: 10 },
    patientOrRepresentitiveSignature: { x: 30, y: 410, isSignature: true },
    patientOrRepresentitiveSignatureDate: { x: 456, y: 460, fontSize: 12 },
  },
};

async function fillCompletePDF(inputPath, outputPath, patientData) {
  const pdfBytes = fs.readFileSync(inputPath);
  const pdfDoc = await PDFDocument.load(pdfBytes);

  // Register fontkit for custom fonts
  pdfDoc.registerFontkit(fontkit);

  const pages = pdfDoc.getPages();

  await fillAllCoordinatePages(pages, patientData, pdfDoc);

  const filledPdfBytes = await pdfDoc.save();
  fs.writeFileSync(outputPath, filledPdfBytes);
}

async function fillAllCoordinatePages(pages, patientData, pdfDoc) {
  // Fill Page 1 (index 0) - Text fields only
  if (pages[0] && fieldCoordinates.page1) {
    const page1Data = {};

    if (patientData.patientName)
      page1Data.patientName = patientData.patientName;
    if (patientData.patientNumber)
      page1Data.patientNumber = patientData.patientNumber;
    if (patientData.serviceEndDate)
      page1Data.serviceEndDate = patientData.serviceEndDate;
    if (patientData.currentServiceType)
      page1Data.currentServiceType = patientData.currentServiceType;

    fillPage(pages[0], fieldCoordinates.page1, page1Data);
  }

  if (pages[1] && fieldCoordinates.page2) {
    const page2Data = {};

    if (patientData.currentPlanInfo)
      page2Data.currentPlanInfo = patientData.currentPlanInfo;
    if (patientData.additionalInfo)
      page2Data.additionalInfo = patientData.additionalInfo;
    if (patientData.patientOrRepresentitiveSignatureDate)
      page2Data.patientOrRepresentitiveSignatureDate =
        patientData.patientOrRepresentitiveSignatureDate;

    fillPage(pages[1], fieldCoordinates.page2, page2Data);

    if (
      patientData.patientOrRepresentitiveSignature &&
      patientData.patientOrRepresentitiveSignature.startsWith("data:image/")
    ) {
      await drawSignature(
        pdfDoc,
        pages[1],
        fieldCoordinates.page2.patientOrRepresentitiveSignature,
        patientData.patientOrRepresentitiveSignature
      );
    }
  }
}

function drawWrappedText(
  page,
  text,
  x,
  y,
  maxWidth,
  fontSize = 11,
  lineHeight = 14
) {
  const words = text.split(" ");
  let line = "";
  let offsetY = 0;

  words.forEach((word, i) => {
    const testLine = line ? line + " " + word : word;
    const estWidth = testLine.length * fontSize * 0.5;

    if (estWidth > maxWidth && line) {
      page.drawText(line, {
        x,
        y: y - offsetY,
        size: fontSize,
        color: rgb(0, 0, 0),
      });
      line = word;
      offsetY += lineHeight;
    } else {
      line = testLine;
    }

    if (i === words.length - 1) {
      page.drawText(line, {
        x,
        y: y - offsetY,
        size: fontSize,
        color: rgb(0, 0, 0),
      });
    }
  });
}

function fillPage(page, coordinates, data) {
  const { height } = page.getSize();
  const defaultFontSize = 12;

  for (const [field, value] of Object.entries(data)) {
    if (!coordinates[field]) continue;

    const coord = coordinates[field];

    if (coord.isSignature) {
      continue;
    }

    if (coord.circle) {
      if (shouldFillField(value)) {
        page.drawCircle({
          x: coord.x,
          y: height - coord.y,
          size: 14,
          borderColor: rgb(0, 0, 0),
          borderWidth: 1.5,
        });
      }
    } else {
      const textValue = getTextFieldValue(value);
      if (textValue !== null) {
        const fontSize = coord.fontSize || defaultFontSize;
        if (field === "additionalInfo" || field === "currentPlanInfo") {
          drawWrappedText(
            page,
            textValue.toString(),
            coord.x,
            height - coord.y,
            550,
            fontSize,
            
          );
        } else {
          page.drawText(textValue.toString(), {
            x: coord.x,
            y: height - coord.y,
            size: fontSize,
            color: rgb(0, 0, 0),
          });
        }
      }
    }
  }
}

async function drawSignature(
  pdfDoc,
  page,
  coord,
  signatureDataUrl,
  width = 200,
  height = 80
) {
  try {
    const base64 = signatureDataUrl.split(";base64,").pop();
    const signatureBuffer = Buffer.from(base64, "base64");

    let signatureImage;
    try {
      signatureImage = await pdfDoc.embedPng(signatureBuffer);
    } catch (pngError) {
      try {
        signatureImage = await pdfDoc.embedJpg(signatureBuffer);
      } catch (jpgError) {
        console.error(`❌ Unsupported image format. Please use PNG or JPG.`);
        return;
      }
    }

    const { height: pageHeight } = page.getSize();

    page.drawImage(signatureImage, {
      x: coord.x,
      y: pageHeight - coord.y - height,
      width: width,
      height: height,
    });
  } catch (error) {
    console.error(`❌ Error drawing signature: ${error.message}`);
  }
}

export {
  fillCompletePDF,
  fillAllCoordinatePages,
  fieldCoordinates,
};