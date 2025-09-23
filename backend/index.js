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

const tableConfig = {
  startX: {
    medicationName: 70,
    cause: 250,
    resolution: 394,
  },
  startY: 296,
  rowHeight: 20,
  columnWidth: 164,
};

const medicationRows = [];

const checkboxCoordinates = {
  // page 4

  hmoMembershipTrue: { page: 3, x: 127, y: 406 },
  hmoMembershipFalse: { page: 3, x: 175, y: 406 },
  billingMethodMedicaid: { page: 3, x: 59, y: 478 },
  billingMethodMedicare: { page: 3, x: 59, y: 495 },
  billingMethodInsurance: { page: 3, x: 59, y: 509 },
  billingMethodPrivatepay: { page: 3, x: 59, y: 589 },

  // page 7

  advanceDirectiveOption1: { page: 6, x: 59, y: 517 },
  advanceDirectiveOption2: { page: 6, x: 59, y: 549 },
  advanceDirectiveOption3: { page: 6, x: 59, y: 580 },
  permissionToPhotograhTrue: { page: 6, x: 59, y: 700 },
  permissionToPhotograhFalse: { page: 6, x: 119, y: 700 },

  // page 8

  authorizationAccessFundsTrue: { page: 7, x: 59, y: 156 },
  authorizationAccessPersonalTrue: { page: 7, x: 59, y: 200 },
  authorizationAccessFundsFalse: { page: 7, x: 119, y: 156 },
  authorizationAccessPersonalFalse: { page: 7, x: 119, y: 200 },

  patientUnableToSign: { page: 7, x: 59, y: 618 },

  // page 10

  mentalStatusOriented: { page: 10, x: 143, y: 374 },
  mentalStatusDisoriented: { page: 10, x: 214, y: 374 },
  mentalStatusDementia: { page: 10, x: 297, y: 374 },
  mentalStatusForgetful: { page: 10, x: 373, y: 374 },
  mentalStatusAlert: { page: 10, x: 444, y: 374 },
  mentalStatusAlzheimer: { page: 10, x: 492, y: 374 },

  emergencyLevel1: { page: 10, x: 57, y: 436 },
  emergencyLevel2: { page: 10, x: 57, y: 479 },
  emergencyLevel3: { page: 10, x: 57, y: 522 },
  emergencyLevel4: { page: 10, x: 57, y: 565 },

  stayHome: { page: 10, x: 329, y: 625 },
};

const fieldCoordinates = {
  page1: {
    nursesName: { x: 141, y: 529, fontSize: 12 },
    physicalTherapistName: { x: 199, y: 555, fontSize: 12 },
    occupationalTherapistName: { x: 222, y: 581, fontSize: 12 },
    physicianName: { x: 136, y: 608, fontSize: 12 },
    allergies: { x: 132, y: 631, fontSize: 11 },
  },

  page3: {
    patientName: { x: 215, y: 214, fontSize: 12 },
    mrn: { x: 473, y: 214, fontSize: 12 },
    socDate: { x: 116, y: 238, fontSize: 12 },
    referralSourceDate: { x: 425, y: 238, fontSize: 12 },
    patientName2: { x: 67, y: 311, fontSize: 12 },
    agencyName: { x: 62, y: 327, fontSize: 12 },
    servicesPerception: { x: 208, y: 466, fontSize: 12 },
    authorizationPaymentDate: { x: 319, y: 605, fontSize: 12 },
    fillerOf2025: { x: 440, y: 605, fontSize: 12 },
  },

  page4: {
    payerName: { x: 158, y: 123, fontSize: 12 },
    projectCompletionPercent: { x: 370, y: 557, fontSize: 12 },
    amountCovered: { x: 291, y: 573, fontSize: 14 },

    // table here

    skilledNursingFrequencyData: { x: 193, y: 192, fontSize: 12 },
    physicalTherapyFrequencyData: { x: 193, y: 209, fontSize: 12 },
    homeHealthFrequencyData: { x: 193, y: 228, fontSize: 12 },
    occupationalTheraphyFrequencyData: { x: 193, y: 247, fontSize: 12 },
    medicalSocialWorkerFrequencyData: { x: 193, y: 266, fontSize: 12 },
    otherFrequencyData: { x: 193, y: 284, fontSize: 12 },
  },

  page8: {
    fundsInitials: { x: 218, y: 172, fontSize: 12 },
    vehicleInitials: { x: 159, y: 217, fontSize: 12 },
    patientOrAuthorizedAgentSignature: { x: 0, y: 445, isSignature: true },
    relationshipToPatient: { x: 310, y: 499, fontSize: 12 },
    patientOrAuthorizedAgentSignatureDate: { x: 461, y: 499, fontSize: 12 },
    agencyRepresentativeSignature: { x: 0, y: 505, isSignature: true },
    agencyTitle: { x: 310, y: 560, fontSize: 12 },
    agencyRepresentativeSignatureDate: { x: 461, y: 560, fontSize: 12 },
  },

  page9: {
    patientName: { x: 137, y: 187, fontSize: 12 },
  },

  page10: {
    patientSignature: { x: 0, y: 609, isSignature: true },
    patientSignatureDate: { x: 360, y: 665, fontSize: 12 },
  },

  page11: {
    clientName: { x: 132, y: 187, fontSize: 11 },
    dateOfBirth: { x: 380, y: 187, fontSize: 11 },
    age: { x: 507, y: 187, fontSize: 11 },
    date: { x: 91, y: 211, fontSize: 11 },
    mrNumber: { x: 345, y: 211, fontSize: 11 },
    address: { x: 108, y: 234, fontSize: 11 },
    caregiverName: { x: 148, y: 258, fontSize: 11 },
    phoneNumber: { x: 361, y: 258, fontSize: 11 },
    primaryLanguage: { x: 163, y: 282, fontSize: 11 },
    pharmacy: { x: 120, y: 306, fontSize: 11 },
    doctor: { x: 350, y: 306, fontSize: 11 },
    emergencyContact: { x: 171, y: 330, fontSize: 11 },
    relationship: { x: 127, y: 353, fontSize: 11 },
    contactPhone: { x: 361, y: 353, fontSize: 11 },
    clientSignature: { x: 99, y: 540, isSignature: true },
    allergies: { x: 110, y: 627, fontSize: 11 },
    evacuateTo: { x: 464, y: 627, fontSize: 11 },
    clinicianPrintName: { x: 207, y: 660, fontSize: 11 },
    clinicianSignature: { x: 120, y: 635, isSignature: true },
    clinicianSignatureDate: { x: 207, y: 703, fontSize: 11 },
  },

  page12: {
    patientSignature: { x: 0, y: 580, isSignature: true },
  },

  page13: {
    patientName: { x: 80, y: 207, fontSize: 9 },
    physicianName: { x: 240, y: 207, fontSize: 9 },
    physicianFax: { x: 396, y: 207, fontSize: 9 },
    OASISDate: { x: 540, y: 207, fontSize: 9 },
  },
};

