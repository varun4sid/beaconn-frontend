# Beaconn

### Requirements

+ tsc (TypeScript Compiler)
```bash
npm install -g typescript
```

+ A web browser

### Setup

1. Clone the repository
```bash
git clone https://github.com/varun4sid/psgtech-beaconn.git
cd beaconn-frontend
```

2. Make the build script executable
```bash
chmod +x build.sh
```

3. Make changes to the sources code and run build script
```bash
./build.sh
```

4. Serve the `dist` directory using a web server of your choice (eg.: Python's built-in HTTP server)
```bash
cd dist
python3 -m http.server 8000
```

5. Open your web browser and navigate to `http://localhost:8000` to access the application.