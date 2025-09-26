import express from 'express';
import * as search from '../controllers/search.js';
export const searchRouter = express.Router();
searchRouter.get('/search', search.show);




// routes/search.js
//import { Router } from "express";
import { ITEMS } from "../data/items.js";

//export const searchRouter = Router();

searchRouter.get("/search", (req, res) => {
  const { query = "", category = "", date = "", location = "", type = "" } = req.query;

  const q = query.trim().toLowerCase();
  const results = ITEMS.filter(item => {
    const matchesQ =
      !q ||
      item.title.toLowerCase().includes(q) ||
      (item.summary || "").toLowerCase().includes(q);

    const matchesCategory = !category || item.category === category;
    const matchesType = !type || item.type === type;
    const matchesDate = !date || item.date === date; // exact match; change to range if needed
    const matchesLocation =
      !location || (item.location || "").toLowerCase().includes(location.toLowerCase());

    return matchesQ && matchesCategory && matchesType && matchesDate && matchesLocation;
  });

  res.render("search", { query, category, date, location, type, results });
});
