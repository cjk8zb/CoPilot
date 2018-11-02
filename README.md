<img src="Documentation/Images/CoPilotLogo@2x.png" width="720" style="margin:auto;display:block">

# CoPilot

## Description
A voice assistant designed specifically for pilots. Ask for weather conditions, ideal takeoff and landing speeds, or recommendations for optimal fuel management. Interfaces with the (closed source, proprietary, and separate) Team 11 Air Traffic Monitor allowing a pilot to ask about nearby aircrafts, and send and receive verbal commands to avoid potential collisions.

## Features / Requirements

 - Voice Recognition
 - Audible warnings / prompts
 - 3rd Party API Integration (weather, maps, airport availability? flight lines?)
 - TCAS Engine integration
 - Basic UI to accompany CoPilot responses
 - Fuel economy recommendations

## Interactions

### Weather

**Prompt:** How's the weather ahead?

**Behavior:** Use current lat / long + heading + velocity (or average if 0) to query weather conditions.

**Response:**

Positive:

- Clear skies ahead
- Looking good
- Great day for flying

Negative:

- It looks like {weather event}.
- Strong winds from the {cardinal direction}, Up to {speed} knots.

**Graphical Interface:** Image of weather + temperature.

### TCAS

**Prompt:** Any traffic?

**Behavior:** Query TCAS Engine for any airplanes.

**Response:** 

Positive:

- There are no aircraft in your immediate vicinity.

Negative (Safe, Notice, Caution, Danger):

- *Safe:* I found {number} aircraft near by, but you should be fine... I'll keep you posted.
- *Notice:* {number} aircraft close by, be prepared to take action.
- *Caution:* {number} aircraft too close, take action now.
- *Danger:* Game Over Man!!! I'm outta here!

**Graphical Interface:** Current TCAS Client Interface.

