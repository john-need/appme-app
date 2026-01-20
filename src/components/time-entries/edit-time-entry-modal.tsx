import React, {useState, useEffect} from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    Fab, Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import toLocalYMD from "@/utils/to-local-ymd";

interface Props {
    open: boolean;
    timeEntry: TimeEntry;
    onClose: () => void;
    onSubmit: (entry: TimeEntry) => void;
}

export default function EditTimeEntryModal({open, timeEntry, onClose, onSubmit}: Props) {
    const [minutes, setMinutes] = useState<number | "">("");
    const [notes, setNotes] = useState<string>("");

    useEffect(() => {
        if (timeEntry) {
            setMinutes(typeof timeEntry.minutes === "number" ? timeEntry.minutes : "");
            setNotes(timeEntry.notes ?? "");
        }
    }, [timeEntry]);

    const canSubmit = minutes !== "" && Number(minutes) >= 1;

    const handleSave = () => {
        if (!timeEntry) return;
        if (!canSubmit) return;
        const updated: TimeEntry = {
            ...timeEntry,
            minutes: Number(minutes),
            notes: notes || undefined,
            updated: new Date().toISOString(),
        };
        onSubmit(updated);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{position: "relative"}}>
                Edit Time Entry
                <Fab size="small" color="default" aria-label="close" onClick={onClose}
                     sx={{position: "absolute", right: 16, top: 8}}>
                    <CloseIcon/>
                </Fab>
            </DialogTitle>

            <DialogContent>
                <Box sx={{display: "grid", gap: 2, mt: 1}}>
                    <TextField label="Minutes" type="number" value={minutes}
                               onChange={(e) => setMinutes(e.target.value === "" ? "" : Number(e.target.value))}
                               fullWidth/>
                    <TextField label="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} fullWidth
                               multiline minRows={3}/>
                    <Typography>{toLocalYMD(timeEntry.created)}</Typography>
                </Box>
            </DialogContent>

            <DialogActions>
                <Button onClick={handleSave} variant="contained" disabled={!canSubmit}>Save</Button>
            </DialogActions>
        </Dialog>
    );
}

