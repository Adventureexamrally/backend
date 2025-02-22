const express = require('express');
const router = express.Router();
const Page = require('../models/page');

// Get all pages for the admin to select
router.get('/get-pages', async (req, res) => {
  try {
    const pages = await Page.find();
    res.json({ pages });
  } catch (err) {
    console.error('Error fetching pages:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Update SEO data for a specific page
router.post('/update-seo/:pageId', async (req, res) => {
  const { pageId } = req.params;
  const { title, description, keywords } = req.body;

  try {
    const page = await Page.findById(pageId);
    
    if (!page) {
      return res.status(404).json({ message: 'Page not found' });
    }

    page.seoData = { title, description, keywords };
    await page.save();

    res.status(200).json({ message: 'page added successfully' });
  } catch (err) {
    console.error('Error updating SEO:', err);
    res.status(500).json({ message: 'Failed to update SEO meta tags' });
  }
});

router.post('/add-page', async (req, res) => {
    const { title, description, keywords } = req.body;
  
    try {
      const page = new Page({
        name: 'New Page',
        slug: 'new-page',
        seoData: { title, description, keywords },
      });
      await page.save();
      res.status(200).json({ message: 'SEO meta tags updated successfully' });
    } catch (err) {
      console.error('Error updating SEO:', err);
      res.status(500).json({ message: 'Failed to update SEO meta tags' });
    }
  });

module.exports = router;
