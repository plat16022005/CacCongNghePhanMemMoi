const User = require("./user");
const Room = require("./room");
const RoomInvoice = require("./roomInvoice");
const RentalApplication = require("./rentalApplication");
const Guest = require("./guest");
const GuestAccessLog = require("./guestAccessLog");
const ParkingRegistration = require("./parkingRegistration");
const SecurityIncident = require("./SecurityIncident");
const AssetMaintenance = require("./AssetMaintenance");
const MaintenanceRequest = require("./maintenanceRequest");
const MaintenanceExecution = require("./maintenanceExecution");
const Feedback = require("./feedback");
const Notification = require("./notification");

module.exports = {
  User,
  Room,
  RoomInvoice,
  RentalApplication,
  Guest,
  GuestAccessLog,
  ParkingRegistration,
  SecurityIncident,
  AssetMaintenance,
  MaintenanceRequest,
  MaintenanceExecution,
  Feedback,
  Notification,
};
