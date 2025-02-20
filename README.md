# COMP-4513-Assignment-1

# COMP 4513 – Assignment 1

This is my Node-based API for the paintings/artists database assignment. It uses [Supabase](https://supabase.com/) for data storage and [Express.js](https://expressjs.com/) for handling API routes.

## Deployed API

**Base URL:** https://cuddly-shorthaired-son.glitch.me

## Endpoints

Click any link below to test the corresponding route in your browser:

1. **Eras**
   - [All eras](https://cuddly-shorthaired-son.glitch.me/eras)

2. **Galleries**
   - [All galleries](https://cuddly-shorthaired-son.glitch.me/galleries)
   - [Gallery by ID (example: 30)](https://cuddly-shorthaired-son.glitch.me/galleries/30)
   - [Galleries by country begins with "fra"](https://cuddly-shorthaired-son.glitch.me/galleries/country/fra)

3. **Artists**
   - [All artists](https://cuddly-shorthaired-son.glitch.me/artists)
   - [Artist by ID (example: 12)](https://cuddly-shorthaired-son.glitch.me/artists/12)
   - [Artist by ID (non-existent: 1223423)](https://cuddly-shorthaired-son.glitch.me/artists/1223423)
   - [Artists by last name begins with "ma"](https://cuddly-shorthaired-son.glitch.me/artists/search/ma)
   - [Artists by last name begins with "mA"](https://cuddly-shorthaired-son.glitch.me/artists/search/mA)
   - [Artists by nationality begins with "fra"](https://cuddly-shorthaired-son.glitch.me/artists/country/fra)

4. **Paintings**
   - [All paintings (default sort by title)](https://cuddly-shorthaired-son.glitch.me/paintings)
   - [Paintings sorted by year](https://cuddly-shorthaired-son.glitch.me/paintings/sort/year)
   - [Painting by ID (example: 63)](https://cuddly-shorthaired-son.glitch.me/paintings/63)
   - [Search paintings by title containing "port"](https://cuddly-shorthaired-son.glitch.me/paintings/search/port)
   - [Search paintings by title containing "pORt"](https://cuddly-shorthaired-son.glitch.me/paintings/search/pORt)
   - [Search paintings by title containing "connolly"](https://cuddly-shorthaired-son.glitch.me/paintings/search/connolly)
   - [Paintings between years 1800 and 1850](https://cuddly-shorthaired-son.glitch.me/paintings/years/1800/1850)
   - [Paintings in a given gallery (example: gallery 5)](https://cuddly-shorthaired-son.glitch.me/paintings/galleries/5)
   - [Paintings by a given artist (example: artist 16)](https://cuddly-shorthaired-son.glitch.me/paintings/artist/16)
   - [Paintings by a non-existent artist (example: artist 666)](https://cuddly-shorthaired-son.glitch.me/paintings/artist/666)
   - [Paintings by artists whose nationality begins with "ital"](https://cuddly-shorthaired-son.glitch.me/paintings/artists/country/ital)

5. **Genres**
   - [All genres (with era details)](https://cuddly-shorthaired-son.glitch.me/genres)
   - [Genre by ID (example: 76)](https://cuddly-shorthaired-son.glitch.me/genres/76)
   - [Genres for a painting (example: painting 408)](https://cuddly-shorthaired-son.glitch.me/genres/painting/408)
   - [Genres for a non-existent painting (example: painting jsdfhg)](https://cuddly-shorthaired-son.glitch.me/genres/painting/jsdfhg)

6. **Paintings by Genre/Era**
   - [Paintings for a given genre (example: 78)](https://cuddly-shorthaired-son.glitch.me/paintings/genre/78)
   - [Paintings for a given era (example: 2)](https://cuddly-shorthaired-son.glitch.me/paintings/era/2)

7. **Counts**
   - [Genre counts (fewest to most)](https://cuddly-shorthaired-son.glitch.me/counts/genres)
   - [Artist counts (most to fewest)](https://cuddly-shorthaired-son.glitch.me/counts/artists)
   - [Top genres with over 20 paintings](https://cuddly-shorthaired-son.glitch.me/counts/topgenres/20)
   - [Top genres with over 2034958 paintings (likely no results)](https://cuddly-shorthaired-son.glitch.me/counts/topgenres/2034958)

---

NOTE:

- If the API has been inactive for a while, the first request might take a few seconds.
- If any endpoint returns an empty result, the server responds with a `404` and a JSON error message.
- For invalid year ranges (e.g., `end < start`), the server responds with a `400` (Bad Request) and a JSON error message.
