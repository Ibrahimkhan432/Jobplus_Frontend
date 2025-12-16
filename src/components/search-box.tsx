"use client"

import type React from "react"

import { useState } from "react"
import { Search, MapPin, Briefcase } from "lucide-react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { setSearchedQuery } from "../../redux/jobSlice"

import {
  Box,
  Button,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material"

export default function SearchBox() {
  const [query, setQuery] = useState("")
  const [location, setLocation] = useState("")
  const [category, setCategory] = useState("")

  const dispatch = useDispatch();
  const navigate = useNavigate();


  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Searching for:", { query, location, category })
    dispatch(setSearchedQuery(query));
    navigate("/browser")
  }

  return (
    <Box component="form" onSubmit={handleSearch} sx={{ width: "100%", maxWidth: 980, mx: "auto" }}>
      <Paper
        variant="outlined"
        sx={{
          p: 1.25,
          borderRadius: 3,
          backgroundColor: "rgba(255,255,255,0.75)",
          backdropFilter: "blur(10px)",
        }}
      >
        <Stack direction={{ xs: "column", md: "row" }} spacing={1.25}>
          <TextField
            fullWidth
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Job title, company"
            size="small"
            InputProps={{
              startAdornment: (
                <Box sx={{ display: "flex", alignItems: "center", pr: 1, color: "text.secondary" }}>
                  <Search size={18} />
                </Box>
              ),
            }}
          />

          <TextField
            fullWidth
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="City or location"
            size="small"
            InputProps={{
              startAdornment: (
                <Box sx={{ display: "flex", alignItems: "center", pr: 1, color: "text.secondary" }}>
                  <MapPin size={18} />
                </Box>
              ),
            }}
          />

          <TextField
            select
            fullWidth
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            size="small"
            SelectProps={{ displayEmpty: true }}
            InputProps={{
              startAdornment: (
                <Box sx={{ display: "flex", alignItems: "center", pr: 1, color: "text.secondary" }}>
                  <Briefcase size={18} />
                </Box>
              ),
            }}
          >
            <MenuItem value="">
              <Typography variant="body2" color="text.secondary">
                All Categories
              </Typography>
            </MenuItem>
            <MenuItem value="technology">Technology</MenuItem>
            <MenuItem value="design">Design</MenuItem>
            <MenuItem value="marketing">Marketing</MenuItem>
            <MenuItem value="finance">Finance</MenuItem>
            <MenuItem value="healthcare">Healthcare</MenuItem>
          </TextField>

          <Button
            type="submit"
            variant="contained"
            sx={{ px: 3, whiteSpace: "nowrap", textTransform: "none" }}
          >
            Search
          </Button>
        </Stack>
      </Paper>
    </Box>
  )
}
