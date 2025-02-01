import mongoose from 'mongoose'

class ModelHandler {
  constructor(server) {
    this.server = server;
  }

  async connect() {
    this.server.sendLogs('Connecting to MongoDB...');
    try {
      const dbUri = `mongodb+srv://${this.server.env.DB_USERNAME}:${this.server.env.DB_PASSWORD}@${this.server.env.DB_HOST}/?retryWrites=true&w=majority&appName=Cluster0`;

      await mongoose.connect(dbUri, {
        maxPoolSize: 15, // Maximum number of connections in the pool
        minPoolSize: 5,  // Minimum number of connections in the pool
        serverSelectionTimeoutMS: 30000, // Timeout after 30 seconds if no server is available
      });

      this.server.sendLogs('MongoDB Connected');
      this.db = mongoose.connection;

      // Log MongoDB queries if logging is enabled
      if (this.server.env.DB_LOGGING === 'true') {
        mongoose.set('debug', (collectionName, method, query, doc) => {
          this.server.sendLogs(`Query: ${method} on ${collectionName} with ${JSON.stringify(query)} ${doc ? `and document: ${JSON.stringify(doc)}` : ''}`);
        });
      }
    } catch (err) {
      console.error(err);
      this.server.sendLogs(err.message);
      this.server.ErrorLog(err);
      return -1;
    }

    return this.db;
  }
}

export default ModelHandler;
