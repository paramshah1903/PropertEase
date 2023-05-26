import React from "react";
import Slider from "@mui/material/Slider";
import { Stack, Typography } from "@mui/material";

export default function InterestSlider(props) {
  return (
    <>
      <Stack gap={1}>
        <Typography variant="subtitle1">{props.label}</Typography>
        <Typography variant="h5">
          {props.amount}
          {props.unit}
        </Typography>
      </Stack>

      <Slider
        defaultValue={props.default}
        min={props.min}
        max={props.max}
        step={props.steps}
        aria-label="Default"
        valueLabelDisplay="auto"
        onChange={props.onChange}
        value={props.value}
      />
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="caption">
          {props.min}
          {props.unit}
        </Typography>
        <Typography variant="caption">
          {props.max}
          {props.unit}
        </Typography>
      </Stack>
    </>
  );
}
