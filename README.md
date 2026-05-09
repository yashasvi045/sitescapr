# SiteScapr

**Stop guessing. Start deciding.**

SiteScapr is a location intelligence platform that tells business owners exactly where in Kolkata to open their next venture. Enter your business type, target demographic, and monthly budget. SiteScapr scores every major neighbourhood, ranks your top options, and explains the reasoning in under three seconds.

## What It Does

Choosing a location is one of the highest-stakes decisions a business makes. Most owners rely on intuition, word of mouth, or a single site visit. SiteScapr replaces guesswork with a structured, data-driven score built from nine signals: income levels, foot traffic, competition density, commercial rent, population density, accessibility, area growth trend, vacancy improvement, and infrastructure investment.

Every score is tailored to your business category. A restaurant is weighted differently from a tech office. A cafe is weighted differently from a supermarket. The result is a ranked shortlist that reflects how each neighbourhood actually performs for your specific business; not a generic popularity ranking.

## Key Features

**Neighbourhood Rankings**
The top five locations for your business are ranked by a composite Location Score. Each result includes a breakdown of demand, friction, and growth components so you understand exactly what is driving the recommendation.

**Interactive Map**
Results appear on a live Kolkata map with score-coloured overlays. Compare locations visually alongside the numbers.

**AI-Generated Reasoning**
Each recommendation includes three plain-language bullet points explaining why that neighbourhood ranked where it did: written specifically for your business type and budget.

**Live Data, Refreshed Every 12 Hours**
An automated pipeline monitors local news for every tracked neighbourhood, interprets signals using AI, and updates the scoring indices twice a day. Every analysis you run reflects current conditions.

**Budget Filtering**
Locations that exceed your monthly budget are automatically excluded. You only see options that are financially viable for your situation.

## How the Score Is Calculated

Each neighbourhood is evaluated across three dimensions:

- **Demand**: How much genuine customer opportunity exists in the area (income levels, foot traffic, population density).
- **Friction**: What works against you (competition, rent costs, accessibility).
- **Growth**: Whether the area is improving (development trends, vacancy improvements, infrastructure investment).

The final Location Score weighs demand at 40%, subtracts friction at 35%, and adds growth at 25%. All inputs are normalised before scoring. Business-type profiles adjust the internal weights so the formula reflects the priorities of your specific category: twelve profiles in total, from restaurants and cafes to medical clinics and tech offices.

## Pricing

| Plan | Price | Includes |
|---|---|---|
| Free | No charge | First analysis |
| Pro | INR 299 / month | Unlimited analyses, full score breakdowns, comparison view |

## Tech Stack

Built on Next.js, FastAPI, and SQLAlchemy, with Clerk for authentication, Razorpay for payments, and Groq LLaMA 3.1 powering the automated index updates.

## License

This repository is publicly visible for reference and evaluation purposes only. All rights are reserved by the authors. No part of this codebase may be copied, modified, distributed, sublicensed, or used in any form, commercial or otherwise without explicit prior written permission from the authors. To request permission, please open an issue or contact the repository owners directly.
