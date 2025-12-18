import { Bookmark } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { keyframes } from '@mui/system';

function highlightText(text: string, search: string) {
  if (!search) return text;
  const regex = new RegExp(`(${search})`, 'gi');
  return text.split(regex).map((part, i) =>
    regex.test(part) ? (
      <Box key={i} component="span" sx={{ backgroundColor: '#FFF59D', color: '#000' }}>
        {part}
      </Box>
    ) : (
      part
    )
  );
}

function formatSalaryRange(job: any) {
  const min = job?.salaryMin;
  const max = job?.salaryMax;
  if (min != null && max != null && min !== "" && max !== "") {
    const nMin = Number(min);
    const nMax = Number(max);
    if (Number.isFinite(nMin) && Number.isFinite(nMax)) {
      return `Rs ${nMin.toLocaleString()} - ${nMax.toLocaleString()}`;
    }
  }
  if (job?.salary != null && job.salary !== "") {
    return `Rs ${String(job.salary)}`;
  }
  return "Not specified";
}

const JobCard = ({ job, searchTerm, onSelect, selected }: any) => {
  const navigate = useNavigate();

  const daysAgoFunction = (mongodbTime: any) => {
    if (!mongodbTime) return null;
    const createdAt = new Date(mongodbTime);
    const time = createdAt.getTime();
    if (Number.isNaN(time)) return null;
    return Math.floor((Date.now() - time) / (1000 * 60 * 60 * 24));
  };

  const daysAgo = daysAgoFunction(job?.createdAt);
  
  const isNewJob = daysAgo !== null && daysAgo <= 6;
  
  const borderBlink = keyframes({
    '0%': { boxShadow: '0 0 0 2px #1976d2' },
    '50%': { boxShadow: '0 0 0 2px transparent' },
    '100%': { boxShadow: '0 0 0 2px #1976d2' },
  });
  
  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 2,
        borderColor: selected ? 'primary.main' : 'divider',
        boxShadow: selected ? 2 : 0,
        transition: 'transform 150ms ease, box-shadow 150ms ease',
        '&:hover': { transform: selected ? 'none' : 'translateY(-1px)', boxShadow: 2 },
        ...(isNewJob && {
          animation: `${borderBlink.toString()} 1s infinite`,
        }),
      }}
    >
      <CardActionArea
        onClick={() => {
          if (typeof onSelect === "function") {
            onSelect(job?._id);
          } else {
            navigate(`/description/${job._id}`);
          }
        }}
        sx={{ alignItems: 'stretch' }}
      >
        <CardContent>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="caption" color="text.secondary">
                {daysAgo === null
                  ? ""
                  : daysAgo === 0
                    ? "Today"
                    : daysAgo === 1
                      ? "1 day ago"
                      : `${daysAgo} days ago`}
              </Typography>
              {isNewJob && (
                <Chip 
                  label="NEW" 
                  size="small" 
                  sx={{ 
                    backgroundColor: '#1976d2', 
                    color: 'white', 
                    fontWeight: 'bold',
                    height: '20px'
                  }} 
                />
              )}
            </Stack>
            <IconButton size="small" aria-label="bookmark" onClick={(e) => e.stopPropagation()}>
              <Bookmark size={18} />
            </IconButton>
          </Stack>

          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
            <Avatar
              src={job?.company?.logo || "https://via.placeholder.com/48"}
              alt={job?.company?.name}
              sx={{ width: 40, height: 40 }}
            />
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                {job?.company?.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {job?.location}
              </Typography>
            </Box>
          </Stack>

          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1.25 }}>
              {highlightText(job?.title, searchTerm)}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {highlightText(job?.description, searchTerm)}
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
            <Chip
              size="small"
              label={`Experience: ${typeof job?.experience === "number" && job.experience >= 0 ? job.experience : "0"}`}
              variant="outlined"
            />
            <Chip size="small" label={`Position: ${job?.position ?? ""}`} variant="outlined" />
            <Chip size="small" label={`${job?.jobType ?? ""}`} variant="outlined" />
            <Chip size="small" label={formatSalaryRange(job)} variant="outlined" />
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default JobCard;