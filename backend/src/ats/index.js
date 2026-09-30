const GreenhouseProvider = require("./greenhouse/service");
const LeverProvider = require("./lever/service");
const AshbyProvider = require("./ashby/service");

// Registry of supported ATS providers.
// Adding a new ATS connector only requires placing its folder under src/ats/ and adding it here.
const providers = {
  greenhouse: new GreenhouseProvider(),
  lever: new LeverProvider(),
  ashby: new AshbyProvider()
};

/**
 * Returns the instanced provider for a given ATS name.
 * @param {string} atsName - The name of the ATS (e.g. 'greenhouse').
 * @returns {ATSProvider} The matching ATS provider.
 * @throws {Error} If provider is unsupported.
 */
function getProvider(atsName) {
  if (!atsName) {
    throw new Error("ATS provider name is required.");
  }
  const provider = providers[atsName.toLowerCase().trim()];
  if (!provider) {
    throw new Error(`ATS provider '${atsName}' is not supported yet.`);
  }
  return provider;
}

module.exports = {
  getProvider,
  providers
};
