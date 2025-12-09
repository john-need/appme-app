import React from "react";
import { Container } from "@mui/material";
import TimeEntries from "@/components/time-entries/time-entries";
import { useAppSelector } from "@/hooks";

export default function HomePage() {
  const timeEntries = useAppSelector((s) => s.timeEntries?.items ?? []);
  return (
    <Container sx={{ py: 4 }}>
      <TimeEntries timeEntries={timeEntries}/>
    </Container>
  );
}
