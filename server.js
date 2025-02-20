const express = require("express");
const supa = require("@supabase/supabase-js");
const app = express();
const port = 3000;

const supaUrl = "https://hlnkqphhbwwahveirgmm.supabase.co";
const supaAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhsbmtxcGhoYnd3YWh2ZWlyZ21tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk1NjgyNDIsImV4cCI6MjA1NTE0NDI0Mn0.FHWDaxehXGHBP0P7eL1ylikwortMV9z4ePbBDpGM-9M";
const supabase = supa.createClient(supaUrl, supaAnonKey);

app.use(express.json());

function sendResponse(res, data, notFoundMsg = "Not Found") {
  if (!data || data.length === 0) {
    return res.status(404).json({ error: notFoundMsg });
  }
  res.json(data);
}

// Returns all eras
app.get("/eras", async (req, res) => {
  const { data, error } = await supabase.from("eras").select("*");

  if (error) return res.status(500).json({ error: error.message });
  if (!data || data.length === 0)
    return res.status(404).json({ error: "No eras found." });
  res.json(data);
});

// Returns all galleries
app.get("/galleries", async (req, res) => {
  const { data, error } = await supabase.from("galleries").select("*");

  if (error) return res.status(500).json({ error: error.message });
  if (!data || data.length === 0)
    return res.status(404).json({ error: "No galleries found." });
  res.json(data);
});

// Returns a gallery by ID
app.get("/galleries/:id", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("galleries")
    .select("*")
    .eq("galleryId", id);

  if (error) return res.status(500).json({ error: error.message });
  if (!data || data.length === 0)
    return res.status(404).json({ error: `No gallery found with ID ${id}.` });
  res.json(data);
});

// Returns galleries whose country begins with substring
app.get("/galleries/country/:substring", async (req, res) => {
  const { substring } = req.params;
  const { data, error } = await supabase
    .from("galleries")
    .select("*")
    .ilike("galleryCountry", `${substring}%`);

  if (error) return res.status(500).json({ error: error.message });
  if (!data || data.length === 0) {
    return res.status(404).json({
      error: `No galleries found whose country begins with '${substring}'.`,
    });
  }
  res.json(data);
});

// Returns all artists
app.get("/artists", async (req, res) => {
  const { data, error } = await supabase.from("artists").select("*");

  if (error) return res.status(500).json({ error: error.message });
  if (!data || data.length === 0)
    return res.status(404).json({ error: "No artists found." });
  res.json(data);
});

// Returns an artist by ID
app.get("/artists/:id", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("artists")
    .select("*")
    .eq("artistId", id);

  if (error) return res.status(500).json({ error: error.message });
  if (!data || data.length === 0)
    return res.status(404).json({ error: `No artist found with ID ${id}.` });
  res.json(data);
});

// Returns artists whose last name begins with substring
app.get("/artists/search/:substring", async (req, res) => {
  const { substring } = req.params;
  const { data, error } = await supabase
    .from("artists")
    .select("*")
    .ilike("lastName", `${substring}%`);

  if (error) return res.status(500).json({ error: error.message });
  if (!data || data.length === 0) {
    return res.status(404).json({
      error: `No artists found whose last name begins with '${substring}'.`,
    });
  }
  res.json(data);
});

// Returns artists whose nationality begins with substring
app.get("/artists/country/:substring", async (req, res) => {
  const { substring } = req.params;
  const { data, error } = await supabase
    .from("artists")
    .select("*")
    .ilike("nationality", `${substring}%`);

  if (error) return res.status(500).json({ error: error.message });
  if (!data || data.length === 0) {
    return res.status(404).json({
      error: `No artists found whose nationality begins with '${substring}'.`,
    });
  }
  res.json(data);
});

// Returns all paintings (with artist and gallery), sorted by title
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
    .order("title", { ascending: true });

  if (error) return res.status(500).json({ error: error.message });
  if (!data || data.length === 0)
    return res.status(404).json({ error: "No paintings found." });
  res.json(data);
});

// Returns all paintings sorted by title or yearOfWork
app.get("/paintings/sort/:sortParam", async (req, res) => {
  const { sortParam } = req.params;
  if (!["title", "yearOfWork"].includes(sortParam)) {
    return res.status(400).json({ error: "Invalid sort parameter." });
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
  if (!data || data.length === 0)
    return res.status(404).json({ error: "No paintings found." });
  res.json(data);
});

// Returns a painting by ID
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
  if (!data || data.length === 0) {
    return res.status(404).json({ error: `No painting found with ID ${id}.` });
  }
  res.json(data);
});

// Returns paintings whose title contains substring
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
  if (!data || data.length === 0) {
    return res.status(404).json({
      error: `No paintings found whose title contains '${substring}'.`,
    });
  }
  res.json(data);
});

