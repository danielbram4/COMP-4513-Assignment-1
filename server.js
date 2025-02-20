const express = require("express");
const supa = require("@supabase/supabase-js");
const app = express();
const port = 3000;

const supaUrl = "https://hlnkqphhbwwahveirgmm.supabase.co";
const supaAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhsbmtxcGhoYnd3YWh2ZWlyZ21tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk1NjgyNDIsImV4cCI6MjA1NTE0NDI0Mn0.FHWDaxehXGHBP0P7eL1ylikwortMV9z4ePbBDpGM-9M";
const supabase = supa.createClient(supaUrl, supaAnonKey);

app.use(express.json());

// Helper function to handle sending data or a 404 error
function sendResponse(res, data, notFoundMsg = "Not Found") {
  if (!data || data.length === 0) {
    return res.status(404).json({ error: notFoundMsg });
  }
  res.json(data);
}

// -------------------------------------------------------
// 1) ERAS
// -------------------------------------------------------
app.get("/eras", async (req, res) => {
  const { data, error } = await supabase.from("eras").select("*");

  if (error) return res.status(500).json({ error: error.message });
  sendResponse(res, data, "No eras found.");
});

// -------------------------------------------------------
// 2) GALLERIES
// -------------------------------------------------------

// (a) All galleries
app.get("/galleries", async (req, res) => {
  const { data, error } = await supabase.from("galleries").select("*");

  if (error) return res.status(500).json({ error: error.message });
  sendResponse(res, data, "No galleries found.");
});

// (b) Gallery by ID
app.get("/galleries/:id", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("galleries")
    .select("*")
    .eq("galleryId", id);

  if (error) return res.status(500).json({ error: error.message });
  sendResponse(res, data, `No gallery found with ID ${id}.`);
});

// (c) Galleries by Country (case-insensitive, begins with)
app.get("/galleries/country/:substring", async (req, res) => {
  const { substring } = req.params;
  const { data, error } = await supabase
    .from("galleries")
    .select("*")
    .ilike("galleryCountry", `${substring}%`);

  if (error) return res.status(500).json({ error: error.message });
  sendResponse(
    res,
    data,
    `No galleries found whose country begins with '${substring}'.`
  );
});

// -------------------------------------------------------
// 3) ARTISTS
// -------------------------------------------------------

// (a) All artists
app.get("/artists", async (req, res) => {
  const { data, error } = await supabase.from("artists").select("*");

  if (error) return res.status(500).json({ error: error.message });
  sendResponse(res, data, "No artists found.");
});

// (b) Artist by ID
app.get("/artists/:id", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("artists")
    .select("*")
    .eq("artistId", id);

  if (error) return res.status(500).json({ error: error.message });
  sendResponse(res, data, `No artist found with ID ${id}.`);
});

// (c) Artists whose lastName begins with substring (case-insensitive)
app.get("/artists/search/:substring", async (req, res) => {
  const { substring } = req.params;
  const { data, error } = await supabase
    .from("artists")
    .select("*")
    .ilike("lastName", `${substring}%`);

  if (error) return res.status(500).json({ error: error.message });
  sendResponse(
    res,
    data,
    `No artists found whose last name begins with '${substring}'.`
  );
});

// (d) Artists by nationality begins with substring (case-insensitive)
app.get("/artists/country/:substring", async (req, res) => {
  const { substring } = req.params;
  const { data, error } = await supabase
    .from("artists")
    .select("*")
    .ilike("nationality", `${substring}%`);

  if (error) return res.status(500).json({ error: error.message });
  sendResponse(
    res,
    data,
    `No artists found whose nationality begins with '${substring}'.`
  );
});

// -------------------------------------------------------
// 4) PAINTINGS
// -------------------------------------------------------

// (a) All paintings
//     Return all painting fields plus all artist fields plus all gallery fields.
//     Sort by title by default.
app.get("/paintings", async (req, res) => {
  const { data, error } = await supabase
    .from("paintings")
    .select(
      `
      *,
      artists (*),
      galleries (*)
    `
    )
    .order("title", { ascending: true }); // default sort

  if (error) return res.status(500).json({ error: error.message });
  sendResponse(res, data, "No paintings found.");
});

// (b) Sort paintings by title or yearOfWork
app.get("/paintings/sort/:sortParam", async (req, res) => {
  const { sortParam } = req.params;
  if (!["title", "yearOfWork"].includes(sortParam)) {
    return res
      .status(400)
      .json({ error: "Invalid sort parameter. Use 'title' or 'yearOfWork'." });
  }

  const { data, error } = await supabase
    .from("paintings")
    .select(
      `
      *,
      artists (*),
      galleries (*)
    `
    )
    .order(sortParam, { ascending: true });

  if (error) return res.status(500).json({ error: error.message });
  sendResponse(res, data, "No paintings found.");
});

// (c) Specific painting by ID
app.get("/paintings/:id", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("paintings")
    .select(
      `
      *,
      artists (*),
      galleries (*)
    `
    )
    .eq("paintingId", id);

  if (error) return res.status(500).json({ error: error.message });
  sendResponse(res, data, `No painting found with ID ${id}.`);
});