async function fillCompletePDF(inputPath, outputPath, patientData) {
  const pdfBytes = fs.readFileSync(inputPath);
  const pdfDoc = await PDFDocument.load(pdfBytes);

  // Register fontkit for custom fonts
  pdfDoc.registerFontkit(fontkit);

  // Embed custom font for checkmarks
  const fontBytes = fs.readFileSync("DejaVuSans.ttf");
  const customFont = await pdfDoc.embedFont(fontBytes);

  const pages = pdfDoc.getPages();

  fillCheckboxesWithCoordinates(pages, patientData, customFont);
  await fillAllCoordinatePages(pages, patientData, pdfDoc);

  // Step 3: Fill medication table on page 13 (index 12)
  if (
    pages[12] &&
    patientData.medications &&
    patientData.medications.length > 0
  ) {
    fillMedicationTable(
      pages[12],
      patientData.medications,
      tableConfig,
      customFont
    );
  }

  const filledPdfBytes = await pdfDoc.save();
  fs.writeFileSync(outputPath, filledPdfBytes);
}

function fillCheckboxesWithCoordinates(pages, data, customFont) {
  Object.entries(checkboxCoordinates).forEach(([field, coord]) => {
    // Only fill checkbox if the field exists in data and is truthy
    if (data.hasOwnProperty(field) && data[field] === true) {
      const page = pages[coord.page];
      if (page) {
        const { height } = page.getSize();
        page.drawText("✔", {
          x: coord.x,
          y: height - coord.y,
          size: 14,
          font: customFont,
          color: rgb(0, 0, 0),
        });
      }
    }
  });
}

