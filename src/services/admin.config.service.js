const SystemConfig = require("../models/systemConfig");

// In-memory cache
let configCache = null;
let lastFetch = 0;

class AdminConfigService {
  async getAllConfig() {
    const configs = await SystemConfig.find();
    
    // Convert array of {key, value} to nested object
    // e.g. "invoice.dueDays": 15 => { invoice: { dueDays: 15 } }
    const result = {};
    for (const c of configs) {
      const parts = c.key.split(".");
      let current = result;
      for (let i = 0; i < parts.length - 1; i++) {
        if (!current[parts[i]]) current[parts[i]] = {};
        current = current[parts[i]];
      }
      current[parts[parts.length - 1]] = c.value;
    }
    return result;
  }

  async updateConfig(data, adminUser) {
    // data is a nested object, need to flatten it
    const flattened = {};
    const flatten = (obj, prefix = "") => {
      for (const [k, v] of Object.entries(obj)) {
        if (typeof v === "object" && v !== null && !Array.isArray(v)) {
          flatten(v, `${prefix}${k}.`);
        } else {
          flattened[`${prefix}${k}`] = v;
        }
      }
    };
    flatten(data);

    // Update each key
    for (const [key, value] of Object.entries(flattened)) {
      await SystemConfig.findOneAndUpdate(
        { key },
        { value, updatedBy: adminUser.userId },
        { upsert: true }
      );
    }

    // Invalidate cache
    configCache = null;

    return { success: true };
  }

  // Utility for other services to get config
  async get(key, defaultValue = null) {
    const now = Date.now();
    if (!configCache || now - lastFetch > 5 * 60 * 1000) {
      const all = await SystemConfig.find();
      configCache = {};
      all.forEach(c => configCache[c.key] = c.value);
      lastFetch = now;
    }

    return configCache[key] !== undefined ? configCache[key] : defaultValue;
  }
}

module.exports = new AdminConfigService();
