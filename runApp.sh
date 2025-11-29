#!/bin/bash

client_dir="./client"
server_dir="./server"

echo "Running Angular app..."
cd "$client_dir" && npm start & 

echo "Waiting to building Angular App..."
sleep 10

echo "Running ASP.NET app..."
cd "$server_dir" && dotnet run