async function fillAllCoordinatePages(pages, patientData, pdfDoc) {
  // Fill Page 1 (index 0) - Text fields only
  if (pages[0] && fieldCoordinates.page1) {
    const page1Data = {};

    if (patientData.nursesName) page1Data.nursesName = patientData.nursesName;
    if (patientData.physicalTherapistName)
      page1Data.physicalTherapistName = patientData.physicalTherapistName;
    if (patientData.occupationalTherapistName)
      page1Data.occupationalTherapistName =
        patientData.occupationalTherapistName;
    if (patientData.physicianName)
      page1Data.physicianName = patientData.physicianName;
    if (patientData.allergies) page1Data.allergies = patientData.allergies;

    fillPage(pages[0], fieldCoordinates.page1, page1Data);
  }

  // Fill Page 2 (index 1)
  if (pages[2] && fieldCoordinates.page3) {
    const page2Data = {};

    if (patientData.patientName)
      page2Data.patientName = patientData.patientName;
    if (patientData.mrn) page2Data.mrn = patientData.mrn;
    if (patientData.socDate) page2Data.socDate = patientData.socDate;
    if (patientData.referralSourceDate)
      page2Data.referralSourceDate = patientData.referralSourceDate;

    if (patientData.patientName2)
      page2Data.patientName2 = patientData.patientName2;

    if (patientData.agencyName) {
      page2Data.agencyName = patientData.agencyName;
    }

    if (patientData.servicesPerception) {
      page2Data.servicesPerception = patientData.servicesPerception;
    }

    if (patientData.authorizationPaymentDate) {
      page2Data.authorizationPaymentDate = patientData.authorizationPaymentDate;
    }

    page2Data.fillerOf2025 = new Date().getFullYear().toString().slice(-2);

    fillPage(pages[2], fieldCoordinates.page3, page2Data);
  }

  if (pages[3] && fieldCoordinates.page4) {
    const page4Data = {};

    if (patientData.payerName) page4Data.payerName = patientData.payerName;
    if (patientData.projectCompletionPercent)
      page4Data.projectCompletionPercent = patientData.projectCompletionPercent;
    if (patientData.amountCovered)
      page4Data.amountCovered = patientData.amountCovered;

    page4Data.skilledNursingFrequencyData =
      patientData.skilledNursingFrequencyData || "N/A";
    page4Data.physicalTherapyFrequencyData =
      patientData.physicalTherapyFrequencyData || "N/A";
    page4Data.homeHealthFrequencyData =
      patientData.homeHealthFrequencyData || "N/A";
    page4Data.occupationalTheraphyFrequencyData =
      patientData.occupationalTheraphyFrequencyData || "N/A";
    page4Data.medicalSocialWorkerFrequencyData =
      patientData.medicalSocialWorkerFrequencyData || "N/A";
    page4Data.otherFrequencyData = patientData.otherFrequencyData || "N/A";

    fillPage(pages[3], fieldCoordinates.page4, page4Data);
  }

  if (pages[7] && fieldCoordinates.page8) {
    const page8Data = {};

    if (patientData.relationshipToPatient)
      page8Data.relationshipToPatient = patientData.relationshipToPatient;
    if (patientData.fundsInitials)
      page8Data.fundsInitials = patientData.fundsInitials;
    if (patientData.vehicleInitials)
      page8Data.vehicleInitials = patientData.vehicleInitials;
    if (patientData.patientOrAuthorizedAgentSignatureDate)
      page8Data.patientOrAuthorizedAgentSignatureDate =
        patientData.patientOrAuthorizedAgentSignatureDate;
    if (patientData.agencyTitle)
      page8Data.agencyTitle = patientData.agencyTitle;
    if (patientData.agencyRepresentativeSignatureDate)
      page8Data.agencyRepresentativeSignatureDate =
        patientData.agencyRepresentativeSignatureDate;

    if (patientData.clinicianDate)
      page8Data.clinicianDate = patientData.clinicianDate;

    fillPage(pages[7], fieldCoordinates.page8, page8Data);

    if (
      patientData.patientOrAuthorizedAgentSignature &&
      patientData.patientOrAuthorizedAgentSignature.startsWith("data:image/")
    ) {
      await drawSignature(
        pdfDoc,
        pages[7],
        fieldCoordinates.page8.patientOrAuthorizedAgentSignature,
        patientData.patientOrAuthorizedAgentSignature
      );
    }

    // Draw representative signature if exists
    if (
      patientData.agencyRepresentativeSignature &&
      patientData.agencyRepresentativeSignature.startsWith("data:image/")
    ) {
      await drawSignature(
        pdfDoc,
        pages[7],
        fieldCoordinates.page8.agencyRepresentativeSignature,
        patientData.agencyRepresentativeSignature
      );
    }
  }

  if (pages[8] && fieldCoordinates.page9) {
    const page9Data = {};

    if (patientData.patientName)
      page9Data.patientName = patientData.patientName;

    fillPage(pages[8], fieldCoordinates.page9, page9Data);
  }

  if (pages[9] && fieldCoordinates.page10) {
    const page10Data = {};

    if (patientData.patientSignatureDate)
      page10Data.patientSignatureDate = patientData.patientSignatureDate;

    fillPage(pages[9], fieldCoordinates.page10, page10Data);

    if (
      patientData.patientSignature &&
      patientData.patientSignature.startsWith("data:image/")
    ) {
      await drawSignature(
        pdfDoc,
        pages[9],
        fieldCoordinates.page10.patientSignature,
        patientData.patientSignature
      );
    }
  }

  if (pages[10] && fieldCoordinates.page11) {
    const page11Data = {};

    if (patientData.clientName) page11Data.clientName = patientData.clientName;
    if (patientData.dateOfBirth)
      page11Data.dateOfBirth = patientData.dateOfBirth;
    if (patientData.age) page11Data.age = patientData.age;
    if (patientData.mrNumber) page11Data.mrNumber = patientData.mrNumber;
    if (patientData.date) page11Data.date = patientData.date;
    if (patientData.address) page11Data.address = patientData.address;
    if (patientData.caregiverName)
      page11Data.caregiverName = patientData.caregiverName;
    if (patientData.phoneNumber)
      page11Data.phoneNumber = patientData.phoneNumber;
    if (patientData.primaryLanguage)
      page11Data.primaryLanguage = patientData.primaryLanguage;
    if (patientData.pharmacy) page11Data.pharmacy = patientData.pharmacy;
    if (patientData.doctor) page11Data.doctor = patientData.doctor;
    if (patientData.emergencyContact)
      page11Data.emergencyContact = patientData.emergencyContact;
    if (patientData.relationship)
      page11Data.relationship = patientData.relationship;
    if (patientData.contactPhone)
      page11Data.contactPhone = patientData.contactPhone;
    if (patientData.allergies) page11Data.allergies = patientData.allergies;
    if (patientData.evacuateTo) page11Data.evacuateTo = patientData.evacuateTo;
    if (patientData.clinicianPrintName)
      page11Data.clinicianPrintName = patientData.clinicianPrintName;
    if (patientData.clinicianSignatureDate)
      page11Data.clinicianSignatureDate = patientData.clinicianSignatureDate;

    fillPage(pages[10], fieldCoordinates.page11, page11Data);

    if (
      patientData.clientSignature &&
      patientData.clientSignature.startsWith("data:image/")
    ) {
      await drawSignature(
        pdfDoc,
        pages[10],
        fieldCoordinates.page11.clientSignature,
        patientData.clientSignature
      );
    }
    if (
      patientData.clinicianSignature &&
      patientData.clinicianSignature.startsWith("data:image/")
    ) {
      await drawSignature(
        pdfDoc,
        pages[10],
        fieldCoordinates.page11.clinicianSignature,
        patientData.clinicianSignature
      );
    }
  }

  if (pages[11] && fieldCoordinates.page12) {
    if (
      patientData.patientSignature &&
      patientData.patientSignature.startsWith("data:image/")
    ) {
      await drawSignature(
        pdfDoc,
        pages[11],
        fieldCoordinates.page12.patientSignature,
        patientData.patientSignature
      );
    }
  }

  if (pages[12] && fieldCoordinates.page13) {
    const page13Data = {};
    if (patientData.physicianName)
      page13Data.physicianName = patientData.physicianName;
    if (patientData.physicianFax)
      page13Data.physicianFax = patientData.physicianFax;
    if (patientData.OASISDate) page13Data.OASISDate = patientData.OASISDate;
    if (patientData.patientName)
      page13Data.patientName = patientData.patientName;

    fillPage(pages[12], fieldCoordinates.page13, page13Data);
  }
}