// (d) Search paintings by title (case-insensitive substring)
app.get("/paintings/search/:substring", async (req, res) => {
  const { substring } = req.params;
  const { data, error } = await supabase
    .from("paintings")
    .select(
      `
      *,
      artists (*),
      galleries (*)
    `
    )
    .ilike("title", `%${substring}%`)
    .order("title", { ascending: true });

  if (error) return res.status(500).json({ error: error.message });
  sendResponse(
    res,
    data,
    `No paintings found whose title contains '${substring}'.`
  );
});

// (e) Paintings between two years (inclusive), sorted by yearOfWork
app.get("/paintings/years/:start/:end", async (req, res) => {
  const { start, end } = req.params;
  const startNum = parseInt(start, 10);
  const endNum = parseInt(end, 10);

  if (endNum < startNum) {
    return res
      .status(400)
      .json({ error: "End year must be greater than or equal to start year." });
  }

  const { data, error } = await supabase
    .from("paintings")
    .select(
      `
      *,
      artists (*),
      galleries (*)
    `
    )
    .gte("yearOfWork", startNum)
    .lte("yearOfWork", endNum)
    .order("yearOfWork", { ascending: true });

  if (error) return res.status(500).json({ error: error.message });
  sendResponse(
    res,
    data,
    `No paintings found between years ${start} and ${end}.`
  );
});

// (f) Paintings by gallery ID
app.get("/paintings/galleries/:galleryId", async (req, res) => {
  const { galleryId } = req.params;

  // Return all painting fields, plus artist & gallery details, sorted by title
  const { data, error } = await supabase
    .from("paintings")
    .select(
      `
      *,
      artists (*),
      galleries!inner(*)
    `
    )
    .eq("galleryId", galleryId)
    .order("title", { ascending: true });

  if (error) return res.status(500).json({ error: error.message });
  sendResponse(res, data, `No paintings found for gallery ID ${galleryId}.`);
});

// (g) Paintings by artist ID
app.get("/paintings/artist/:artistId", async (req, res) => {
  const { artistId } = req.params;

  // Return painting fields plus the joined artist data
  const { data, error } = await supabase
    .from("paintings")
    .select(
      `
      *,
      artists!inner(*),
      galleries(*)
    `
    )
    .eq("artistId", artistId)
    .order("yearOfWork", { ascending: true });

  if (error) return res.status(500).json({ error: error.message });
  sendResponse(res, data, `No paintings found for artist ID ${artistId}.`);
});

// (h) Paintings by artists whose nationality begins with substring
app.get("/paintings/artist/country/:substring", async (req, res) => {
  const { substring } = req.params;

  // We do an inner join to the artists table and filter on the artist's nationality
  const { data, error } = await supabase
    .from("paintings")
    .select(
      `
      *,
      artists!inner(*),
      galleries(*)
    `
    )
    .ilike("artists.nationality", `${substring}%`)
    .order("title", { ascending: true });

  if (error) return res.status(500).json({ error: error.message });
  sendResponse(
    res,
    data,
    `No paintings found whose artist nationality begins with '${substring}'.`
  );
});

// -------------------------------------------------------
// 5) GENRES
// -------------------------------------------------------

// (a) All genres + full era details
app.get("/genres", async (req, res) => {
  const { data, error } = await supabase.from("genres").select(`
      *,
      eras(*)
    `);

  if (error) return res.status(500).json({ error: error.message });
  sendResponse(res, data, "No genres found.");
});

// (b) Genre by ID + full era details
app.get("/genres/:id", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("genres")
    .select(
      `
      *,
      eras(*)
    `
    )
    .eq("genreId", id);

  if (error) return res.status(500).json({ error: error.message });
  sendResponse(res, data, `No genre found with ID ${id}.`);
});

// (c) Genres used in a given painting (ordered by genreName ascending)
app.get("/genres/painting/:paintingId", async (req, res) => {
  const { paintingId } = req.params;

  // paintingGenres is the link table. We select the joined genre data,
  // and then order by the genre name
  const { data, error } = await supabase
    .from("paintingGenres")
    .select(
      `
      paintingId,
      genres(*)
    `
    )
    .eq("paintingId", paintingId)
    .order("genreName", { ascending: true, foreignTable: "genres" });

  if (error) return res.status(500).json({ error: error.message });
  sendResponse(res, data, `No genres found for painting ID ${paintingId}.`);
});

// -------------------------------------------------------
// 6) PAINTINGS BY GENRE OR ERA
// -------------------------------------------------------

// (a) Paintings for a given genre ID
//     Only return paintingId, title, yearOfWork, sorted by yearOfWork
app.get("/paintings/genre/:genreId", async (req, res) => {
  const { genreId } = req.params;

  // We link paintingGenres to paintings:
  const { data, error } = await supabase
    .from("paintingGenres")
    .select(
      `
      paintings (
        paintingId,
        title,
        yearOfWork
      )
    `
    )
    .eq("genreId", genreId)
    .order("yearOfWork", { ascending: true, foreignTable: "paintings" });

  if (error) return res.status(500).json({ error: error.message });

  // If data is found, it will be an array of { paintings: {...} } objects.
  // Flatten them out for clarity or just return as is.
  if (!data || data.length === 0) {
    return res
      .status(404)
      .json({ error: `No paintings found for genre ID ${genreId}.` });
  }

  // Map to extract the painting object from each record
  const paintings = data.map((record) => record.paintings);
  res.json(paintings);
});

