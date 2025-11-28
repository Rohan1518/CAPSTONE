#!/bin/bash

# Exit on error
set -e

# Backend setup
echo "--- Setting up backend ---"
cd backend
npm install
npm start &
cd ..

# Frontend setup
echo "--- Setting up frontend ---"
cd frontend
npm install
npm start &

echo "--- Application is running ---"
echo "Backend is on port 5000"
echo "Frontend is on port 3000"
