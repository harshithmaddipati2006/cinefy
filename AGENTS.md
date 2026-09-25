# AGENTS.md - CineFy Project Guidelines & Directives

## CRITICAL SEATING DESIGN RULES FOR CINEFY

Create realistic Indian cinema theatre seating layouts for the CineFy movie-booking platform.

### HIGHEST PRIORITY REQUIREMENTS:
1. **EVERY THEATRE MUST CONTAIN A MINIMUM OF 120 SEATS.**
2. **No theatre is allowed to have fewer than 120 seats.** Never generate: 119 seats, 100 seats, 80 seats, 60 seats or any capacity below 120 (`totalSeats >= 120`).
3. **Every theatre must have its own UNIQUE seating architecture.** Do NOT reuse the same seating map between theatres.
4. **Different screens inside the same multiplex must also have different seating layouts.** Do not copy Screen 1's seat map into Screen 2.
5. **The screen must be positioned at the FRONT of the auditorium.**
6. **The LOWEST-PRICE REGULAR SEATS must be located CLOSEST TO THE SCREEN (Row A at the front).**
7. **PREMIUM seats must be positioned behind the regular section.**
8. **EXECUTIVE seats must be positioned behind the premium section.**
9. **RECLINER and VIP seats should generally be positioned toward the REAR / BEST-VIEWING portion of the auditorium.**
10. **The seating arrangement must provide progressively better seating categories as the distance from the screen increases.**

---

### SEATING ORDER FROM SCREEN TO BACK:
```
                SCREEN (FRONT)
                   ↓
    REGULAR / LOW-PRICE SEATS
                   ↓
          PREMIUM SEATS
                   ↓
         EXECUTIVE SEATS
                   ↓
         RECLINER SEATS
                   ↓
            VIP SEATS
                   ↓
                BACK
```

**IMPORTANT RULES:**
- The screen must NOT be placed behind the premium/VIP seats.
- The lowest-priced seats must be closest to the screen.
- The most expensive VIP/recliner seats should normally be farther from the screen and positioned where the viewing angle is optimal.
- Dynamic variations between theatres are encouraged while preserving realistic viewing quality.

---

### RECOMMENDED CAPACITY TIERS (Always >= 120 seats):
- Small theatre: 120–250 seats
- Medium theatre: 250–500 seats
- Large theatre: 500–900 seats
- Large-format theatre: 700–1,500 seats
- Premium luxury theatre: 120–350 seats
- IMAX: 250–600 seats
- 4DX: 120–300 seats

---

### PRICE-BASED SEATING:
- REGULAR: ₹100–₹180
- PREMIUM: ₹180–₹280
- EXECUTIVE: ₹250–₹350
- RECLINER: ₹350–₹550
- VIP / COUPLE: ₹500–₹800+
Prices are dynamically modulated per theatre, city, format, and showtime.

---

### VISUAL COLOR & AVAILABILITY LEGEND:
- **Regular** → Standard Blue (`#3B82F6`)
- **Premium** → Crimson Red (`#EF4444`)
- **Executive** → Prime Purple (`#A855F7`)
- **Recliner** → Dark Burgundy (`#9F1239`)
- **Couple** → Warm Gold (`#F59E0B`)
- **VIP** → Black & Gold (`#D97706` / `#EAB308`)
- **Wheelchair** → Access Cyan (`#06B6D4`)
- **Seat Statuses (Independent of Category)**: Available, Selected (Bright Yellow/Amber), Booked / Occupied (Dark Slate), Held, Blocked.

---

### PROCEDURAL REALISM:
Each screen's layout is deterministically derived from a signature hash of `theatreId + screenId + screenName + screenType` ensuring 100% distinct architectural layouts with realistic curved rows, multi-block aisles, walkway breaks, emergency exits, and dimensions.

