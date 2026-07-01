const express = require("express");
const router = express.Router();
const publicController = require("../controllers/public.controller");
const { getApartmentsRules, createViewingRequestRules } = require("../validations/public.validation");
const { validate } = require("../middlewares/validate.middleware");
const rateLimit = require("express-rate-limit");

const viewingRequestLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 viewing requests per `window` (here, per hour)
  message: { message: "Bạn đã đạt giới hạn gửi yêu cầu. Vui lòng thử lại sau 1 giờ." },
  standardHeaders: true,
  legacyHeaders: false,
});

router.get("/apartments", getApartmentsRules, validate, publicController.getApartments);
router.get("/apartments/:id", publicController.getApartmentDetail);
router.get("/apartments/:id/similar", publicController.getSimilarApartments);

router.post("/viewing-requests", viewingRequestLimiter, createViewingRequestRules, validate, publicController.createViewingRequest);

module.exports = router;