// (b) Paintings for a given era ID
//     Only return paintingId, title, yearOfWork, sorted by yearOfWork
app.get("/paintings/era/:eraId", async (req, res) => {
  const { eraId } = req.params;

  // We link the paintings table to the genres → era:
  //   paintings -> paintingGenres -> genres -> eras
  //   But the simplest approach is to query the painting table where
  //   paintingGenres.genres.eraId = eraId
  //   We'll do it via paintingGenres so we can join genres. Then we filter on genres.eraId.
  const { data, error } = await supabase
    .from("paintingGenres")
    .select(
      `
      paintings (
        paintingId,
        title,
        yearOfWork
      ),
      genres!inner(eraId)
    `
    )
    .eq("genres.eraId", eraId)
    .order("yearOfWork", { ascending: true, foreignTable: "paintings" });

  if (error) return res.status(500).json({ error: error.message });

  if (!data || data.length === 0) {
    return res
      .status(404)
      .json({ error: `No paintings found for era ID ${eraId}.` });
  }

  const paintings = data.map((record) => record.paintings);
  res.json(paintings);
});

// -------------------------------------------------------
// 7) COUNTS
// -------------------------------------------------------

// (a) /counts/genres
//     Returns each genre name + number of paintings, sorted fewest to most
app.get("/counts/genres", async (req, res) => {
  // We'll use the paintingGenres table (the many-to-many link),
  // join the genres table to get genreName,
  // group by genreId, and count.
  const { data, error } = await supabase
    .from("paintingGenres")
    .select(
      `
      genreId,
      genres(
        genreName
      )
    `,
      { count: "exact" }
    ) // we want the row count for grouping
    .order("genreId", { ascending: true });

  if (error) return res.status(500).json({ error: error.message });
  if (!data || data.length === 0) {
    return res.status(404).json({ error: "No genres/paintings found." });
  }

  // We have a row per painting-genre combination. We want to reduce to
  // { genreId, genreName, count } grouped by genreId.
  const countsMap = {};
  data.forEach((row) => {
    const gId = row.genreId;
    const gName = row.genres?.genreName || "Unknown Genre";
    if (!countsMap[gId]) {
      countsMap[gId] = { genreId: gId, genreName: gName, count: 0 };
    }
    countsMap[gId].count += 1;
  });

  // Convert to an array
  let result = Object.values(countsMap);
  // Sort by count ascending (fewest to most)
  result.sort((a, b) => a.count - b.count);

  res.json(result);
});

// (b) /counts/artists
//     Returns artist (firstName + lastName) + number of paintings, sorted most to fewest
app.get("/counts/artists", async (req, res) => {
  // We'll use the paintings table, since each painting has exactly one artistId.
  // Then join the artists table to get the name, group by artistId, count paintings.
  const { data, error } = await supabase.from("paintings").select(`
      artistId,
      artists!inner(
        firstName,
        lastName
      )
    `);

  if (error) return res.status(500).json({ error: error.message });
  if (!data || data.length === 0) {
    return res.status(404).json({ error: "No paintings or artists found." });
  }

  const countsMap = {};
  data.forEach((row) => {
    const aId = row.artistId;
    const fName = row.artists?.firstName || "";
    const lName = row.artists?.lastName || "";
    const fullName = fName + " " + lName;
    if (!countsMap[aId]) {
      countsMap[aId] = { artistId: aId, artistName: fullName, count: 0 };
    }
    countsMap[aId].count += 1;
  });

  let result = Object.values(countsMap);
  // Sort by count descending (most to fewest)
  result.sort((a, b) => b.count - a.count);

  res.json(result);
});

// (c) /counts/topgenres/:min
//     Show only genres with more than 'min' paintings, sorted by painting count (most to least)
app.get("/counts/topgenres/:min", async (req, res) => {
  const { min } = req.params;
  const minNum = parseInt(min, 10);

  // Same logic as /counts/genres, but we filter out counts < min
  const { data, error } = await supabase.from("paintingGenres").select(`
      genreId,
      genres(
        genreName
      )
    `);

  if (error) return res.status(500).json({ error: error.message });
  if (!data || data.length === 0) {
    return res
      .status(404)
      .json({ error: "No genres/paintings found in the database." });
  }

  const countsMap = {};
  data.forEach((row) => {
    const gId = row.genreId;
    const gName = row.genres?.genreName || "Unknown Genre";
    if (!countsMap[gId]) {
      countsMap[gId] = { genreId: gId, genreName: gName, count: 0 };
    }
    countsMap[gId].count += 1;
  });

  let result = Object.values(countsMap)
    .filter((g) => g.count > minNum)
    .sort((a, b) => b.count - a.count);

  if (result.length === 0) {
    return res.status(404).json({
      error: `No genres found with more than ${min} paintings.`,
    });
  }

  res.json(result);
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
