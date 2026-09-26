const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;
const WEB_URL = process.env.WEB_URL || 'http://localhost:3000';

app.use(cors({ origin: WEB_URL }));
app.use(express.json({ limit: '20mb' }));

// Serve static assets
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// GET /templates — list all templates (metadata only)
app.get('/templates', (req, res) => {
  const templatesDir = path.join(__dirname, 'templates');
  const files = fs.readdirSync(templatesDir).filter(f => f.endsWith('.json'));

  const templates = files.map(file => {
    const data = JSON.parse(fs.readFileSync(path.join(templatesDir, file), 'utf8'));
    return {
      id: data.id,
      name: data.name,
      category: data.category,
      thumbnail: data.thumbnail,
      width: data.width,
      height: data.height,
      description: data.description,
    };
  });

  const { category } = req.query;
  const filtered = category && category !== 'all'
    ? templates.filter(t => t.category === category)
    : templates;

  res.json({ templates: filtered });
});

// GET /templates/:id — full template with layers/fields
app.get('/templates/:id', (req, res) => {
  const filePath = path.join(__dirname, 'templates', `${req.params.id}.json`);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Template not found' });
  }
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  res.json(data);
});

// GET /categories — list distinct categories
app.get('/categories', (req, res) => {
  const templatesDir = path.join(__dirname, 'templates');
  const files = fs.readdirSync(templatesDir).filter(f => f.endsWith('.json'));
  const categories = [...new Set(
    files.map(f => JSON.parse(fs.readFileSync(path.join(templatesDir, f), 'utf8')).category)
  )];
  res.json({ categories: ['all', ...categories] });
});

// POST /render — render template to image using Puppeteer
// Body: { templateId, fields, format, preset: { label, width, height } }
app.post('/render', async (req, res) => {
  const { templateId, fields, format = 'png', preset } = req.body;

  if (!templateId) {
    return res.status(400).json({ error: 'templateId is required' });
  }

  // Verify template exists
  const templatePath = path.join(__dirname, 'templates', `${templateId}.json`);
  if (!fs.existsSync(templatePath)) {
    return res.status(404).json({ error: `Template "${templateId}" not found` });
  }

  const template = JSON.parse(fs.readFileSync(templatePath, 'utf8'));

  // Only field-based (React) templates support server-side rendering
  if (!template.component) {
    return res.status(400).json({ error: 'Only field-based templates support server-side rendering' });
  }

  let browser;
  try {
    const puppeteer = require('puppeteer');

    // Encode fields as base64 to pass in URL
    const encodedFields = Buffer.from(JSON.stringify(fields || {})).toString('base64');
    const renderUrl = `${WEB_URL}/render/${templateId}?fields=${encodedFields}`;

    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security'],
    });

    const page = await browser.newPage();

    // Set viewport large enough for the template
    await page.setViewport({
      width: (preset?.width || template.width) + 200,
      height: (preset?.height || template.height) + 200,
      deviceScaleFactor: 1,
    });

    // Navigate to the render page
    await page.goto(renderUrl, { waitUntil: 'networkidle0', timeout: 30000 });

    // Wait for React to finish rendering (signalled by data attribute)
    await page.waitForSelector('[data-render-ready="true"]', { timeout: 15000 });

    // Screenshot just the template element (ignores header/chrome)
    const element = await page.$('#render-target');
    if (!element) {
      throw new Error('Render target element not found on page');
    }

    const screenshotOptions = {
      type: format === 'jpeg' ? 'jpeg' : 'png',
      ...(format === 'jpeg' && { quality: 95 }),
    };

    // If a target size preset is given, we resize the viewport to that and re-screenshot
    let imageBuffer;
    if (preset?.width && preset.width !== template.width) {
      // Scale the template to the target width, then screenshot
      const scale = preset.width / template.width;
      await page.evaluate((s) => {
        const target = document.getElementById('render-target');
        if (target) {
          const inner = target.firstElementChild;
          if (inner) {
            inner.style.transformOrigin = 'top left';
            inner.style.transform = `scale(${s})`;
          }
          target.style.width = `${target.offsetWidth * s}px`;
          target.style.height = `${target.offsetHeight * s}px`;
          target.style.overflow = 'hidden';
        }
      }, scale);

      await page.setViewport({
        width: Math.round(template.width * scale) + 100,
        height: Math.round(template.height * scale) + 100,
        deviceScaleFactor: 1,
      });

      imageBuffer = await element.screenshot(screenshotOptions);
    } else {
      imageBuffer = await element.screenshot(screenshotOptions);
    }

    const contentType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
    const ext = format === 'jpeg' ? 'jpg' : 'png';
    const filename = `${templateId}-${Date.now()}.${ext}`;

    // Optionally save to disk (uncomment to persist)
    // const outputDir = path.join(__dirname, 'outputs');
    // if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);
    // fs.writeFileSync(path.join(outputDir, filename), imageBuffer);

    res.set({
      'Content-Type': contentType,
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': imageBuffer.length,
    });
    res.send(imageBuffer);

  } catch (err) {
    console.error('[/render] Error:', err.message);
    res.status(500).json({ error: 'Render failed', detail: err.message });
  } finally {
    if (browser) await browser.close();
  }
});

app.listen(PORT, () => {
  console.log(`AIA Template Server running on http://localhost:${PORT}`);
});
