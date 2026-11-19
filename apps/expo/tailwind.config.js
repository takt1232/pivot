// NativeWind spawns the Tailwind CLI with the app directory as cwd and does not
// forward `configPath`, so Tailwind needs a config here. The real config lives at
// the repo root and is shared with the Next.js app.
module.exports = require('../../tailwind.config.js')
