import React, { useState } from "react";
import MortgageSlider from "../components/MortgageSlider";
// import MortgageSliderInterest from "../components/MortgageSlider";
import PieResult from "../components/PieResult";
import { Container, Grid, Stack } from "@mui/material";
import InterestSlider from "../components/InterestSlider";
import TenureSelect from "../components/TenureSelect";

export default function MortgageCalculator() {
  const rupeeSymbol = "\u20B9";
  const [data, setData] = useState({
    homeValue: 3000,
    downPayment: 3000 * 0.2,
    loanAmount: 3000 * 0.8,
    loanTerm: 5,
    interestRate: 10,
  });
  console.log(data);
  return (
    <div>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Grid container spacing={5} alignItems="center">
          <Grid item xs={12} md={6}>
            <Stack my={1.5}>
              <MortgageSlider
                unit={rupeeSymbol}
                min={500}
                max={10000}
                steps={100}
                // defaultValue={800}
                label={`Home Value`}
                value={data.homeValue}
                amount={data.homeValue}
                onChange={(e, value) => {
                  setData((prevData) => ({
                    ...prevData,
                    downPayment: 0.2 * value,
                    loanAmount: 0.8 * value,
                    homeValue: value,
                  }));
                }}
              />
              <MortgageSlider
                unit={rupeeSymbol}
                min={500}
                max={data.homeValue}
                steps={100}
                default={(2 * data.homeValue) / 10}
                label={`Down Payment`}
                value={data.downPayment}
                amount={data.downPayment}
                onChange={(e, value) => {
                  setData((prevData) => ({
                    ...prevData,
                    downPayment: value,
                    loanAmount: data.homeValue - value,
                  }));
                }}
              />
              <MortgageSlider
                unit={rupeeSymbol}
                min={500}
                max={data.homeValue}
                steps={100}
                default={0.8 * data.homeValue}
                label={`Loan Value`}
                value={data.loanAmount}
                amount={data.loanAmount}
                onChange={(e, value) => {
                  setData((prevData) => ({
                    ...prevData,
                    loanAmount: value,
                    downPayment: data.homeValue - value,
                  }));
                }}
              />

              <InterestSlider
                unit={`%`}
                min={2}
                max={18}
                steps={0.5}
                label={`Interest Rate`}
                value={data.interestRate}
                amount={data.interestRate}
                onChange={(e, value) => {
                  setData((prevData) => ({
                    ...prevData,
                    interestRate: value,
                  }));
                }}
              />
              <TenureSelect data={data} setData={setData} />
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            {" "}
            <PieResult data={data} />
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}
