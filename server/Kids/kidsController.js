const multer = require("multer");
const parents = require("../Parent/parentSchema");
const { KidModel } = require("./kidSchema");

const storage = multer.diskStorage({
  destination: function (req, res, cb) {
    cb(null, "./upload");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage }).single("image");

const addKid = async (req, res) => {
  try {
    const { name, dob, birthWeight, weight, height, parentId, bloodGroup } =
      req.body;
    if (
      !name ||
      !dob ||
      !birthWeight ||
      !weight ||
      !height ||
      !parentId ||
      !bloodGroup
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
    const newKid = new KidModel({
      name: name,
      dob: dob,
      birthWeight: birthWeight,
      weight: weight,
      height: height,
      parentId: parentId,
      bloodGroup: bloodGroup,
      image: req.file?.path ? req.file : null,
    });

    await newKid.save();

    return res.status(201).json({
      status: 201,
      message: "Kid registration completed successfully.",
      data: newKid,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Kid registration failed, Internal Server Error",
      error: error,
    });
  }
};

//View all Users

const viewKids = (req, res) => {
  KidModel.find()
    .exec()
    .then((data) => {
      if (data.length > 0) {
        res.json({
          status: 200,
          msg: "Data obtained successfully",
          data: data,
        });
      } else {
        res.json({
          status: 200,
          msg: "No Data obtained ",
        });
      }
    })
    .catch((err) => {
      res.json({
        status: 500,
        msg: "Data not Inserted",
        Error: err,
      });
    });
};

// view  finished

//update  by id
const editKidById = (req, res) => {
  parents
    .findByIdAndUpdate(
      { _id: req.params.id },
      {
        name: req.body.name,
        dob: req.body.dob,
        birthWeight: req.body.birthWeight,
        weight: req.body.weight,
        height: req.body.height,
        parentId: req.body.parentId,
        bloodGroup: req.body.bloodGroup,
        image: req.file,
      }
    )
    .exec()
    .then((data) => {
      res.json({
        status: 200,
        msg: "Updated successfully",
      });
    })
    .catch((err) => {
      res.json({
        status: 500,
        msg: "Data not Updated",
        Error: err,
      });
    });
};
// view  by id
const viewKidById = (req, res) => {
  KidModel.findById({ _id: req.params.id })
    .exec()
    .then((data) => {
      res.json({
        status: 200,
        msg: "Data obtained successfully",
        data: data,
      });
    })
    .catch((err) => {
      console.log(err);
      res.json({
        status: 500,
        msg: "No Data obtained",
        Error: err,
      });
    });
};
// view  by id
const viewKidsByParentId = (req, res) => {
  KidModel.find({ parentId: req.params.id })
    .exec()
    .then((data) => {
      res.json({
        status: 200,
        msg: "Data obtained successfully",
        data: data,
      });
    })
    .catch((err) => {
      console.log(err);
      res.json({
        status: 500,
        msg: "No Data obtained",
        Error: err,
      });
    });
};
module.exports = {
  addKid,
  viewKidById,
  editKidById,
  viewKids,
  upload,
  viewKidsByParentId,
};
