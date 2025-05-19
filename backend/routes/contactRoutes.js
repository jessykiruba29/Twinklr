import express from 'express';
const router = express.Router();



router.route("/").get((req, res) => {
  res.status(200).json({ message: "get it" });
});


router.route("/").post((req, res) => {
  console.log("req body: ",req.body);
  const {name,email}=req.body;
  if(!name ||!email){
    res.status(400);
    throw new Error("all fields are mandatory");
  }
  res.status(200).json({ message: "create" });
});


router.route("/:id").put((req, res) => {
  res.status(200).json({ message: `update ${req.params.id}` });
});




export default router; // ✅ use ES module export
