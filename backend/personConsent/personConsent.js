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
    patientName: { x: 71, y: 132, fontSize: 12 },
    createdAt: { x: 494, y: 103, fontSize: 11 },
    mrn: { x: 365, y: 132, fontSize: 12 },
    soc: { x: 488, y: 132, fontSize: 12 },
    certificationStart: { x: 410, y: 154, fontSize: 10 },
    certificationEnd: { x: 473, y: 154, fontSize: 10 },
    patientSignatureDate: { x: 380, y: 660, fontSize: 11 },
    agencyRepDate: { x: 381, y: 722, fontSize: 11 },
    startMonth: { x: 463, y: 303, fontSize: 9 },
    endMonth: { x: 463, y: 476, fontSize: 9 },

    // discipline and new frequency fields
    discipline1: { x: 38, y: 333, fontSize: 10 },
    discipline2: { x: 38, y: 347, fontSize: 10 },
    discipline3: { x: 38, y: 360, fontSize: 10 },
    discipline4: { x: 38, y: 374, fontSize: 10 },
    discipline5: { x: 38, y: 386, fontSize: 10 },
    discipline6: { x: 38, y: 400, fontSize: 10 },

    newFrequency1: { x: 145, y: 333, fontSize: 10 },
    newFrequency2: { x: 145, y: 347, fontSize: 10 },
    newFrequency3: { x: 145, y: 360, fontSize: 10 },
    newFrequency4: { x: 145, y: 374, fontSize: 10 },
    newFrequency5: { x: 145, y: 386, fontSize: 10 },
    newFrequency6: { x: 145, y: 400, fontSize: 10 },

    // signatures
    patientSignature: { x: 85, y: 600, isSignature: true },
    agencyRepSignature: { x: 87, y: 665, isSignature: true },
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
    if (patientData.createdAt) page1Data.createdAt = patientData.createdAt;
    if (patientData.soc) page1Data.soc = patientData.soc;
    if (patientData.mrn) page1Data.mrn = patientData.mrn;
    if (patientData.certificationStart)
      page1Data.certificationStart = patientData.certificationStart;
    if (patientData.certificationEnd)
      page1Data.certificationEnd = patientData.certificationEnd;
    if (patientData.patientSignatureDate)
      page1Data.patientSignatureDate = patientData.patientSignatureDate;
    if (patientData.agencyRepDate)
      page1Data.agencyRepDate = patientData.agencyRepDate;
    if (patientData.startMonth) page1Data.startMonth = patientData.startMonth;
    if (patientData.endMonth) page1Data.endMonth = patientData.endMonth;

    // Handle discipline frequencies array
    if (
      patientData.disciplineFrequencies &&
      Array.isArray(patientData.disciplineFrequencies)
    ) {
      patientData.disciplineFrequencies.forEach((item, index) => {
        const rowNumber = index + 1;
        if (rowNumber <= 6) {
          // Only handle up to 6 rows as defined in coordinates
          if (item.discipline) {
            page1Data[`discipline${rowNumber}`] = item.discipline;
          }
          if (item.newFrequency) {
            page1Data[`newFrequency${rowNumber}`] = item.newFrequency;
          }
        }
      });
    }

    fillPage(pages[0], fieldCoordinates.page1, page1Data);

    if (
      patientData.patientSignature &&
      patientData.patientSignature.startsWith("data:image/")
    ) {
      await drawSignature(
        pdfDoc,
        pages[0],
        fieldCoordinates.page1.patientSignature,
        patientData.patientSignature
      );
    }
    if (
      patientData.agencyRepSignature &&
      patientData.agencyRepSignature.startsWith("data:image/")
    ) {
      await drawSignature(
        pdfDoc,
        pages[0],
        fieldCoordinates.page1.agencyRepSignature,
        patientData.agencyRepSignature
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
            fontSize
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
  width = 250,
  height = 100
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

export { fillCompletePDF, fillAllCoordinatePages, fieldCoordinates };