// Returns paintings between start and end years, sorted by yearOfWork
app.get("/paintings/years/:start/:end", async (req, res) => {
  const { start, end } = req.params;
  if (parseInt(end) < parseInt(start)) {
    return res.status(400).json({ error: "End year must be >= start year." });
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
    .gte("yearOfWork", start)
    .lte("yearOfWork", end)
    .order("yearOfWork", { ascending: true });

  if (error) return res.status(500).json({ error: error.message });
  if (!data || data.length === 0) {
    return res.status(404).json({
      error: `No paintings found between ${start} and ${end}.`,
    });
  }
  res.json(data);
});

// Returns paintings in a given gallery
app.get("/paintings/galleries/:id", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("paintings")
    .select(
      `
      *,
      artists (*),
      galleries!inner(*)
    `
    )
    .eq("galleryId", id)
    .order("title", { ascending: true });

  if (error) return res.status(500).json({ error: error.message });
  if (!data || data.length === 0) {
    return res.status(404).json({
      error: `No paintings found for gallery ID ${id}.`,
    });
  }
  res.json(data);
});

// Returns paintings by a given artist
app.get("/paintings/artist/:id", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("paintings")
    .select(
      `
      *,
      artists!inner(*),
      galleries(*)
    `
    )
    .eq("artistId", id)
    .order("yearOfWork", { ascending: true });

  if (error) return res.status(500).json({ error: error.message });
  if (!data || data.length === 0) {
    return res.status(404).json({
      error: `No paintings found for artist ID ${id}.`,
    });
  }
  res.json(data);
});

// Returns paintings by artists whose nationality begins with substring
app.get("/paintings/artist/country/:substring", async (req, res) => {
  const { substring } = req.params;
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
  if (!data || data.length === 0) {
    return res.status(404).json({
      error: `No paintings found whose artist nationality begins with '${substring}'.`,
    });
  }
  res.json(data);
});

// Returns all genres with their associated era
app.get("/genres", async (req, res) => {
  const { data, error } = await supabase.from("genres").select(`
      *,
      eras(*)
    `);

  if (error) return res.status(500).json({ error: error.message });
  if (!data || data.length === 0)
    return res.status(404).json({ error: "No genres found." });
  res.json(data);
});

// Returns a genre by ID with its era
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
  if (!data || data.length === 0) {
    return res.status(404).json({ error: `No genre found with ID ${id}.` });
  }
  res.json(data);
});

// Returns genres for a specific painting
app.get("/genres/painting/:id", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("paintingGenres")
    .select(
      `
      paintingId,
      genres(*)
    `
    )
    .eq("paintingId", id)
    .order("genreName", { ascending: true, foreignTable: "genres" });

  if (error) return res.status(500).json({ error: error.message });
  if (!data || data.length === 0) {
    return res.status(404).json({
      error: `No genres found for painting ID ${id}.`,
    });
  }
  res.json(data);
});

// Returns paintings for a given genre
app.get("/paintings/genre/:genreId", async (req, res) => {
  const { genreId } = req.params;
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
  if (!data || data.length === 0) {
    return res.status(404).json({
      error: `No paintings found for genre ID ${genreId}.`,
    });
  }

  const paintings = data.map((row) => row.paintings);
  res.json(paintings);
});

// Returns paintings for a given era
app.get("/paintings/era/:eraId", async (req, res) => {
  const { eraId } = req.params;
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
    return res.status(404).json({
      error: `No paintings found for era ID ${eraId}.`,
    });
  }

  const paintings = data.map((record) => record.paintings);
  res.json(paintings);
});

// Returns each genre and its painting count (fewest to most)
app.get("/counts/genres", async (req, res) => {
  const { data, error } = await supabase.from("paintingGenres").select(`
      genreId,
      genres(
        genreName
      )
    `);

  if (error) return res.status(500).json({ error: error.message });
  if (!data || data.length === 0) {
    return res.status(404).json({ error: "No genres/paintings found." });
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

  let result = Object.values(countsMap);
  result.sort((a, b) => a.count - b.count);
  res.json(result);
});

// Returns each artist and their painting count (most to fewest)
app.get("/counts/artists", async (req, res) => {
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
    const fullName =
      (row.artists?.firstName || "") + " " + (row.artists?.lastName || "");
    if (!countsMap[aId]) {
      countsMap[aId] = { artistId: aId, artistName: fullName.trim(), count: 0 };
    }
    countsMap[aId].count += 1;
  });

  let result = Object.values(countsMap);
  result.sort((a, b) => b.count - a.count);
  res.json(result);
});

// Returns top genres with more than :min paintings
app.get("/counts/topgenres/:min", async (req, res) => {
  const { min } = req.params;
  const minNum = parseInt(min, 10);

  const { data, error } = await supabase.from("paintingGenres").select(`
      genreId,
      genres(
        genreName
      )
    `);

  if (error) return res.status(500).json({ error: error.message });
  if (!data || data.length === 0) {
    return res.status(404).json({ error: "No genres/paintings found." });
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
