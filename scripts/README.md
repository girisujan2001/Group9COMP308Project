# Port Management Tools

## Overview
A cross-platform port management utility designed to help developers resolve port conflicts in development environments.

## Features
- Detect processes using specific ports
- Forcefully terminate conflicting processes
- Cross-platform support (Windows, macOS, Linux)
- Release multiple ports simultaneously
- Detailed logging and error handling

## Supported Platforms
- Windows 10/11
- macOS (Big Sur and later)
- Linux (Ubuntu, Fedora, CentOS)

## Prerequisites
- Node.js 14+ installed
- Administrative/sudo privileges recommended

## Installation
No additional installation required. The script is part of the project's npm scripts.

## Usage

### Release All Configured Ports
```bash
npm run release-ports
```

### Release Specific Ports
```bash
# Release individual ports
node scripts/port-manager.js 4001 5000

# Release multiple ports
npm run release-ports
```

## Ports in Community Engagement System
- 4001: Auth Service
- 4002: Community Service
- 5000: Host App
- 5001: Auth App
- 5002: Community App

## How It Works
1. Identifies processes using specified ports
2. Retrieves Process ID (PID) using platform-specific commands
3. Forcefully terminates identified processes
4. Provides detailed logging of actions

## Troubleshooting
- Ensure you run with administrative privileges
- Check firewall settings if port release fails
- Verify no critical system processes are interrupted

## Error Handling
- Provides clear error messages
- Handles various scenarios like:
  * No process found on port
  * Permission issues
  * Unsupported platforms

## Programmatic Usage
The script can also be imported as a module:
```javascript
import PortManager from './port-manager.js';

// Release a specific port
PortManager.releasePort(4001);

// Find process on a port
const pid = PortManager.findProcessOnPort(5000);
```

## Contributing
Contributions welcome! Please submit pull requests or open issues.

## License
MIT License