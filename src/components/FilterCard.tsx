import { useState } from "react";
import {
  Box,
  Divider,
  FormControlLabel,
  Paper,
  Radio,
  Stack,
  Typography,
} from "@mui/material";

const filterData = [
 
  {
    filterType: "Industry",
    array: [
      "Frontend Developer",
      "Backend Developer",
      "School Teacher",
      "College Teacher",
      "University Teacher",
      "Full Stack Developer",
      "Mobile Developer",

    ],
  },
 {
    filterType: "Location",
    array: ["Karachi", "Lahore", "Islamabad", "Peshawar", "Quetta"],
  },
  {
    filterType: "Salary",
    array: ["0-50k", "50k-100k", "100k-150k", "150k-200k", "200k+"],
  },
];

interface FilterCardProps {
  onFilterChange: (filters: { [key: string]: string }) => void;
}

function FilterCard({ onFilterChange }: FilterCardProps) {
  const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: string }>({});

  const handleRadioClick = (filterType: string, value: string) => {
    const isSelected = selectedFilters[filterType] === value;
    const updatedFilters = { ...selectedFilters };
    if (isSelected) {
      delete updatedFilters[filterType];
    } else {
      updatedFilters[filterType] = value;
    }
    setSelectedFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  return (
    <Paper variant="outlined" sx={{ overflow: "hidden", borderRadius: 2 }}>
      <Box className="bg-footer" sx={{ height: 2, width: "100%" }} />
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
          Filter Jobs
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Stack spacing={2.5}>
          {filterData.map((data, index) => (
            <Box key={index}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                {data.filterType}
              </Typography>
              <Stack spacing={0.5}>
                {data.array.map((item, idx) => (
                  <FormControlLabel
                    key={idx}
                    control={
                      <Radio
                        checked={selectedFilters[data.filterType] === item}
                        onClick={() => handleRadioClick(data.filterType, item)}
                      />
                    }
                    label={
                      <Typography variant="body2" color="text.secondary">
                        {item}
                      </Typography>
                    }
                  />
                ))}
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Paper>
  );
}

export default FilterCard;