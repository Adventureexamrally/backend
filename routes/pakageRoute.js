const express = require("express");
const router = express.Router();
const Pakage = require("../models/Pakage");
const PakageContent = require("../models/PakageContent");

// Get all packages

router.get("/get", async (req, res) => {
  try {
    const packages = await Pakage.find();
    res.json(packages);
  } catch (error) {
    res.json({ message: error.message });
  }
});

// Add a new package

router.post("/add", async (req, res) => {
  console.log(req.body);
  try {
    const newPackage = new Pakage(req.body);
    await newPackage.save();
    res.json(newPackage);
  } catch (error) {
    res.json({ message: error.message });
  }
});

// Delete a package

router.delete("/delete/:id", async (req, res) => {
  try {
    const packageToDelete = await Pakage.findByIdAndDelete(req.params.id);

    if (!packageToDelete) return res.json({ message: "No package found" });

    res.json(packageToDelete);
  } catch (error) {
    res.json({ message: error.message });
  }
});

// Update a package

router.patch("/update/:id", async (req, res) => {
  try {
    const packageToUpdate = await Pakage.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!packageToUpdate) return res.json({ message: "No package found" });

    res.json(packageToUpdate);
  } catch (error) {
    res.json({ message: error.message });
  }
});
// Update a package

router.get("/get/:id", async (req, res) => {
  try {
    const package = await Pakage.findById(req.params.id).populate("exams");
    res.json(package);
    if (!package) return res.json({ message: "No package found" });
  } catch (error) {
    res.json({ message: error.message });
  }
});

// send pakages id and name

router.get("/package-content/get-package", async (req, res) => {
  try {
    const package = await Pakage.find().select("name _id");
    res.json(package);
    if (!package) return res.json({ message: "No package content found" });
  } catch (error) {
    res.json({ message: error.message });
  }
});

router.get("/package-content/:link", async (req, res) => {
  try {
    const exams = await Pakage.find({ link_name: req.params.link }).populate(
      "exams"
    );
    if (!exams) return res.status(404).json({ message: "No exams found" });

    const package_content = await PakageContent.find({ packageId: exams[0]._id });
    if (!package_content)
      return res.status(404).json({ message: "No package found" });
    res.json({package_content: package_content, exams: exams});
  } catch (error) {
    res.json({ message: error.message });
  }
});

// Create new mock test series
router.post("/package-content", async (req, res) => {
  try {
    const mockTestSeries = new PakageContent(req.body);
    await mockTestSeries.save();
    res.status(201).json(mockTestSeries);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all mock test series
router.get("/package-content", async (req, res) => {
  try {
    const mockTestSeries = await PakageContent.find().select("title");
    res.json(mockTestSeries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single mock test series by ID
router.get("/package-content/:id", async (req, res) => {
  try {
    const mockTestSeries = await PakageContent.find({
      packageId: req.params.id,
    }).populate("packageId");
    const exams = await Pakage.findById(req.params.id).populate("exams");
    if (!mockTestSeries)
      return res.status(404).json({ message: "Mock Test Series not found" });
    res.json({ data: [mockTestSeries, exams] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update mock test series by ID
router.put("/package-content/:id", async (req, res) => {
  try {
    const mockTestSeries = await PakageContent.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!mockTestSeries)
      return res.status(404).json({ message: "Mock Test Series not found" });
    res.json(mockTestSeries);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete mock test series by ID
router.delete("/package-content/:id", async (req, res) => {
  try {
    const mockTestSeries = await PakageContent.findByIdAndDelete(req.params.id);
    if (!mockTestSeries)
      return res.status(404).json({ message: "Mock Test Series not found" });
    res.json({ message: "Mock Test Series deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
