#!/usr/bin/env node
import { execSync } from 'child_process';
import os from 'os';

class PortManager {
  static findProcessOnPort(port) {
    const platform = os.platform();
    
    try {
      switch (platform) {
        case 'win32':
          // Windows: Use netstat to find PID
          const windowsCmd = `netstat -ano | findstr :${port}`;
          const windowsOutput = execSync(windowsCmd, { encoding: 'utf-8' });
          const windowsMatch = windowsOutput.match(/\s+(\d+)$/m);
          return windowsMatch ? windowsMatch[1] : null;
        
        case 'darwin':
        case 'linux':
          // macOS/Linux: Use lsof to find PID
          const unixCmd = `lsof -ti:${port}`;
          return execSync(unixCmd, { encoding: 'utf-8' }).trim();
        
        default:
          throw new Error(`Unsupported platform: ${platform}`);
      }
    } catch (error) {
      if (error.message.includes('not found') || error.message.includes('no such process')) {
        console.log(`No process found using port ${port}`);
        return null;
      }
      console.error(`Error finding process on port ${port}:`, error.message);
      return null;
    }
  }

  static killProcess(pid, port) {
    const platform = os.platform();
    
    try {
      switch (platform) {
        case 'win32':
          execSync(`taskkill /PID ${pid} /F`);
          break;
        case 'darwin':
        case 'linux':
          execSync(`kill -9 ${pid}`);
          break;
        default:
          throw new Error(`Unsupported platform: ${platform}`);
      }
      console.log(`Successfully terminated process with PID ${pid} on port ${port}`);
      console.log(`Port ${port} is now available for use.`);
      return true;
    } catch (error) {
      console.error(`Error killing process ${pid} on port ${port}:`, error.message);
      return false;
    }
  }

  static releasePort(port) {
    console.log(`Attempting to release port ${port}`);
    const pid = this.findProcessOnPort(port);
    
    if (pid) {
      console.log(`Found process using port ${port}: PID ${pid}`);
      return this.killProcess(pid, port);
    } else {
      console.log(`No process found using port ${port}`);
      return false;
    }
  }

  static main() {
    const ports = process.argv.slice(2).map(Number).filter(port => !isNaN(port));
    
    if (ports.length === 0) {
      console.error('Please provide at least one port number');
      process.exit(1);
    }

    console.log(`Attempting to release ports: ${ports.join(', ')}`);
    
    const results = ports.map(port => ({
      port,
      released: this.releasePort(port)
    }));

    const allReleased = results.every(result => result.released);
    
    console.log('\nPort Release Summary:');
    results.forEach(result => {
      console.log(`Port ${result.port}: ${result.released ? 'Released' : 'Failed to Release'}`);
    });

    process.exit(allReleased ? 0 : 1);
  }
}

// Allow direct invocation
if (import.meta.url === `file://${process.argv[1]}`) {
  PortManager.main();
}

export default PortManager;