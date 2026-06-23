export interface ParsedBspRecord {
  ticketNumber: string;
  transactionType: string;
  issueDate: Date | null;
  billingAmount: string;
  taxAmount: string;
  commissionAmount: string;
}

/**
 * Parses a BSP Billing File content (supports Delimiter-Separated CSV/TXT and IATA Fixed-Width layout).
 */
export function parseBspFile(content: string): ParsedBspRecord[] {
  const rawLines = content.split(/\r?\n/);
  // Filter out empty lines to avoid issues with template literals or blank padding
  const lines = rawLines.map(line => line.trim()).filter(line => line.length > 0);

  if (lines.length === 0) return [];

  const records: ParsedBspRecord[] = [];
  const firstLine = lines[0];

  // Detect delimiter-separated format (CSV, Semicolon, Tab)
  const isDelimited = firstLine.includes(";") || firstLine.includes(",") || firstLine.includes("\t");

  if (isDelimited) {
    const delimiter = firstLine.includes(";") ? ";" : firstLine.includes("\t") ? "\t" : ",";
    
    // Check if the first line is a header row
    const hasHeader = /ticket|bilhete|faturado|valor|amount/i.test(firstLine);
    const startIdx = hasHeader ? 1 : 0;

    for (let i = startIdx; i < lines.length; i++) {
      const line = lines[i];
      if (line.startsWith("#")) continue;

      const cols = line.split(delimiter);
      if (cols.length < 3) continue;

      const ticketNumber = cols[0]?.trim().replace(/[-\s]/g, "");
      const transactionType = (cols[1]?.trim() || "SALE").toUpperCase();
      const billingAmount = parseFloat(cols[2]?.trim() || "0").toFixed(2);
      const taxAmount = cols[3] ? parseFloat(cols[3]?.trim()).toFixed(2) : "0.00";
      const commissionAmount = cols[4] ? parseFloat(cols[4]?.trim()).toFixed(2) : "0.00";
      
      let issueDate = new Date();
      if (cols[5]) {
        const parsedDate = new Date(cols[5].trim());
        if (!isNaN(parsedDate.getTime())) {
          issueDate = parsedDate;
        }
      }

      if (ticketNumber && !isNaN(parseFloat(billingAmount))) {
        records.push({
          ticketNumber,
          transactionType,
          issueDate,
          billingAmount,
          taxAmount,
          commissionAmount,
        });
      }
    }
  } else {
    // Process as Fixed-Width (IATA RET/HOT simplificado)
    for (const line of lines) {
      if (line.length < 50) continue; // too short to be a valid fixed-width BSP line
      
      const recordType = line.substring(0, 3).trim().toUpperCase();
      const isDocumentLine = ["BFT", "BPD", "HOT", "BFM"].includes(recordType) || /^\d{3}/.test(recordType);

      if (isDocumentLine) {
        // Positions mapping:
        // Ticket Number: positions 9 to 23 (14 chars)
        // Transaction Type: positions 23 to 27 (4 chars, e.g. SALE, RFND)
        // Issue Date: positions 27 to 35 (8 chars, YYYYMMDD)
        // Billing Amount: positions 35 to 47 (12 chars, em centavos)
        // Tax Amount: positions 47 to 59 (12 chars, em centavos)
        // Commission Amount: positions 59 to 71 (12 chars, em centavos)
        const ticketNumber = line.substring(9, 23).trim().replace(/[-\s]/g, "");
        const rawType = line.substring(23, 27).trim().toUpperCase();
        const transactionType = rawType.includes("RFND") || rawType.includes("REF") ? "REFUND" : "SALE";
        
        const rawDate = line.substring(27, 35).trim();
        let issueDate: Date | null = null;
        if (rawDate.length === 8 && /^\d+$/.test(rawDate)) {
          const year = parseInt(rawDate.substring(0, 4));
          const month = parseInt(rawDate.substring(4, 6)) - 1;
          const day = parseInt(rawDate.substring(6, 8));
          issueDate = new Date(year, month, day);
        }

        const parseFixedAmount = (str: string) => {
          const cleaned = str.trim();
          if (!cleaned || !/^-?\d+[+-]?$/.test(cleaned)) return "0.00";
          const isNegative = cleaned.endsWith("-") || cleaned.startsWith("-");
          let numericStr = cleaned.replace(/[-+]/g, "");
          const cents = parseInt(numericStr);
          if (isNaN(cents)) return "0.00";
          const sign = isNegative ? -1 : 1;
          return ((cents * sign) / 100).toFixed(2);
        };

        const billingAmount = parseFixedAmount(line.substring(35, 47));
        const taxAmount = parseFixedAmount(line.substring(47, 59));
        const commissionAmount = parseFixedAmount(line.substring(59, 71));

        if (ticketNumber && ticketNumber.length > 5) {
          records.push({
            ticketNumber,
            transactionType,
            issueDate,
            billingAmount,
            taxAmount,
            commissionAmount,
          });
        }
      }
    }
  }

  return records;
}
