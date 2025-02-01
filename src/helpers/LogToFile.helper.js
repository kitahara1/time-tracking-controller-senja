import path from 'path'
import fs from 'fs';

/**
 * Logs an error to a specified log file.
 * @param {Error} [error] - The actual error object.
 */

export default function logError(error) {
  const logDirectory = './server_data/log'
  const logFilePath = path.join(logDirectory, 'error.log');

  if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory, { recursive: true });
  }

  const timestamp = new Date().toLocaleString('id-ID');
  const errorDetails = error ? `\nDetail:\n${error.message}\nStack Trace:\n${error.stack}` : '';
  const logEntry = `[${timestamp}] ${error.name}${errorDetails}\n\n`;

  // Append the log entry to the log file
  fs.appendFile(logFilePath, logEntry, (err) => {
    if (err) {
      console.error('Failed to write to log file:', err);
    }
  });
}
