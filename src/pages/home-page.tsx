import React from "react";
import {Container} from "@mui/material";
import Activities from "@/components/activities/activities";

export default function HomePage() {
    return (
        <Container sx={{py: 4}}>
            <Activities/>
        </Container>
    );
}

