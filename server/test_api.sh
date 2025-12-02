#!/bin/bash

BASE_URL="http://localhost:3000/api"
EMAIL="testuser@example.com"
PASSWORD="password123"

echo "Testing Treble Tunes API..."

# 1. Register
echo "\n1. Registering user..."
curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$EMAIL\", \"password\": \"$PASSWORD\", \"firstName\": \"Test\", \"lastName\": \"User\"}" \
  | grep -o '"success":true' && echo " - Registration successful" || echo " - Registration failed (might already exist)"

# 2. Login
echo "\n2. Logging in..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$EMAIL\", \"password\": \"$PASSWORD\"}")

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
USER_ID=$(echo $LOGIN_RESPONSE | grep -o '"id":"[^"]*' | cut -d'"' -f4)

if [ -n "$TOKEN" ]; then
  echo " - Login successful. Token received."
else
  echo " - Login failed."
  echo $LOGIN_RESPONSE
  exit 1
fi

# 3. Search Music
echo "\n3. Searching Music (Deezer)..."
curl -s "$BASE_URL/music/search?query=afrobeat&provider=deezer" | grep -q "deezer-" && echo " - Search successful" || echo " - Search failed"

# 4. Create Playlist
echo "\n4. Creating Playlist..."
PLAYLIST_RESPONSE=$(curl -s -X POST "$BASE_URL/playlists" \
  -H "Content-Type: application/json" \
  -d "{\"name\": \"My Afrobeat Mix\", \"userId\": \"$USER_ID\"}")

PLAYLIST_ID=$(echo $PLAYLIST_RESPONSE | grep -o '"_id":"[^"]*' | cut -d'"' -f4)

if [ -n "$PLAYLIST_ID" ]; then
  echo " - Playlist created. ID: $PLAYLIST_ID"
else
  echo " - Playlist creation failed."
  echo $PLAYLIST_RESPONSE
  exit 1
fi

# 5. Add Track to Playlist
echo "\n5. Adding Track to Playlist..."
TRACK_DATA='{"track":{"trackId":"deezer-123","trackName":"Test Track","artistName":"Test Artist","previewUrl":"http://test.com/preview.mp3"}}'
curl -s -X POST "$BASE_URL/playlists/$PLAYLIST_ID/tracks" \
  -H "Content-Type: application/json" \
  -d "$TRACK_DATA" | grep -q "Test Track" && echo " - Track added successful" || echo " - Track add failed"

# 6. Get Playlists
echo "\n6. Getting Playlists..."
curl -s "$BASE_URL/playlists" | grep -q "$PLAYLIST_ID" && echo " - Get playlists successful" || echo " - Get playlists failed"

# 7. Recommendations
echo "\n7. Getting Recommendations..."
curl -s "$BASE_URL/recommendations" | grep -q "Recommendations endpoint" && echo " - Recommendations successful" || echo " - Recommendations failed"

echo "\nAPI Testing Complete."
