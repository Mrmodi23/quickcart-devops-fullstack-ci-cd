const { MongoMemoryServer } = require('mongodb-memory-server');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config();

let mongod = null;

const cleanup = async () => {
  if (mongod) {
    try {
      await mongod.stop();
    } catch (e) {
      // Ignore shutdown errors
    }
    mongod = null;
  }
};

// Handle nodemon restart
process.once('SIGUSR2', async () => {
  await cleanup();
  process.kill(process.pid, 'SIGUSR2');
});

// Handle termination signals
process.on('SIGINT', async () => {
  await cleanup();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await cleanup();
  process.exit(0);
});

(async () => {
  try {
    const dbDir = path.join(__dirname, '.mongo-data');
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    // Clean up stale lock if no mongod is running
    const lockFile = path.join(dbDir, 'mongod.lock');
    if (fs.existsSync(lockFile)) {
      try {
        fs.unlinkSync(lockFile);
      } catch (e) {
        // Locked by active process
      }
    }

    // Start embedded MongoDB with persistent storage
    mongod = await MongoMemoryServer.create({
      instance: {
        dbPath: dbDir,
        storageEngine: 'wiredTiger',
      },
    });

    const uri = mongod.getUri();
    process.env.MONGO_URI = uri;
    fs.writeFileSync(path.join(__dirname, '.mongo-uri'), uri);
    
    console.log(`\n======================================================`);
    console.log(`[Persistent Embedded MongoDB] Started successfully!`);
    console.log(`[Storage Location] ${dbDir}`);
    console.log(`[Database URI] ${uri}`);
    console.log(`[Data Persistence] All users, orders & credentials will be SAVED.`);
    console.log(`======================================================\n`);

    // Import initial seed only if database is brand new and empty
    try {
      const { runSeeder } = require('./seeder');
      await runSeeder(false);
    } catch (e) {
      console.error('Failed to run initial seed check:', e);
    }

    // Start the Express server
    require('./server.js');
    
  } catch (err) {
    console.error('Failed to start Embedded MongoDB:', err);
    process.exit(1);
  }
})();
