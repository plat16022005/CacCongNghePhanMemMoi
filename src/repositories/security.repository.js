const Guest = require("../models/guest");
const VehicleLog = require("../models/vehicleLog");
const Incident = require("../models/incident");

class SecurityRepository {
  async getDashboardStats(date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // Guests today
    const guestsToday = await Guest.countDocuments({
      visitDate: { $gte: startOfDay, $lte: endOfDay },
    });

    const guestsCheckedIn = await Guest.countDocuments({
      visitDate: { $gte: startOfDay, $lte: endOfDay },
      status: "checked_in"
    });

    const guestsCheckedOut = await Guest.countDocuments({
      visitDate: { $gte: startOfDay, $lte: endOfDay },
      status: "checked_out"
    });

    const openIncidents = await Incident.countDocuments({
      status: { $in: ["open", "in_progress"] }
    });

    // Dummy value for pendingVehicleRegistrations, as security doesn't usually approve them 
    // but may want to see how many are waiting to be issued a card. 
    // (We'll assume 0 or query from ParkingRegistration if needed)
    
    return {
      date: date.toISOString().split("T")[0],
      shift: new Date().getHours() < 12 ? "morning" : new Date().getHours() < 18 ? "afternoon" : "night",
      guestsToday,
      guestsCheckedIn,
      guestsCheckedOut,
      pendingVehicleRegistrations: 0,
      openIncidents
    };
  }
}

module.exports = new SecurityRepository();