function fillMedicationTable(page, rows, config, customFont) {
  const { height } = page.getSize();

  function truncateText(text, maxLength) {
    if (text && text.length > maxLength) {
      return text.substring(0, maxLength - 3) + "...";
    }
    return text || "";
  }

  function fitTextToColumn(text, maxWidth, fontSize = 9) {
    const avgCharWidth = fontSize * 0.6;
    const maxChars = Math.floor(maxWidth / avgCharWidth);
    return truncateText(text, maxChars);
  }

  rows.forEach((row, i) => {
    const y = config.startY + i * config.rowHeight;

    const fittedRow = {
      medicationName: fitTextToColumn(row.medicationName, 169, 9),
      cause: fitTextToColumn(row.cause, 169, 9),
      resolution: fitTextToColumn(row.resolution, 169, 9),
    };

    const textOptions = {
      size: 9,
      color: rgb(0, 0, 0),
    };

    page.drawText(fittedRow.medicationName, {
      x: config.startX.medicationName,
      y: height - y,
      ...textOptions,
    });

    page.drawText(fittedRow.cause, {
      x: config.startX.cause,
      y: height - y,
      ...textOptions,
    });

    page.drawText(fittedRow.resolution, {
      x: config.startX.resolution,
      y: height - y,
      ...textOptions,
    });
  });
}

function drawWrappedText(
  page,
  text,
  x,
  y,
  maxWidth,
  fontSize = 12,
  lineHeight = 20
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
        if (field === "additionalInfo") {
          drawWrappedText(
            page,
            textValue.toString(),
            coord.x,
            height - coord.y,
            450,
            fontSize,
            fontSize + 2
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

export {
  fillCompletePDF,
  fillCheckboxesWithCoordinates,
  fillAllCoordinatePages,
  fillMedicationTable,
  fieldCoordinates,
  checkboxCoordinates,
  medicationRows,
  tableConfig,
};
