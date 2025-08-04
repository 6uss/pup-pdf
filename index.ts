import express from "express";
import puppeteer, { Browser } from "puppeteer";
import fs from "fs/promises";
import path from "path";
import { v4 as uuid } from "uuid";

const app = express();
app.use(express.json({ limit: "10mb" }));

let browser: Browser;

async function getBrowser(): Promise<Browser> {
  if (!browser || !browser.isConnected()) {
    browser = await puppeteer.launch({
      args: ["--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-gpu",
        "--disable-dev-shm-usage",
        "--disable-extensions",
        "--disable-infobars",
        "--hide-scrollbars",
        "--font-render-hinting=none",],
    });
  }
  return browser;
}

app.post("/generate", async (req, res) => {
  const html: string = req.body.html;
  const returnBase64: boolean = req.body.base64 ?? false;

  if (!html) return res.status(400).json({ error: "Missing HTML" });

  try {
    const browser = await getBrowser();
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "domcontentloaded" });
    const pdfBuffer = await page.pdf({ printBackground: false, format: "letter" });
    await page.close();

    if (returnBase64) {
      return res.json({ pdf: pdfBuffer.toString("base64") });
    }

    const filename = `${uuid()}.pdf`;
    const filepath = path.join("/output", filename);
    await fs.writeFile(filepath, pdfBuffer);

    res.json({ success: true, file: filename, path: filepath });
  } catch (err) {
    console.error("PDF generation error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Puppeteer PDF service running on port ${PORT}`);
  // Start the browser eagerly to avoid the first request being slow
  await getBrowser();
});
