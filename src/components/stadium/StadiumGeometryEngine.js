// StadiumGeometryEngine.js
// Procedural Geometry & Authentic Color Engine for Indian Cricket Venues
// Matches the exact visual styling of the uploaded official BookMyShow / IPL Narendra Modi Stadium map

/**
 * Convert polar angle (in degrees, with 0° at North / 12 o'clock) and radii (rx, ry) to Cartesian coordinates (x, y)
 */
export function polarToElliptical(cx, cy, rx, ry, angleInDegrees) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: cx + rx * Math.cos(angleInRadians),
    y: cy + ry * Math.sin(angleInRadians)
  };
}

/**
 * Generate SVG path for a donut arc sector bounded by inner and outer radii on an ellipse
 */
export function describeEllipticalArcSector(cx, cy, innerRx, innerRy, outerRx, outerRy, startAngle, endAngle) {
  if (endAngle - startAngle >= 360) {
    endAngle = startAngle + 359.99;
  }

  const startInner = polarToElliptical(cx, cy, innerRx, innerRy, endAngle);
  const endInner = polarToElliptical(cx, cy, innerRx, innerRy, startAngle);
  const startOuter = polarToElliptical(cx, cy, outerRx, outerRy, startAngle);
  const endOuter = polarToElliptical(cx, cy, outerRx, outerRy, endAngle);

  const arcSweep = endAngle - startAngle <= 180 ? "0" : "1";

  return [
    "M", startOuter.x, startOuter.y,
    "A", outerRx, outerRy, 0, arcSweep, 1, endOuter.x, endOuter.y,
    "L", endInner.x, endInner.y,
    "A", innerRx, innerRy, 0, arcSweep, 0, startInner.x, startInner.y,
    "Z"
  ].join(" ");
}

/**
 * Procedural Configuration Generator for Indian Stadiums
 * Restores the exact 2-tier concentric palette from the reference image:
 * - Upper Tier: Light Pastel Sky Blue (#c6e9fa) with Blocks J, K, L, M, N, P, Q, R & bay numbers
 * - Lower Tier: Warm Pastel Orange / Gold (#fdbb68, #fed7aa) with Blocks A - H & South Premium
 * - South Hospitality: President Gallery (with Pink Bay tags) and Presidential Suites 4th & 5th floor
 * - Central Pitch: Clean green turf, 30-yard circle, compass directions, NO team logos
 */
export function generateStadiumConfig(stadiumId = "lko-ekana", capacity = 50000) {
  const numericCap = parseInt(String(capacity || "50000").replace(/[^0-9]/g, "")) || 50000;
  const cx = 500;
  const cy = 500;

  // Narendra Modi Stadium Layout & Presets (Identical to reference image)
  const configs = {
    // 1. Narendra Modi Stadium, Ahmedabad
    "amd-modi": {
      name: "Narendra Modi Stadium",
      commonName: "Motera Stadium",
      location: "Motera, Ahmedabad, Gujarat, India",
      architectureType: "Massive Open Oval Bowl with Two Main Seating Tiers, 3-Tier South Pavilion & Y-Shaped Structural Supports",
      layoutType: "narendra-modi-mega-bowl",
      themeBadge: "132,000 Cap. World's Largest Cricket Stadium • Motera, Ahmedabad",
      highlights: "Massive Continuous 2-Tier Bowl, 3-Tier South Pavilion Clubhouse & Presidential Suites, North Media & Corporate Box, Perimeter Y-Shaped Support Columns, Lightweight Tensile Membrane Roof, 4 Mega Circulation Ramps, 100% Unobstructed Sightlines",
      roofStyle: "Lightweight PTFE Tensile Membrane Ring Roof with Radial Cables & Column-Free Y-Shaped Supports",
      totalCapacity: 132000,
      ellipseX: 1.06, // Enormous Open Oval Bowl
      ellipseY: 0.94,
      rField: 132,
      rInnerStart: 154,
      rInnerEnd: 234,
      rOuterStart: 250,
      rOuterEnd: 366,
      lowerColor: "#1d4ed8", // Deep Ocean Blue Seating
      upperColor: "#38bdf8", // Sky Blue / Steel Blue Seating
      specialColor: "#334155", // Slate / Neutral Corporate
      hasModiCanopy: true,
      hasYColumns: true,
      hasCirculationRamps: true,
      hasConcourses: true,
      hasFloodlights: true,
      innerBlocks: [
        { id: "blk-c", name: "BLOCK C (WEST LOWER)", shortName: "BLOCK C", stand: "West Stand", level: "Lower Tier", startAngle: 282, endAngle: 306, bays: [9, 8, 7, 6, 5, 4, 3, 2, 1], color: "#1d4ed8", price: 2000, gate: "GATE 3 (North-West Entry)", tier: "lower" },
        { id: "blk-d", name: "BLOCK D (NORTH-WEST LOWER)", shortName: "BLOCK D", stand: "North-West Stand", level: "Lower Tier", startAngle: 306, endAngle: 340, bays: [1, 2, 3, 4, 5, 6], color: "#1d4ed8", price: 2200, gate: "GATE 3 (North-West Entry)", tier: "lower" },
        { id: "blk-corp-n", name: "NORTH CORPORATE BOX & MEDIA CENTRE", shortName: "NORTH CORP", stand: "North Pavilion", level: "Media & VIP Level", startAngle: 340, endAngle: 20, bays: [1, 2, 3, 4, 5, 6], color: "#ffffff", price: 6500, gate: "GATE 4 (North Main Entry)", isVip: true, tier: "hospitality" },
        { id: "blk-e", name: "BLOCK E (NORTH-EAST LOWER)", shortName: "BLOCK E", stand: "North-East Stand", level: "Lower Tier", startAngle: 20, endAngle: 56, bays: [2, 3, 4, 5, 6, 7], color: "#1d4ed8", price: 2500, gate: "GATE 4 (North-East Entry)", tier: "lower" },
        { id: "blk-f", name: "BLOCK F (EAST LOWER 1)", shortName: "BLOCK F", stand: "East Stand", level: "Lower Tier", startAngle: 56, endAngle: 78, bays: [1, 2, 3, 4, 5], color: "#2563eb", price: 2500, gate: "GATE 5 (East Entry)", tier: "lower" },
        { id: "blk-g", name: "BLOCK G (EAST LOWER 2)", shortName: "BLOCK G", stand: "East Stand", level: "Lower Tier", startAngle: 78, endAngle: 118, bays: [1, 2, 3, 4, 5, 6, 7, 8, 9], color: "#1d4ed8", price: 2000, gate: "GATE 5 (East Entry)", tier: "lower" },
        { id: "blk-h", name: "BLOCK H (SOUTH-EAST LOWER)", shortName: "BLOCK H", stand: "South-East Stand", level: "Lower Tier", startAngle: 118, endAngle: 144, bays: [1, 2, 3, 4, 5], color: "#2563eb", price: 1800, gate: "GATE 6 (South-East Entry)", tier: "lower" },
        { id: "blk-prem-e", name: "SOUTH PAVILION LOWER EAST", shortName: "PAVILION EAST", stand: "South Pavilion", level: "Ground Floor VIP", startAngle: 144, endAngle: 168, bays: [4, 3, 2, 1], color: "#1e3a8a", price: 3500, gate: "GATE 1 (South VIP)", isVip: true, tier: "premium" },
        { id: "blk-prem-c", name: "SOUTH PAVILION PLAYERS & PRESIDENTIAL", shortName: "PLAYERS LOUNGE", stand: "South Pavilion", level: "Ground Floor VIP", startAngle: 168, endAngle: 192, bays: [4, 3, 2, 1], color: "#ffffff", price: 4500, gate: "GATE 1 (South VIP)", isVip: true, tier: "premium" },
        { id: "blk-prem-w", name: "SOUTH PAVILION LOWER WEST", shortName: "PAVILION WEST", stand: "South Pavilion", level: "Ground Floor VIP", startAngle: 192, endAngle: 216, bays: [4, 3, 2, 1], color: "#1e3a8a", price: 3500, gate: "GATE 1 (South VIP)", isVip: true, tier: "premium" },
        { id: "blk-a", name: "BLOCK A (SOUTH-WEST LOWER)", shortName: "BLOCK A", stand: "South-West Stand", level: "Lower Tier", startAngle: 216, endAngle: 243, bays: [5, 4, 3, 2, 1], color: "#2563eb", price: 1800, gate: "GATE 2 (South-West Entry)", tier: "lower" },
        { id: "blk-b", name: "BLOCK B (WEST LOWER)", shortName: "BLOCK B", stand: "West Stand", level: "Lower Tier", startAngle: 243, endAngle: 282, bays: [9, 8, 7, 6, 5, 4, 3, 2, 1], color: "#1d4ed8", price: 1800, gate: "GATE 2 (South-West Entry)", tier: "lower" }
      ],
      outerBlocks: [
        { id: "blk-l", name: "BLOCK L (WEST UPPER)", shortName: "BLOCK L", stand: "West Stand", level: "Upper Tier", startAngle: 282, endAngle: 306, bays: [1, 2, 3, 4, 5], color: "#38bdf8", price: 1400, gate: "GATE 3 (North-West Entry)", tier: "upper" },
        { id: "blk-m", name: "BLOCK M (NORTH-WEST UPPER)", shortName: "BLOCK M", stand: "North-West Stand", level: "Upper Tier", startAngle: 306, endAngle: 340, bays: [1, 2, 3, 4, 5], color: "#0284c7", price: 1500, gate: "GATE 4 (North Main Entry)", tier: "upper" },
        { id: "blk-n", name: "BLOCK N (NORTH PAVILION UPPER)", shortName: "BLOCK N", stand: "North Pavilion", level: "Upper Tier", startAngle: 340, endAngle: 20, bays: [1, 2, 3, 4, 5, 6, 7], color: "#38bdf8", price: 1500, gate: "GATE 4 (North Main Entry)", tier: "upper" },
        { id: "blk-p", name: "BLOCK P (NORTH-EAST UPPER)", shortName: "BLOCK P", stand: "North-East Stand", level: "Upper Tier", startAngle: 56, endAngle: 78, bays: [1, 2, 3, 4, 5], color: "#0284c7", price: 1400, gate: "GATE 5 (East Entry)", tier: "upper" },
        { id: "blk-q", name: "BLOCK Q (EAST UPPER)", shortName: "BLOCK Q", stand: "East Stand", level: "Upper Tier", startAngle: 78, endAngle: 118, bays: [1, 2, 3, 4, 5, 6, 7, 8, 9], color: "#38bdf8", price: 1200, gate: "GATE 5 (East Entry)", tier: "upper" },
        { id: "blk-r", name: "BLOCK R (SOUTH-EAST UPPER)", shortName: "BLOCK R", stand: "South-East Stand", level: "Upper Tier", startAngle: 118, endAngle: 144, bays: [5, 4, 3, 2, 1], color: "#0284c7", price: 1200, gate: "GATE 6 (South-East Entry)", tier: "upper" },
        { id: "blk-j", name: "BLOCK J (SOUTH-WEST UPPER)", shortName: "BLOCK J", stand: "South-West Stand", level: "Upper Tier", startAngle: 216, endAngle: 243, bays: [1, 2, 3, 4, 5], color: "#0284c7", price: 1200, gate: "GATE 2 (South-West Entry)", tier: "upper" },
        { id: "blk-k", name: "BLOCK K (WEST UPPER)", shortName: "BLOCK K", stand: "West Stand", level: "Upper Tier", startAngle: 243, endAngle: 282, bays: [1, 2, 3, 4, 5, 6, 7, 8, 9], color: "#38bdf8", price: 1200, gate: "GATE 2 (South-West Entry)", tier: "upper" }
      ],
      southHospitality: {
        hasGallery: true,
        startAngle: 144,
        endAngle: 216,
        gallery: {
          name: "PRESIDENT GALLERY (LEVEL 2)",
          rStart: 248,
          rEnd: 286,
          price: 5500,
          gate: "GATE 1 (VIP Entry)",
          bays: [
            { id: "bay-1", label: "BAY 1", bg: "#f1f5f9", text: "#0f172a" },
            { id: "bay-2", label: "BAY 2", bg: "#e2e8f0", text: "#1e293b" },
            { id: "bay-3", label: "BAY 3", bg: "#f1f5f9", text: "#0f172a" },
            { id: "bay-4", label: "BAY 4", bg: "#e2e8f0", text: "#1e293b" },
            { id: "bay-5", label: "BAY 5", bg: "#f1f5f9", text: "#0f172a" },
            { id: "bay-6", label: "BAY 6", bg: "#e2e8f0", text: "#1e293b" },
            { id: "bay-7", label: "BAY 7", bg: "#f1f5f9", text: "#0f172a" },
            { id: "bay-8", label: "BAY 8", bg: "#e2e8f0", text: "#1e293b" },
            { id: "bay-9", label: "BAY 9", bg: "#f1f5f9", text: "#0f172a" }
          ]
        },
        floor4: {
          name: "PRESIDENTIAL SUITES 4TH FLOOR (38 SUITES)",
          rStart: 290,
          rEnd: 330,
          price: 7500,
          gate: "GATE 1 (VIP)",
          suitesCount: 16
        },
        floor5: {
          name: "PREMIUM SUITES 5TH FLOOR (38 SUITES)",
          rStart: 334,
          rEnd: 374,
          price: 8500,
          gate: "GATE 1 (VIP)",
          suitesCount: 18
        }
      },
      floodlights: [
        { id: "fl-1", name: "LIGHT TOWER 1 (NE)", angle: 30, radius: 412 },
        { id: "fl-2", name: "LIGHT TOWER 2 (EAST)", angle: 90, radius: 412 },
        { id: "fl-3", name: "LIGHT TOWER 3 (SE)", angle: 150, radius: 412 },
        { id: "fl-4", name: "LIGHT TOWER 4 (SW)", angle: 210, radius: 412 },
        { id: "fl-5", name: "LIGHT TOWER 5 (WEST)", angle: 270, radius: 412 },
        { id: "fl-6", name: "LIGHT TOWER 6 (NW)", angle: 330, radius: 412 }
      ],
      gates: [
        { id: "gate-1", name: "GATE 1", label: "GATE 1 (South VIP Clubhouse & President Gallery)", angle: 180, gateRadius: 402 },
        { id: "gate-2", name: "GATE 2", label: "GATE 2 (South-West Stand & Ramp 1)", angle: 220, gateRadius: 402 },
        { id: "gate-3", name: "GATE 3", label: "GATE 3 (West & North-West Stand & Ramp 2)", angle: 295, gateRadius: 402 },
        { id: "gate-4", name: "GATE 4", label: "GATE 4 (North Main Entry & Media Centre)", angle: 0, gateRadius: 402 },
        { id: "gate-5", name: "GATE 5", label: "GATE 5 (North-East Stand & Ramp 3)", angle: 65, gateRadius: 402 },
        { id: "gate-6", name: "GATE 6", label: "GATE 6 (East & South-East Stand & Ramp 4)", angle: 135, gateRadius: 402 },
        { id: "gate-7", name: "GATE 7", label: "GATE 7 (East Promenade Concourse)", angle: 100, gateRadius: 402 },
        { id: "gate-8", name: "GATE 8", label: "GATE 8 (West Promenade Concourse)", angle: 260, gateRadius: 402 }
      ],
      dugouts: [
        { id: "dugout-home", name: "HOME TEAM DUGOUT", angle: 160, radius: 144, color: "#1d4ed8" },
        { id: "dugout-away", name: "AWAY TEAM DUGOUT", angle: 200, radius: 144, color: "#475569" }
      ]
    },

    // 2. Wankhede Stadium, Mumbai
    "mum-wankhede": {
      name: "Wankhede Stadium",
      location: "Mumbai, Maharashtra",
      architectureType: "4-Stand Detached Rectangular Cantilever (Arabian Sea Breeze)",
      layoutType: "rectangular-detached-4stand",
      themeBadge: "Seaside 4-Grandstand Arena • Churchgate, Mumbai",
      highlights: "Suspended Cantilever Roof Overhangs, Open Sea-Breeze Corner Gaps, Garware North Pavilion, Sachin Tendulkar East Stand, Sunil Gavaskar West Stand, MCA South Grandstand",
      roofStyle: "Floating Cantilever Trusses (No Obstructing Pillars)",
      totalCapacity: 33108,
      ellipseX: 1.0,
      ellipseY: 0.96,
      rField: 132,
      rInnerStart: 156,
      rInnerEnd: 236,
      rOuterStart: 250,
      rOuterEnd: 362,
      lowerColor: "#fdbb68",
      upperColor: "#c6e9fa",
      innerBlocks: [
        { id: "blk-garware-l", name: "GARWARE PAVILION LOWER (NORTH)", shortName: "GARWARE L1", startAngle: 330, endAngle: 30, bays: [1, 2, 3, 4, 5, 6], color: "#fdbb68", price: 3200, gate: "GATE 2", tier: "lower" },
        { id: "blk-merchant-l", name: "VIJAY MERCHANT LOWER (EAST)", shortName: "V. MERCHANT", startAngle: 34, endAngle: 86, bays: [1, 2, 3, 4, 5], color: "#fdbb68", price: 2200, gate: "GATE 1", tier: "lower" },
        { id: "blk-sachin-l", name: "SACHIN TENDULKAR LOWER (EAST)", shortName: "SACHIN L1", startAngle: 90, endAngle: 142, bays: [1, 2, 3, 4, 5, 6], color: "#fdbb68", price: 2800, gate: "GATE 3", tier: "lower" },
        { id: "blk-mca-suites", name: "MCA GRAND PAVILION LOUNGE", shortName: "MCA SUITES", startAngle: 146, endAngle: 214, bays: [1, 2, 3, 4], color: "#ffffff", price: 5500, gate: "GATE 3", isVip: true, tier: "premium" },
        { id: "blk-gavaskar-l", name: "SUNIL GAVASKAR LOWER (WEST)", shortName: "GAVASKAR L1", startAngle: 218, endAngle: 270, bays: [1, 2, 3, 4, 5, 6], color: "#fdbb68", price: 2200, gate: "GATE 4", tier: "lower" },
        { id: "blk-divecha-l", name: "DIVECHA PAVILION LOWER (WEST)", shortName: "DIVECHA L1", startAngle: 274, endAngle: 326, bays: [1, 2, 3, 4, 5], color: "#fdbb68", price: 2600, gate: "GATE 2", tier: "lower" }
      ],
      outerBlocks: [
        { id: "blk-garware-u", name: "GARWARE PAVILION UPPER (NORTH)", shortName: "GARWARE U", startAngle: 330, endAngle: 30, bays: [1, 2, 3, 4, 5, 6, 7], color: "#c6e9fa", price: 2000, gate: "GATE 2", tier: "upper" },
        { id: "blk-north-u", name: "VIJAY MERCHANT UPPER TIER", shortName: "MERCHANT U", startAngle: 34, endAngle: 86, bays: [1, 2, 3, 4, 5, 6], color: "#c6e9fa", price: 1800, gate: "GATE 1", tier: "upper" },
        { id: "blk-sachin-u", name: "SACHIN TENDULKAR UPPER (EAST)", shortName: "SACHIN U", startAngle: 90, endAngle: 142, bays: [1, 2, 3, 4, 5, 6, 7], color: "#c6e9fa", price: 2000, gate: "GATE 3", tier: "upper" },
        { id: "blk-gavaskar-u", name: "SUNIL GAVASKAR UPPER (WEST)", shortName: "GAVASKAR U", startAngle: 218, endAngle: 270, bays: [1, 2, 3, 4, 5, 6, 7], color: "#c6e9fa", price: 1800, gate: "GATE 4", tier: "upper" },
        { id: "blk-mankad-u", name: "VINOO MANKAD UPPER (WEST)", shortName: "V. MANKAD", startAngle: 274, endAngle: 326, bays: [1, 2, 3, 4, 5, 6], color: "#c6e9fa", price: 1600, gate: "GATE 4", tier: "upper" }
      ],
      southHospitality: {
        hasGallery: true,
        startAngle: 146,
        endAngle: 214,
        gallery: {
          name: "MCA PRESIDENT GALLERY",
          rStart: 248,
          rEnd: 286,
          price: 5500,
          gate: "GATE 3 (VIP)",
          bays: [
            { id: "mca-1", label: "BAY 1", bg: "#fce7f3", text: "#9d174d" },
            { id: "mca-2", label: "BAY 2", bg: "#f1f5f9", text: "#334155" },
            { id: "mca-3", label: "BAY 3", bg: "#f1f5f9", text: "#334155" },
            { id: "mca-4", label: "BAY 4", bg: "#fce7f3", text: "#9d174d" }
          ]
        },
        floor4: {
          name: "WANKHEDE VIP SUITES 4TH FLOOR",
          rStart: 290,
          rEnd: 330,
          price: 7500,
          gate: "GATE 3 (VIP)",
          suitesCount: 14
        },
        floor5: {
          name: "PRESIDENTIAL ROOF LOUNGE",
          rStart: 334,
          rEnd: 374,
          price: 8500,
          gate: "GATE 3 (VIP)",
          suitesCount: 16
        }
      },
      gates: [
        { id: "gate-1", name: "GATE 1", label: "GATE 1 (Vinoo Mankad)", angle: 60, gateRadius: 395 },
        { id: "gate-2", name: "GATE 2", label: "GATE 2 (Garware North)", angle: 0, gateRadius: 395 },
        { id: "gate-3", name: "GATE 3", label: "GATE 3 (Sachin South)", angle: 180, gateRadius: 395 },
        { id: "gate-4", name: "GATE 4", label: "GATE 4 (Gavaskar West)", angle: 260, gateRadius: 395 }
      ],
      dugouts: [
        { id: "dugout-home", name: "HOME TEAM DUGOUT", angle: 160, radius: 144, color: "#2563eb" },
        { id: "dugout-away", name: "AWAY TEAM DUGOUT", angle: 200, radius: 144, color: "#dc2626" }
      ]
    },

    // 3. M. Chinnaswamy Stadium, Bengaluru
    "blr-chinnaswamy": {
      name: "M. Chinnaswamy Stadium",
      location: "Bengaluru, Karnataka",
      architectureType: "Solar-Canopy Ringed Arena (Photovoltaic Roof)",
      layoutType: "rectangular-solar-canopy",
      themeBadge: "Eco-Friendly High-Scoring Arena • Cubbon Park, Bengaluru",
      highlights: "Green Energy Solar Panel Ring Canopy, Brijesh Patel P2 Pavilion, BLA Stand, KSCA Members Enclosure, West Grandstand",
      roofStyle: "Full Circumference Solar PV Roof Ring",
      totalCapacity: 40000,
      ellipseX: 1.0,
      ellipseY: 0.96,
      rField: 132,
      rInnerStart: 156,
      rInnerEnd: 236,
      rOuterStart: 250,
      rOuterEnd: 362,
      lowerColor: "#fdbb68",
      upperColor: "#c6e9fa",
      innerBlocks: [
        { id: "blk-blr-members-l", name: "MEMBERS PAVILION LOWER", shortName: "MEMBERS L1", startAngle: 330, endAngle: 30, bays: [1, 2, 3, 4, 5, 6], color: "#fdbb68", price: 3000, gate: "GATE 1", tier: "lower" },
        { id: "blk-blr-bla-l", name: "BLA STAND LOWER", shortName: "BLA STAND", startAngle: 34, endAngle: 86, bays: [1, 2, 3, 4, 5], color: "#fdbb68", price: 2200, gate: "GATE 1", tier: "lower" },
        { id: "blk-blr-p-l", name: "PAVILION TERRACE P1 LOWER", shortName: "P1 TERRACE", startAngle: 90, endAngle: 142, bays: [1, 2, 3, 4, 5, 6], color: "#fdbb68", price: 2600, gate: "GATE 2", tier: "lower" },
        { id: "blk-blr-ksca-vip", name: "KSCA CORPORATE PLATINUM", shortName: "KSCA VIP", startAngle: 146, endAngle: 214, bays: [1, 2, 3, 4], color: "#ffffff", price: 5500, gate: "GATE 6", isVip: true, tier: "premium" },
        { id: "blk-blr-west-l", name: "WEST GRANDSTAND LOWER", shortName: "WEST STAND", startAngle: 218, endAngle: 270, bays: [1, 2, 3, 4, 5, 6], color: "#fdbb68", price: 2000, gate: "GATE 12", tier: "lower" },
        { id: "blk-blr-gh-l", name: "G & H STAND LOWER", shortName: "G & H STAND", startAngle: 274, endAngle: 326, bays: [1, 2, 3, 4, 5], color: "#fdbb68", price: 2200, gate: "GATE 12", tier: "lower" }
      ],
      outerBlocks: [
        { id: "blk-blr-members-u", name: "MEMBERS PAVILION UPPER", shortName: "MEMBERS U", startAngle: 330, endAngle: 30, bays: [1, 2, 3, 4, 5, 6, 7], color: "#c6e9fa", price: 1800, gate: "GATE 1", tier: "upper" },
        { id: "blk-blr-bla-u", name: "BLA STAND UPPER", shortName: "BLA UPPER", startAngle: 34, endAngle: 86, bays: [1, 2, 3, 4, 5, 6], color: "#c6e9fa", price: 1500, gate: "GATE 1", tier: "upper" },
        { id: "blk-blr-p-u", name: "PAVILION TERRACE UPPER", shortName: "P TERRACE U", startAngle: 90, endAngle: 142, bays: [1, 2, 3, 4, 5, 6, 7], color: "#c6e9fa", price: 1800, gate: "GATE 2", tier: "upper" },
        { id: "blk-blr-west-u", name: "WEST GRANDSTAND UPPER", shortName: "WEST UPPER", startAngle: 218, endAngle: 270, bays: [1, 2, 3, 4, 5, 6, 7], color: "#c6e9fa", price: 1400, gate: "GATE 12", tier: "upper" },
        { id: "blk-blr-gh-u", name: "G & H STAND UPPER", shortName: "G & H UPPER", startAngle: 274, endAngle: 326, bays: [1, 2, 3, 4, 5, 6], color: "#c6e9fa", price: 1500, gate: "GATE 12", tier: "upper" }
      ],
      southHospitality: {
        hasGallery: true,
        startAngle: 146,
        endAngle: 214,
        gallery: {
          name: "KSCA EXECUTIVE GALLERY",
          rStart: 248,
          rEnd: 286,
          price: 5500,
          gate: "GATE 6 (VIP)",
          bays: [
            { id: "ksca-1", label: "BAY 1", bg: "#fce7f3", text: "#9d174d" },
            { id: "ksca-2", label: "BAY 2", bg: "#f1f5f9", text: "#334155" },
            { id: "ksca-3", label: "BAY 3", bg: "#f1f5f9", text: "#334155" },
            { id: "ksca-4", label: "BAY 4", bg: "#fce7f3", text: "#9d174d" }
          ]
        },
        floor4: {
          name: "CHINNASWAMY PLATINUM SUITES 4TH FLOOR",
          rStart: 290,
          rEnd: 330,
          price: 7500,
          gate: "GATE 6 (VIP)",
          suitesCount: 14
        },
        floor5: {
          name: "SOLAR ROOF EXECUTIVE LOUNGE",
          rStart: 334,
          rEnd: 374,
          price: 8500,
          gate: "GATE 6 (VIP)",
          suitesCount: 16
        }
      },
      gates: [
        { id: "gate-1", name: "GATE 1", label: "GATE 1 (Cubbon Park)", angle: 0, gateRadius: 395 },
        { id: "gate-2", name: "GATE 2", label: "GATE 2 (MG Road)", angle: 80, gateRadius: 395 },
        { id: "gate-6", name: "GATE 6", label: "GATE 6 (KSCA VIP)", angle: 180, gateRadius: 395 },
        { id: "gate-12", name: "GATE 12", label: "GATE 12 (West Gate)", angle: 260, gateRadius: 395 }
      ],
      dugouts: [
        { id: "dugout-home", name: "HOME TEAM DUGOUT", angle: 160, radius: 144, color: "#2563eb" },
        { id: "dugout-away", name: "AWAY TEAM DUGOUT", angle: 200, radius: 144, color: "#dc2626" }
      ]
    },

    // 4. MA Chidambaram Stadium (Chepauk), Chennai
    "che-chepauk": {
      name: "M. A. Chidambaram Stadium",
      commonName: "Chepauk Stadium",
      location: "Chepauk, Chennai, Tamil Nadu, India",
      architectureType: "Compact Multi-Tier Segmented Urban Bowl (Chepauk, Chennai)",
      layoutType: "rectangular-segmented-chepauk",
      themeBadge: "M. A. Chidambaram Stadium • Chepauk, Chennai",
      highlights: "13 Detached Rectangular Stand Modules (A, B, C, D, E, F, G, H, I, J, K), Anna Pavilion End & Kalaignar M. Karunanidhi Stand, Modern I/J/K PTFE Tensile Canopies",
      roofStyle: "Lightweight Segmented PTFE Membrane Roof",
      totalCapacity: 38000,
      ellipseX: 1.0,
      ellipseY: 0.96,
      rField: 128,
      rInnerStart: 150,
      rInnerEnd: 232,
      rOuterStart: 246,
      rOuterEnd: 360,
      lowerColor: "#fdbb68", // Warm Pastel Orange / Gold
      upperColor: "#c6e9fa", // Soft Pastel Sky Blue
      specialColor: "#fed7aa", // Light Peach / Gold
      innerBlocks: [
        { id: "blk-che-i-l", name: "I STAND LOWER", shortName: "I LOWER", stand: "I", startAngle: 326, endAngle: 350, bays: [1, 2, 3, 4], color: "#fdbb68", price: 2500, gate: "GATE 1 (V. Pattabhiraman)", tier: "lower", roofType: "PTFE Canopy" },
        { id: "blk-che-j-l", name: "J STAND LOWER", shortName: "J LOWER", stand: "J", startAngle: 352, endAngle: 16, bays: [1, 2, 3, 4], color: "#fdbb68", price: 2500, gate: "GATE 1 (V. Pattabhiraman)", tier: "lower", roofType: "PTFE Canopy" },
        { id: "blk-che-k-l", name: "K STAND LOWER", shortName: "K LOWER", stand: "K", startAngle: 18, endAngle: 42, bays: [1, 2, 3, 4], color: "#fdbb68", price: 2500, gate: "GATE 1 (V. Pattabhiraman)", tier: "lower", roofType: "PTFE Canopy" },
        { id: "blk-che-a-l", name: "A STAND LOWER", shortName: "A LOWER", stand: "A", startAngle: 45, endAngle: 67, bays: [1, 2, 3, 4], color: "#fdbb68", price: 2000, gate: "GATE 2 (Victoria Hostel Rd)", tier: "lower" },
        { id: "blk-che-b-l", name: "B STAND LOWER", shortName: "B LOWER", stand: "B", startAngle: 69, endAngle: 91, bays: [1, 2, 3, 4], color: "#fdbb68", price: 2000, gate: "GATE 2 (Victoria Hostel Rd)", tier: "lower" },
        { id: "blk-che-c-l", name: "C STAND LOWER", shortName: "C LOWER", stand: "C", startAngle: 93, endAngle: 115, bays: [1, 2, 3, 4], color: "#fdbb68", price: 2200, gate: "GATE 3 (Victoria Hostel Rd)", tier: "lower" },
        { id: "blk-che-d-l", name: "D STAND LOWER", shortName: "D LOWER", stand: "D", startAngle: 117, endAngle: 139, bays: [1, 2, 3, 4], color: "#fdbb68", price: 2200, gate: "GATE 4 (Marina Beach Rd)", tier: "lower" },
        { id: "blk-che-e-l", name: "E STAND LOWER", shortName: "E LOWER", stand: "E", startAngle: 141, endAngle: 163, bays: [1, 2, 3, 4], color: "#fdbb68", price: 2000, gate: "GATE 5 (Marina Beach Rd)", tier: "lower" },
        { id: "blk-che-anna-l", name: "ANNA PAVILION LOWER", shortName: "ANNA L1", stand: "ANNA", startAngle: 166, endAngle: 192, bays: [1, 2, 3, 4], color: "#ffffff", price: 3500, gate: "GATE 6 (Anna Pavilion VIP)", isVip: true, tier: "premium" },
        { id: "blk-che-kmk-l", name: "KALAIGNAR KARUNANIDHI STAND LOWER", shortName: "KMK LOWER", stand: "KMK", startAngle: 195, endAngle: 226, bays: [1, 2, 3, 4], color: "#ffffff", price: 4500, gate: "GATE 7 (KMK Stand VIP)", isVip: true, tier: "premium" },
        { id: "blk-che-f-l", name: "F STAND LOWER", shortName: "F LOWER", stand: "F", startAngle: 229, endAngle: 258, bays: [1, 2, 3, 4], color: "#fdbb68", price: 2000, gate: "GATE 8 (Bells Road)", tier: "lower" },
        { id: "blk-che-g-l", name: "G STAND LOWER", shortName: "G LOWER", stand: "G", startAngle: 261, endAngle: 290, bays: [1, 2, 3, 4], color: "#fdbb68", price: 2000, gate: "GATE 9 (Bells Road)", tier: "lower" },
        { id: "blk-che-h-l", name: "H STAND LOWER", shortName: "H LOWER", stand: "H", startAngle: 293, endAngle: 324, bays: [1, 2, 3, 4, 5], color: "#fdbb68", price: 2200, gate: "GATE 10 (Wallajah Road)", tier: "lower" }
      ],
      outerBlocks: [
        { id: "blk-che-i-u", name: "I STAND UPPER (PTFE ROOF)", shortName: "I UPPER", stand: "I", startAngle: 326, endAngle: 350, bays: [1, 2, 3, 4, 5], color: "#c6e9fa", price: 1600, gate: "GATE 1 (V. Pattabhiraman)", tier: "upper", roofType: "PTFE Canopy" },
        { id: "blk-che-j-u", name: "J STAND UPPER (PTFE ROOF)", shortName: "J UPPER", stand: "J", startAngle: 352, endAngle: 16, bays: [1, 2, 3, 4, 5], color: "#c6e9fa", price: 1600, gate: "GATE 1 (V. Pattabhiraman)", tier: "upper", roofType: "PTFE Canopy" },
        { id: "blk-che-k-u", name: "K STAND UPPER (PTFE ROOF)", shortName: "K UPPER", stand: "K", startAngle: 18, endAngle: 42, bays: [1, 2, 3, 4, 5], color: "#c6e9fa", price: 1600, gate: "GATE 1 (V. Pattabhiraman)", tier: "upper", roofType: "PTFE Canopy" },
        { id: "blk-che-a-u", name: "A STAND UPPER", shortName: "A UPPER", stand: "A", startAngle: 45, endAngle: 67, bays: [1, 2, 3, 4, 5], color: "#c6e9fa", price: 1200, gate: "GATE 2 (Victoria Hostel Rd)", tier: "upper" },
        { id: "blk-che-b-u", name: "B STAND UPPER", shortName: "B UPPER", stand: "B", startAngle: 69, endAngle: 91, bays: [1, 2, 3, 4, 5], color: "#c6e9fa", price: 1200, gate: "GATE 2 (Victoria Hostel Rd)", tier: "upper" },
        { id: "blk-che-c-u", name: "C STAND UPPER", shortName: "C UPPER", stand: "C", startAngle: 93, endAngle: 115, bays: [1, 2, 3, 4, 5], color: "#c6e9fa", price: 1400, gate: "GATE 3 (Victoria Hostel Rd)", tier: "upper" },
        { id: "blk-che-d-u", name: "D STAND UPPER", shortName: "D UPPER", stand: "D", startAngle: 117, endAngle: 139, bays: [1, 2, 3, 4, 5], color: "#c6e9fa", price: 1400, gate: "GATE 4 (Marina Beach Rd)", tier: "upper" },
        { id: "blk-che-e-u", name: "E STAND UPPER", shortName: "E UPPER", stand: "E", startAngle: 141, endAngle: 163, bays: [1, 2, 3, 4, 5], color: "#c6e9fa", price: 1200, gate: "GATE 5 (Marina Beach Rd)", tier: "upper" },
        { id: "blk-che-anna-u", name: "ANNA PAVILION UPPER TERRACE", shortName: "ANNA UPPER", stand: "ANNA", startAngle: 166, endAngle: 192, bays: [1, 2, 3, 4, 5], color: "#c6e9fa", price: 2200, gate: "GATE 6 (Anna Pavilion VIP)", tier: "upper" },
        { id: "blk-che-kmk-u", name: "KALAIGNAR KARUNANIDHI STAND UPPER", shortName: "KMK UPPER", stand: "KMK", startAngle: 195, endAngle: 226, bays: [1, 2, 3, 4, 5], color: "#c6e9fa", price: 2500, gate: "GATE 7 (KMK Stand VIP)", tier: "upper" },
        { id: "blk-che-f-u", name: "F STAND UPPER", shortName: "F UPPER", stand: "F", startAngle: 229, endAngle: 258, bays: [1, 2, 3, 4, 5], color: "#c6e9fa", price: 1200, gate: "GATE 8 (Bells Road)", tier: "upper" },
        { id: "blk-che-g-u", name: "G STAND UPPER", shortName: "G UPPER", stand: "G", startAngle: 261, endAngle: 290, bays: [1, 2, 3, 4, 5], color: "#c6e9fa", price: 1200, gate: "GATE 9 (Bells Road)", tier: "upper" },
        { id: "blk-che-h-u", name: "H STAND UPPER", shortName: "H UPPER", stand: "H", startAngle: 293, endAngle: 324, bays: [1, 2, 3, 4, 5, 6], color: "#c6e9fa", price: 1400, gate: "GATE 10 (Wallajah Road)", tier: "upper" }
      ],
      southHospitality: {
        hasGallery: true,
        startAngle: 166,
        endAngle: 226,
        gallery: {
          name: "KALAIGNAR KARUNANIDHI PRESIDENTIAL GALLERY",
          rStart: 248,
          rEnd: 286,
          price: 5500,
          gate: "GATE 7 (KMK VIP)",
          bays: [
            { id: "kmk-1", label: "BAY 1", bg: "#fce7f3", text: "#9d174d" },
            { id: "kmk-2", label: "BAY 2", bg: "#f1f5f9", text: "#334155" },
            { id: "kmk-3", label: "BAY 3", bg: "#fce7f3", text: "#9d174d" },
            { id: "kmk-4", label: "BAY 4", bg: "#f1f5f9", text: "#334155" },
            { id: "kmk-5", label: "BAY 5", bg: "#fce7f3", text: "#9d174d" },
            { id: "kmk-6", label: "BAY 6", bg: "#f1f5f9", text: "#334155" }
          ]
        },
        floor4: {
          name: "CHEPAUK TNCA CORPORATE SUITES 3RD FLOOR",
          rStart: 290,
          rEnd: 330,
          price: 7500,
          gate: "GATE 7 (VIP)",
          suitesCount: 14
        },
        floor5: {
          name: "ANNA PAVILION MEDIA & COMMENTARY TERRACE",
          rStart: 334,
          rEnd: 374,
          price: 8500,
          gate: "GATE 6 (VIP)",
          suitesCount: 16
        }
      },
      gates: [
        { id: "gate-1", name: "GATE 1", label: "GATE 1 (V. Pattabhiraman Gate / Stands I, J, K)", angle: 0, gateRadius: 395 },
        { id: "gate-2", name: "GATE 2", label: "GATE 2 (Victoria Hostel Rd / Stands A, B)", angle: 68, gateRadius: 395 },
        { id: "gate-3", name: "GATE 3", label: "GATE 3 (Victoria Hostel Rd / Stand C)", angle: 104, gateRadius: 395 },
        { id: "gate-4", name: "GATE 4", label: "GATE 4 (Marina Beach Rd / Stand D)", angle: 128, gateRadius: 395 },
        { id: "gate-5", name: "GATE 5", label: "GATE 5 (Chepauk Station / Stand E)", angle: 152, gateRadius: 395 },
        { id: "gate-6", name: "GATE 6", label: "GATE 6 (Anna Pavilion VIP / Players Entry)", angle: 179, gateRadius: 395 },
        { id: "gate-7", name: "GATE 7", label: "GATE 7 (Kalaignar Karunanidhi Stand / VIP Suites)", angle: 210, gateRadius: 395 },
        { id: "gate-8", name: "GATE 8", label: "GATE 8 (Bells Road / Stand F)", angle: 243, gateRadius: 395 },
        { id: "gate-9", name: "GATE 9", label: "GATE 9 (Bells Road / Stand G)", angle: 275, gateRadius: 395 },
        { id: "gate-10", name: "GATE 10", label: "GATE 10 (Wallajah Road / Stand H)", angle: 308, gateRadius: 395 }
      ],
      dugouts: [
        { id: "dugout-home", name: "HOME TEAM DUGOUT", angle: 160, radius: 140, color: "#2563eb" },
        { id: "dugout-away", name: "AWAY TEAM DUGOUT", angle: 200, radius: 140, color: "#dc2626" }
      ]
    },

    // 5. Rajiv Gandhi International Stadium (Uppal), Hyderabad
    "hyd-uppal": {
      name: "Rajiv Gandhi International Cricket Stadium",
      commonName: "Uppal Stadium",
      location: "Uppal, Hyderabad, Telangana, India",
      architectureType: "North–South Elongated Two-Tier Bowl with Dual Pavilions, Distinctive Long-Span White Cantilever Canopies, & Dominant Orange Seating",
      layoutType: "uppal-hyderabad-bowl",
      themeBadge: "55,000 Cap. International Cricket Arena • Uppal, Hyderabad",
      highlights: "North Pavilion (VVS Laxman End) with White Cantilever Canopy & Media Center, South Pavilion End (Players Lounge & Presidential Suites) with White Cantilever Canopy, Multi-Tier East & West Stands (Ground, First Floor, Terrace) in Authentic Deep Orange & Bright Orange Seating, 6 Silver Floodlight Towers, Natural Green Outfield",
      roofStyle: "Dual North & South Long-Span White / Light-Grey Curved Cantilever Canopies on Concrete Support Pylons",
      totalCapacity: 55000,
      ellipseX: 0.94, // North–South elongated oval
      ellipseY: 1.05,
      rField: 128,
      rInnerStart: 150,
      rInnerEnd: 232,
      rOuterStart: 246,
      rOuterEnd: 362,
      lowerColor: "#ea580c", // Deep Orange Seating
      upperColor: "#f97316", // Bright Orange Seating
      hasCanopies: true,
      hasUppalCanopies: true,
      hasFloodlights: true,
      northCanopy: { startAngle: 330, endAngle: 30, rStart: 242, rEnd: 376, label: "NORTH PAVILION CANOPY (VVS LAXMAN END)" },
      southCanopy: { startAngle: 150, endAngle: 210, rStart: 242, rEnd: 376, label: "SOUTH PAVILION CANOPY (PAVILION END)" },
      innerBlocks: [
        { id: "blk-hyd-north-gf", name: "NORTH PAVILION GROUND FLOOR (VVS LAXMAN END)", shortName: "NORTH G.F.", stand: "North Pavilion", level: "Ground Floor", startAngle: 334, endAngle: 26, bays: [1, 2, 3, 4, 5, 6], color: "#ea580c", price: 3000, gate: "GATE 3 (North Main - VVS Laxman End)", tier: "lower", roofType: "North White Canopy" },
        { id: "blk-hyd-ne-gf", name: "NORTH-EAST STAND LOWER", shortName: "NE LOWER", stand: "North-East Stand", level: "Ground Floor", startAngle: 30, endAngle: 68, bays: [1, 2, 3, 4, 5], color: "#ea580c", price: 2200, gate: "GATE 2 (North-East Entry)", tier: "lower" },
        { id: "blk-hyd-east1-gf", name: "EAST STAND LOWER BLOCK 1 (E1-E2)", shortName: "EAST 1 (E1-E2)", stand: "East Stand", level: "Ground Floor", startAngle: 72, endAngle: 112, bays: [1, 2, 3, 4, 5], color: "#ea580c", price: 2000, gate: "GATE 1 (East Main Entry)", tier: "lower" },
        { id: "blk-hyd-east2-gf", name: "EAST STAND LOWER BLOCK 2 (E3-E4)", shortName: "EAST 2 (E3-E4)", stand: "East Stand", level: "Ground Floor", startAngle: 116, endAngle: 152, bays: [1, 2, 3, 4, 5], color: "#c2410c", price: 2000, gate: "GATE 1 (East Main Entry)", tier: "lower" },
        { id: "blk-hyd-south-gf", name: "SOUTH PAVILION LOWER (PLAYERS & VIP)", shortName: "SOUTH G.F.", stand: "South Pavilion", level: "Ground Floor", startAngle: 156, endAngle: 204, bays: [1, 2, 3, 4, 5, 6], color: "#c2410c", price: 4500, gate: "GATE 8 (South VIP - Pavilion End)", isVip: true, tier: "premium", roofType: "South White Canopy" },
        { id: "blk-hyd-west2-gf", name: "WEST STAND LOWER BLOCK 2 (W3-W4)", shortName: "WEST 2 (W3-W4)", stand: "West Stand", level: "Ground Floor", startAngle: 208, endAngle: 246, bays: [1, 2, 3, 4, 5], color: "#c2410c", price: 2000, gate: "GATE 6 (West Main Entry)", tier: "lower" },
        { id: "blk-hyd-west1-gf", name: "WEST STAND LOWER BLOCK 1 (W1-W2)", shortName: "WEST 1 (W1-W2)", stand: "West Stand", level: "Ground Floor", startAngle: 250, endAngle: 290, bays: [1, 2, 3, 4, 5], color: "#ea580c", price: 2000, gate: "GATE 5 (West Main Entry)", tier: "lower" },
        { id: "blk-hyd-nw-gf", name: "NORTH-WEST STAND LOWER", shortName: "NW LOWER", stand: "North-West Stand", level: "Ground Floor", startAngle: 294, endAngle: 330, bays: [1, 2, 3, 4, 5], color: "#ea580c", price: 2200, gate: "GATE 4 (North-West Entry)", tier: "lower" }
      ],
      outerBlocks: [
        { id: "blk-hyd-north-ff", name: "NORTH PAVILION 1ST FLOOR & MEDIA BOX", shortName: "NORTH 1ST FL", stand: "North Pavilion", level: "First Floor", startAngle: 334, endAngle: 26, bays: [1, 2, 3, 4, 5, 6, 7], color: "#f97316", price: 1800, gate: "GATE 3 (North Main - VVS Laxman End)", tier: "upper", roofType: "North White Canopy" },
        { id: "blk-hyd-ne-tf", name: "NORTH-EAST STAND UPPER (VVS LAXMAN)", shortName: "NE UPPER", stand: "North-East Stand", level: "Upper Tier", startAngle: 30, endAngle: 68, bays: [1, 2, 3, 4, 5, 6], color: "#fb923c", price: 1500, gate: "GATE 2 (North-East Entry)", tier: "upper" },
        { id: "blk-hyd-east1-ff", name: "EAST STAND 1ST FLOOR (E1-E2 UPPER)", shortName: "EAST 1 UPPER", stand: "East Stand", level: "First Floor", startAngle: 72, endAngle: 112, bays: [1, 2, 3, 4, 5, 6], color: "#f97316", price: 1300, gate: "GATE 1 (East Main Entry)", tier: "upper" },
        { id: "blk-hyd-east2-tf", name: "EAST STAND TERRACE (E3-E4 TERRACE)", shortName: "EAST 2 TERRACE", stand: "East Stand", level: "Terrace Level", startAngle: 116, endAngle: 152, bays: [1, 2, 3, 4, 5, 6], color: "#ea580c", price: 1400, gate: "GATE 1 (East Main Entry)", tier: "upper" },
        { id: "blk-hyd-south-tf", name: "SOUTH PAVILION UPPER & SKY TERRACE", shortName: "SOUTH UPPER", stand: "South Pavilion", level: "Upper Tier", startAngle: 156, endAngle: 204, bays: [1, 2, 3, 4, 5, 6, 7], color: "#f97316", price: 2500, gate: "GATE 8 (South VIP - Pavilion End)", tier: "upper", roofType: "South White Canopy" },
        { id: "blk-hyd-west2-tf", name: "WEST STAND TERRACE (W3-W4 TERRACE)", shortName: "WEST 2 TERRACE", stand: "West Stand", level: "Terrace Level", startAngle: 208, endAngle: 246, bays: [1, 2, 3, 4, 5, 6], color: "#ea580c", price: 1400, gate: "GATE 6 (West Main Entry)", tier: "upper" },
        { id: "blk-hyd-west1-ff", name: "WEST STAND 1ST FLOOR (W1-W2 UPPER)", shortName: "WEST 1 UPPER", stand: "West Stand", level: "First Floor", startAngle: 250, endAngle: 290, bays: [1, 2, 3, 4, 5, 6], color: "#f97316", price: 1300, gate: "GATE 5 (West Main Entry)", tier: "upper" },
        { id: "blk-hyd-nw-tf", name: "NORTH-WEST STAND UPPER", shortName: "NW UPPER", stand: "North-West Stand", level: "Upper Tier", startAngle: 294, endAngle: 330, bays: [1, 2, 3, 4, 5, 6], color: "#fb923c", price: 1500, gate: "GATE 4 (North-West Entry)", tier: "upper" }
      ],
      southHospitality: {
        hasGallery: true,
        startAngle: 156,
        endAngle: 204,
        gallery: {
          name: "HCA PRESIDENTIAL GALLERY (SOUTH PAVILION)",
          rStart: 244,
          rEnd: 284,
          price: 5500,
          gate: "GATE 8 (South VIP - Pavilion End)",
          bays: [
            { id: "uppal-1", label: "BAY 1", bg: "#ffedd5", text: "#c2410c" },
            { id: "uppal-2", label: "BAY 2", bg: "#f1f5f9", text: "#334155" },
            { id: "uppal-3", label: "BAY 3", bg: "#ffedd5", text: "#c2410c" },
            { id: "uppal-4", label: "BAY 4", bg: "#f1f5f9", text: "#334155" },
            { id: "uppal-5", label: "BAY 5", bg: "#ffedd5", text: "#c2410c" },
            { id: "uppal-6", label: "BAY 6", bg: "#f1f5f9", text: "#334155" }
          ]
        },
        floor4: {
          name: "DECCAN CORPORATE SUITES 3RD FLOOR",
          rStart: 288,
          rEnd: 326,
          price: 7500,
          gate: "GATE 8 (South VIP - Pavilion End)",
          suitesCount: 14
        },
        floor5: {
          name: "SOUTH PAVILION EXECUTIVE SKY TERRACE",
          rStart: 330,
          rEnd: 368,
          price: 8500,
          gate: "GATE 8 (South VIP - Pavilion End)",
          suitesCount: 16
        }
      },
      floodlights: [
        { id: "fl-1", name: "LIGHT TOWER 1 (NE)", angle: 35, radius: 408 },
        { id: "fl-2", name: "LIGHT TOWER 2 (EAST)", angle: 90, radius: 408 },
        { id: "fl-3", name: "LIGHT TOWER 3 (SE)", angle: 145, radius: 408 },
        { id: "fl-4", name: "LIGHT TOWER 4 (SW)", angle: 215, radius: 408 },
        { id: "fl-5", name: "LIGHT TOWER 5 (WEST)", angle: 270, radius: 408 },
        { id: "fl-6", name: "LIGHT TOWER 6 (NW)", angle: 325, radius: 408 }
      ],
      gates: [
        { id: "gate-1", name: "GATE 1", label: "GATE 1 (East Stand / Uppal Main Road)", angle: 90, gateRadius: 395 },
        { id: "gate-2", name: "GATE 2", label: "GATE 2 (North-East Entry / VVS Laxman East)", angle: 48, gateRadius: 395 },
        { id: "gate-3", name: "GATE 3", label: "GATE 3 (North Pavilion Main / VVS Laxman End)", angle: 0, gateRadius: 395 },
        { id: "gate-4", name: "GATE 4", label: "GATE 4 (North-West Entry)", angle: 312, gateRadius: 395 },
        { id: "gate-5", name: "GATE 5", label: "GATE 5 (West Stand Lower Entry / Habsiguda side)", angle: 270, gateRadius: 395 },
        { id: "gate-6", name: "GATE 6", label: "GATE 6 (West Stand Upper Entry)", angle: 226, gateRadius: 395 },
        { id: "gate-7", name: "GATE 7", label: "GATE 7 (South-East Entry)", angle: 135, gateRadius: 395 },
        { id: "gate-8", name: "GATE 8", label: "GATE 8 (South Pavilion VIP & Players / Pavilion End)", angle: 180, gateRadius: 395 }
      ],
      dugouts: [
        { id: "dugout-home", name: "HOME TEAM DUGOUT", angle: 162, radius: 140, color: "#ea580c" },
        { id: "dugout-away", name: "AWAY TEAM DUGOUT", angle: 198, radius: 140, color: "#475569" }
      ]
    },

    // 6. Eden Gardens Stadium, Kolkata
    "kol-eden": {
      name: "Eden Gardens Stadium",
      location: "Kolkata, West Bengal",
      architectureType: "68,000 Horseshoe Colosseum Arena & B.C. Roy Club House",
      layoutType: "rectangular-horseshoe-colosseum",
      themeBadge: "Mecca of Indian Cricket • Maidan, Kolkata",
      highlights: "Multi-tiered rectangular blocks wrapping into a colossal horseshoe bowl, B.C. Roy Club House, High Court End, KMC End, Ranji Stand, Pankaj Roy Stand",
      roofStyle: "Multi-Tier Stepped Concrete Overhangs",
      totalCapacity: 68000,
      ellipseX: 1.0,
      ellipseY: 0.96,
      rField: 132,
      rInnerStart: 156,
      rInnerEnd: 236,
      rOuterStart: 250,
      rOuterEnd: 362,
      lowerColor: "#fdbb68",
      upperColor: "#c6e9fa",
      innerBlocks: [
        { id: "blk-kol-bcroy-l", name: "B.C. ROY CLUB HOUSE LOWER", shortName: "BC ROY L1", startAngle: 330, endAngle: 30, bays: [1, 2, 3, 4, 5, 6], color: "#fdbb68", price: 3200, gate: "GATE 1", tier: "lower" },
        { id: "blk-kol-bc-l", name: "HIGH COURT END BLOCK B-C", shortName: "HIGH COURT", startAngle: 34, endAngle: 86, bays: [1, 2, 3, 4, 5], color: "#fdbb68", price: 2000, gate: "GATE 3", tier: "lower" },
        { id: "blk-kol-de-l", name: "EAST STAND BLOCK D-E", shortName: "EAST D-E", startAngle: 90, endAngle: 142, bays: [1, 2, 3, 4, 5, 6], color: "#fdbb68", price: 2200, gate: "GATE 7", tier: "lower" },
        { id: "blk-kol-vip-lounge", name: "EDEN GARDENS PRESIDENTIAL SUITE", shortName: "EDEN VIP", startAngle: 146, endAngle: 214, bays: [1, 2, 3, 4], color: "#ffffff", price: 5500, gate: "GATE 12", isVip: true, tier: "premium" },
        { id: "blk-kol-gh-l", name: "SOUTH-WEST BLOCK G-H", shortName: "BLOCK G-H", startAngle: 218, endAngle: 270, bays: [1, 2, 3, 4, 5, 6], color: "#fdbb68", price: 2000, gate: "GATE 12", tier: "lower" },
        { id: "blk-kol-jkl-l", name: "WEST STAND BLOCK J-K-L", shortName: "WEST J-K-L", startAngle: 274, endAngle: 326, bays: [1, 2, 3, 4, 5], color: "#fdbb68", price: 2200, gate: "GATE 1", tier: "lower" }
      ],
      outerBlocks: [
        { id: "blk-kol-bcroy-u", name: "B.C. ROY CLUB HOUSE UPPER", shortName: "BC ROY UPPER", startAngle: 330, endAngle: 30, bays: [1, 2, 3, 4, 5, 6, 7], color: "#c6e9fa", price: 1800, gate: "GATE 1", tier: "upper" },
        { id: "blk-kol-bc-u", name: "HIGH COURT UPPER BLOCK B-C", shortName: "UPPER B-C", startAngle: 34, endAngle: 86, bays: [1, 2, 3, 4, 5, 6], color: "#c6e9fa", price: 1500, gate: "GATE 3", tier: "upper" },
        { id: "blk-kol-de-u", name: "EAST STAND UPPER BLOCK D-E", shortName: "UPPER D-E", startAngle: 90, endAngle: 142, bays: [1, 2, 3, 4, 5, 6, 7], color: "#c6e9fa", price: 1600, gate: "GATE 7", tier: "upper" },
        { id: "blk-kol-gh-u", name: "SOUTH-WEST UPPER BLOCK G-H", shortName: "UPPER G-H", startAngle: 218, endAngle: 270, bays: [1, 2, 3, 4, 5, 6, 7], color: "#c6e9fa", price: 1400, gate: "GATE 12", tier: "upper" },
        { id: "blk-kol-jkl-u", name: "WEST STAND UPPER BLOCK J-K-L", shortName: "UPPER J-K-L", startAngle: 274, endAngle: 326, bays: [1, 2, 3, 4, 5, 6], color: "#c6e9fa", price: 1500, gate: "GATE 1", tier: "upper" }
      ],
      southHospitality: {
        hasGallery: true,
        startAngle: 146,
        endAngle: 214,
        gallery: {
          name: "CAB PRESIDENTIAL GALLERY",
          rStart: 248,
          rEnd: 286,
          price: 5500,
          gate: "GATE 12 (VIP)",
          bays: [
            { id: "kol-1", label: "BAY 1", bg: "#fce7f3", text: "#9d174d" },
            { id: "kol-2", label: "BAY 2", bg: "#f1f5f9", text: "#334155" },
            { id: "kol-3", label: "BAY 3", bg: "#f1f5f9", text: "#334155" },
            { id: "kol-4", label: "BAY 4", bg: "#fce7f3", text: "#9d174d" }
          ]
        },
        floor4: {
          name: "EDEN CLUB HOUSE SUITES 4TH FLOOR",
          rStart: 290,
          rEnd: 330,
          price: 7500,
          gate: "GATE 12 (VIP)",
          suitesCount: 16
        },
        floor5: {
          name: "JAGMOHAN DALMIYA LUXURY LOUNGE",
          rStart: 334,
          rEnd: 374,
          price: 8500,
          gate: "GATE 12 (VIP)",
          suitesCount: 18
        }
      },
      gates: [
        { id: "gate-1", name: "GATE 1", label: "GATE 1 (Club House)", angle: 0, gateRadius: 395 },
        { id: "gate-3", name: "GATE 3", label: "GATE 3 (High Court)", angle: 60, gateRadius: 395 },
        { id: "gate-7", name: "GATE 7", label: "GATE 7 (KMC End)", angle: 120, gateRadius: 395 },
        { id: "gate-12", name: "GATE 12", label: "GATE 12 (Ganges End VIP)", angle: 180, gateRadius: 395 }
      ],
      dugouts: [
        { id: "dugout-home", name: "HOME TEAM DUGOUT", angle: 160, radius: 144, color: "#2563eb" },
        { id: "dugout-away", name: "AWAY TEAM DUGOUT", angle: 200, radius: 144, color: "#dc2626" }
      ]
    },

    // 7. Arun Jaitley Stadium, Delhi
    "del-kotla": {
      name: "Arun Jaitley Stadium",
      location: "Delhi NCR",
      architectureType: "Heritage Fortress with Ancient Kotla Baoli Tower",
      layoutType: "rectangular-heritage-fortress",
      themeBadge: "Historic Capital Arena • Bahadur Shah Zafar Marg, Delhi",
      highlights: "14th Century Feroz Shah Kotla Heritage Baoli Turret at North-East corner, Virat Kohli Pavilion Stand, Bishan Singh Bedi Stand, Mohinder Amarnath Stand, Gautam Gambhir Stand",
      roofStyle: "Terraced Multi-Level Pavilion Roofs",
      totalCapacity: 41842,
      ellipseX: 1.0,
      ellipseY: 0.96,
      rField: 132,
      rInnerStart: 156,
      rInnerEnd: 236,
      rOuterStart: 250,
      rOuterEnd: 362,
      lowerColor: "#fdbb68",
      upperColor: "#c6e9fa",
      innerBlocks: [
        { id: "blk-del-virat-l", name: "VIRAT KOHLI PAVILION LOWER", shortName: "VIRAT L1", startAngle: 330, endAngle: 30, bays: [1, 2, 3, 4, 5, 6], color: "#fdbb68", price: 3200, gate: "GATE 14", tier: "lower" },
        { id: "blk-del-bedi-l", name: "BISHAN SINGH BEDI STAND LOWER", shortName: "BEDI L1", startAngle: 34, endAngle: 86, bays: [1, 2, 3, 4, 5], color: "#fdbb68", price: 2200, gate: "GATE 1", tier: "lower" },
        { id: "blk-del-amarnath-l", name: "MOHINDER AMARNATH STAND LOWER", shortName: "AMARNATH L1", startAngle: 90, endAngle: 142, bays: [1, 2, 3, 4, 5, 6], color: "#fdbb68", price: 2400, gate: "GATE 8", tier: "lower" },
        { id: "blk-del-ddca-vip", name: "DDCA PRESIDENT'S PAVILION", shortName: "DDCA VIP", startAngle: 146, endAngle: 214, bays: [1, 2, 3, 4], color: "#ffffff", price: 5500, gate: "GATE 8", isVip: true, tier: "premium" },
        { id: "blk-del-gambhir-l", name: "GAUTAM GAMBHIR STAND LOWER", shortName: "GAMBHIR L1", startAngle: 218, endAngle: 270, bays: [1, 2, 3, 4, 5, 6], color: "#fdbb68", price: 2200, gate: "GATE 14", tier: "lower" },
        { id: "blk-del-west-l", name: "NORTH-WEST GALLERY LOWER", shortName: "NW GALLERY", startAngle: 274, endAngle: 326, bays: [1, 2, 3, 4, 5], color: "#fdbb68", price: 2000, gate: "GATE 14", tier: "lower" }
      ],
      outerBlocks: [
        { id: "blk-del-virat-u", name: "VIRAT KOHLI PAVILION UPPER", shortName: "VIRAT UPPER", startAngle: 330, endAngle: 30, bays: [1, 2, 3, 4, 5, 6, 7], color: "#c6e9fa", price: 1800, gate: "GATE 14", tier: "upper" },
        { id: "blk-del-bedi-u", name: "BEDI STAND UPPER TIER", shortName: "BEDI UPPER", startAngle: 34, endAngle: 86, bays: [1, 2, 3, 4, 5, 6], color: "#c6e9fa", price: 1400, gate: "GATE 1", tier: "upper" },
        { id: "blk-del-amarnath-u", name: "AMARNATH STAND UPPER TIER", shortName: "AMARNATH U", startAngle: 90, endAngle: 142, bays: [1, 2, 3, 4, 5, 6, 7], color: "#c6e9fa", price: 1500, gate: "GATE 8", tier: "upper" },
        { id: "blk-del-gambhir-u", name: "GAMBHIR STAND UPPER TIER", shortName: "GAMBHIR U", startAngle: 218, endAngle: 270, bays: [1, 2, 3, 4, 5, 6, 7], color: "#c6e9fa", price: 1400, gate: "GATE 14", tier: "upper" },
        { id: "blk-del-west-u", name: "NORTH-WEST UPPER TIER", shortName: "NW UPPER", startAngle: 274, endAngle: 326, bays: [1, 2, 3, 4, 5, 6], color: "#c6e9fa", price: 1400, gate: "GATE 14", tier: "upper" }
      ],
      southHospitality: {
        hasGallery: true,
        startAngle: 146,
        endAngle: 214,
        gallery: {
          name: "DDCA PRESIDENT GALLERY",
          rStart: 248,
          rEnd: 286,
          price: 5500,
          gate: "GATE 8 (VIP)",
          bays: [
            { id: "del-1", label: "BAY 1", bg: "#fce7f3", text: "#9d174d" },
            { id: "del-2", label: "BAY 2", bg: "#f1f5f9", text: "#334155" },
            { id: "del-3", label: "BAY 3", bg: "#f1f5f9", text: "#334155" },
            { id: "del-4", label: "BAY 4", bg: "#fce7f3", text: "#9d174d" }
          ]
        },
        floor4: {
          name: "KOTLA HERITAGE SUITES 4TH FLOOR",
          rStart: 290,
          rEnd: 330,
          price: 7500,
          gate: "GATE 8 (VIP)",
          suitesCount: 14
        },
        floor5: {
          name: "DELHI PLATINUM ROOF LOUNGE",
          rStart: 334,
          rEnd: 374,
          price: 8500,
          gate: "GATE 8 (VIP)",
          suitesCount: 16
        }
      },
      gates: [
        { id: "gate-1", name: "GATE 1", label: "GATE 1 (Bahadur Shah Zafar)", angle: 60, gateRadius: 395 },
        { id: "gate-8", name: "GATE 8", label: "GATE 8 (Kotla Fort VIP)", angle: 180, gateRadius: 395 },
        { id: "gate-14", name: "GATE 14", label: "GATE 14 (VIP Pavilion)", angle: 0, gateRadius: 395 }
      ],
      dugouts: [
        { id: "dugout-home", name: "HOME TEAM DUGOUT", angle: 160, radius: 144, color: "#2563eb" },
        { id: "dugout-away", name: "AWAY TEAM DUGOUT", angle: 200, radius: 144, color: "#dc2626" }
      ]
    },

    // 8. HPCA Stadium, Dharamshala
    "hpca-dharamshala": {
      name: "HPCA International Cricket Stadium",
      shortName: "HPCA Dharamshala",
      location: "Dharamshala, Himachal Pradesh, India",
      architectureType: "Tibetan Pagoda Pavilion with Red & White Roofs, Kangra Stone & Open Dhauladhar Mountain Vista",
      layoutType: "rectangular-himalayan-pagoda",
      themeBadge: "Himalayan Cricket Sanctuary • 1,457m ASL, Kangra Valley, Dharamshala",
      highlights: "Traditional Multi-Tier Tibetan Pagoda Roofed VIP Pavilion (Red & White Roofs with Dark Timber & Kangra Stone), Dhauladhar Mountain View East Stand, Pine Valley West Stand, Wide Open North Terrace framing 15,000ft Snow Peaks, 6 High-Mast Floodlight Towers",
      roofStyle: "Traditional Red & White Gabled Multi-Tiered Tibetan Pagoda Canopies",
      altitude: "1,457m ASL (Dhauladhar Range, Kangra Valley)",
      totalCapacity: 23000,
      ellipseX: 1.02,
      ellipseY: 0.95,
      rField: 130,
      rInnerStart: 154,
      rInnerEnd: 234,
      rOuterStart: 248,
      rOuterEnd: 360,
      lowerColor: "#1d4ed8",
      upperColor: "#0284c7",
      hasHpcaArchitecture: true,
      hasDhauladharMountains: true,
      hasPagodaPavilion: true,
      hasFloodlights: true,
      floodlights: [
        { id: "fl-dha-1", name: "T1 (NE Peak)", angle: 30, radius: 405 },
        { id: "fl-dha-2", name: "T2 (E Mountain)", angle: 90, radius: 405 },
        { id: "fl-dha-3", name: "T3 (SE Valley)", angle: 150, radius: 405 },
        { id: "fl-dha-4", name: "T4 (SW Pine)", angle: 210, radius: 405 },
        { id: "fl-dha-5", name: "T5 (W Ridge)", angle: 270, radius: 405 },
        { id: "fl-dha-6", name: "T6 (NW Vista)", angle: 330, radius: 405 }
      ],
      innerBlocks: [
        { id: "blk-dha-pav-l", name: "HPCA MAIN PAVILION LOWER (PLAYERS & VIP)", shortName: "PAVILION L1", startAngle: 146, endAngle: 214, bays: [1, 2, 3, 4], color: "#1e40af", price: 3500, gate: "GATE 1 (PAVILION)", isVip: true, tier: "premium", stand: "South Main Pavilion" },
        { id: "blk-dha-e1-l", name: "DHAULADHAR STAND LOWER E1", shortName: "DHAULADHAR E1", startAngle: 34, endAngle: 62, bays: [1, 2, 3, 4], color: "#1d4ed8", price: 1600, gate: "GATE 3 (EAST)", tier: "lower", stand: "East Stand" },
        { id: "blk-dha-e2-l", name: "DHAULADHAR STAND LOWER E2", shortName: "DHAULADHAR E2", startAngle: 64, endAngle: 92, bays: [1, 2, 3, 4], color: "#2563eb", price: 1600, gate: "GATE 3 (EAST)", tier: "lower", stand: "East Stand" },
        { id: "blk-dha-e3-l", name: "EAST VALLEY STAND LOWER E3", shortName: "VALLEY E3", startAngle: 94, endAngle: 122, bays: [1, 2, 3, 4], color: "#1d4ed8", price: 1400, gate: "GATE 3 (EAST)", tier: "lower", stand: "East Stand" },
        { id: "blk-dha-e4-l", name: "EAST VALLEY STAND LOWER E4", shortName: "VALLEY E4", startAngle: 124, endAngle: 144, bays: [1, 2, 3], color: "#2563eb", price: 1400, gate: "GATE 3 (EAST)", tier: "lower", stand: "East Stand" },
        { id: "blk-dha-w1-l", name: "WEST PINE STAND LOWER W1", shortName: "PINE W1", startAngle: 216, endAngle: 236, bays: [1, 2, 3], color: "#2563eb", price: 1400, gate: "GATE 5 (WEST)", tier: "lower", stand: "West Stand" },
        { id: "blk-dha-w2-l", name: "WEST PINE STAND LOWER W2", shortName: "PINE W2", startAngle: 238, endAngle: 266, bays: [1, 2, 3, 4], color: "#1d4ed8", price: 1400, gate: "GATE 5 (WEST)", tier: "lower", stand: "West Stand" },
        { id: "blk-dha-w3-l", name: "WEST MEDIA STAND LOWER W3", shortName: "MEDIA W3", startAngle: 268, endAngle: 296, bays: [1, 2, 3, 4], color: "#2563eb", price: 1600, gate: "GATE 5 (WEST)", tier: "lower", stand: "West Stand" },
        { id: "blk-dha-w4-l", name: "WEST GALLERY LOWER W4", shortName: "GALLERY W4", startAngle: 298, endAngle: 326, bays: [1, 2, 3, 4], color: "#1d4ed8", price: 1600, gate: "GATE 5 (WEST)", tier: "lower", stand: "West Stand" },
        { id: "blk-dha-n1-l", name: "NORTH VISTA STAND LOWER N1", shortName: "VISTA N1", startAngle: 330, endAngle: 348, bays: [1, 2, 3], color: "#1d4ed8", price: 950, gate: "GATE 2 (NORTH VISTA)", tier: "lower", stand: "North Stand" },
        { id: "blk-dha-n2-l", name: "NORTH HIMALAYAN TERRACE N2", shortName: "SNOW TERRACE N2", startAngle: 350, endAngle: 10, bays: [1, 2, 3, 4], color: "#2563eb", price: 950, gate: "GATE 2 (NORTH VISTA)", tier: "lower", stand: "North Stand" },
        { id: "blk-dha-n3-l", name: "NORTH VISTA STAND LOWER N3", shortName: "VISTA N3", startAngle: 12, endAngle: 30, bays: [1, 2, 3], color: "#1d4ed8", price: 950, gate: "GATE 2 (NORTH VISTA)", tier: "lower", stand: "North Stand" }
      ],
      outerBlocks: [
        { id: "blk-dha-e1-u", name: "DHAULADHAR STAND UPPER E1", shortName: "DHAULADHAR U-E1", startAngle: 34, endAngle: 62, bays: [1, 2, 3, 4], color: "#0284c7", price: 1200, gate: "GATE 3 (EAST)", tier: "upper", stand: "East Stand" },
        { id: "blk-dha-e2-u", name: "DHAULADHAR STAND UPPER E2", shortName: "DHAULADHAR U-E2", startAngle: 64, endAngle: 92, bays: [1, 2, 3, 4], color: "#0369a1", price: 1200, gate: "GATE 3 (EAST)", tier: "upper", stand: "East Stand" },
        { id: "blk-dha-e3-u", name: "EAST VALLEY UPPER E3", shortName: "VALLEY U-E3", startAngle: 94, endAngle: 122, bays: [1, 2, 3, 4], color: "#0284c7", price: 1100, gate: "GATE 3 (EAST)", tier: "upper", stand: "East Stand" },
        { id: "blk-dha-e4-u", name: "EAST VALLEY UPPER E4", shortName: "VALLEY U-E4", startAngle: 124, endAngle: 144, bays: [1, 2, 3], color: "#0369a1", price: 1100, gate: "GATE 3 (EAST)", tier: "upper", stand: "East Stand" },
        { id: "blk-dha-w1-u", name: "WEST PINE UPPER W1", shortName: "PINE U-W1", startAngle: 216, endAngle: 236, bays: [1, 2, 3], color: "#0369a1", price: 1100, gate: "GATE 5 (WEST)", tier: "upper", stand: "West Stand" },
        { id: "blk-dha-w2-u", name: "WEST PINE UPPER W2", shortName: "PINE U-W2", startAngle: 238, endAngle: 266, bays: [1, 2, 3, 4], color: "#0284c7", price: 1100, gate: "GATE 5 (WEST)", tier: "upper", stand: "West Stand" },
        { id: "blk-dha-w3-u", name: "WEST MEDIA UPPER W3", shortName: "MEDIA U-W3", startAngle: 268, endAngle: 296, bays: [1, 2, 3, 4], color: "#0369a1", price: 1200, gate: "GATE 5 (WEST)", tier: "upper", stand: "West Stand" },
        { id: "blk-dha-w4-u", name: "WEST GALLERY UPPER W4", shortName: "GALLERY U-W4", startAngle: 298, endAngle: 326, bays: [1, 2, 3, 4], color: "#0284c7", price: 1200, gate: "GATE 5 (WEST)", tier: "upper", stand: "West Stand" },
        { id: "blk-dha-n1-u", name: "HIMALAYAN SNOW PEAKS UPPER N1", shortName: "SNOW VIEW U-N1", startAngle: 330, endAngle: 348, bays: [1, 2, 3], color: "#0284c7", price: 950, gate: "GATE 2 (NORTH VISTA)", tier: "upper", stand: "North Stand" },
        { id: "blk-dha-n2-u", name: "HIMALAYAN SNOW PEAKS UPPER N2", shortName: "SNOW VIEW U-N2", startAngle: 350, endAngle: 10, bays: [1, 2, 3, 4], color: "#0369a1", price: 950, gate: "GATE 2 (NORTH VISTA)", tier: "upper", stand: "North Stand" },
        { id: "blk-dha-n3-u", name: "HIMALAYAN SNOW PEAKS UPPER N3", shortName: "SNOW VIEW U-N3", startAngle: 12, endAngle: 30, bays: [1, 2, 3], color: "#0284c7", price: 950, gate: "GATE 2 (NORTH VISTA)", tier: "upper", stand: "North Stand" }
      ],
      southHospitality: {
        hasGallery: true,
        startAngle: 146,
        endAngle: 214,
        gallery: {
          name: "HPCA PRESIDENT'S GALLERY & PLAYERS PAVILION",
          rStart: 248,
          rEnd: 286,
          price: 4800,
          gate: "GATE 1 (PAGODA VIP)",
          bays: [
            { id: "dha-1", label: "BAY 1 (EAST WING)", bg: "#1e293b", text: "#f8fafc" },
            { id: "dha-2", label: "BAY 2 (PRESIDENTIAL)", bg: "#b91c1c", text: "#ffffff" },
            { id: "dha-3", label: "BAY 3 (MEMBERS LOUNGE)", bg: "#b91c1c", text: "#ffffff" },
            { id: "dha-4", label: "BAY 4 (WEST WING)", bg: "#1e293b", text: "#f8fafc" }
          ]
        },
        floor4: {
          name: "HIMALAYAN ROYAL PAGODA SUITES (4TH FLOOR)",
          rStart: 290,
          rEnd: 330,
          price: 6500,
          gate: "GATE 1 (PAGODA VIP)",
          suitesCount: 12
        },
        floor5: {
          name: "DHAULADHAR SUMMIT SKY LOUNGE & MEDIA CENTER",
          rStart: 334,
          rEnd: 374,
          price: 7500,
          gate: "GATE 1 (PAGODA VIP)",
          suitesCount: 14
        }
      },
      gates: [
        { id: "gate-1", name: "GATE 1", label: "GATE 1 (Himalayan Pagoda VIP Pavilion)", angle: 180, gateRadius: 395 },
        { id: "gate-2", name: "GATE 2", label: "GATE 2 (North Dhauladhar Snow Vista)", angle: 0, gateRadius: 395 },
        { id: "gate-3", name: "GATE 3", label: "GATE 3 (East Mountain View Stand)", angle: 80, gateRadius: 395 },
        { id: "gate-5", name: "GATE 5", label: "GATE 5 (West Pine Valley Stand)", angle: 260, gateRadius: 395 }
      ],
      dugouts: [
        { id: "dugout-home", name: "HOME TEAM DUGOUT", angle: 160, radius: 142, color: "#1d4ed8" },
        { id: "dugout-away", name: "AWAY TEAM DUGOUT", angle: 200, radius: 142, color: "#dc2626" }
      ]
    },

    // 9. Dr. Y.S.R. ACA-VDCA Stadium, Visakhapatnam
    "vizag-vdca": {
      name: "Dr. Y.S. Rajasekhara Reddy ACA-VDCA Cricket Stadium",
      shortName: "ACA-VDCA Cricket Stadium",
      location: "PM Palem, Visakhapatnam, Andhra Pradesh, India",
      architectureType: "Authentic Coastal Mountain Oval Bowl with Two-Tier Rectangular & Trapezoidal Blue Stands and White Pavilion Canopies (27,500 Capacity)",
      layoutType: "vdca-visakhapatnam-bowl",
      themeBadge: "27,500 Cap. International Cricket Arena • PM Palem, Visakhapatnam",
      highlights: "North Dr. YSR Pavilion & Media Center with White Cantilever Roof, South Main Pavilion & Players Lounge with White Canopy, Rectangular East & West Seating Blocks (E1-E4, W1-W4), Trapezoidal Corner Stands, 6 High-Mast Floodlight Towers, Natural Green Outfield",
      roofStyle: "North & South Cantilever White/Light-Grey Fabric Canopies with Steel Cantilever Frames",
      totalCapacity: 27500,
      ellipseX: 1.05,
      ellipseY: 0.94,
      rField: 130,
      rInnerStart: 152,
      rInnerEnd: 232,
      rOuterStart: 248,
      rOuterEnd: 364,
      lowerColor: "#1d4ed8",
      upperColor: "#3b82f6",
      hasVdcaCanopies: true,
      hasFloodlights: true,
      floodlights: [
        { id: "fl-1", name: "FLOODLIGHT TOWER 1 (NE)", angle: 35, radius: 414 },
        { id: "fl-2", name: "FLOODLIGHT TOWER 2 (EAST)", angle: 90, radius: 420 },
        { id: "fl-3", name: "FLOODLIGHT TOWER 3 (SE)", angle: 145, radius: 414 },
        { id: "fl-4", name: "FLOODLIGHT TOWER 4 (SW)", angle: 215, radius: 414 },
        { id: "fl-5", name: "FLOODLIGHT TOWER 5 (WEST)", angle: 270, radius: 420 },
        { id: "fl-6", name: "FLOODLIGHT TOWER 6 (NW)", angle: 325, radius: 414 }
      ],
      northCanopy: {
        startAngle: 324,
        endAngle: 36,
        rStart: 242,
        rEnd: 376,
        label: "DR. YSR NORTH PAVILION CANOPY"
      },
      southCanopy: {
        startAngle: 150,
        endAngle: 210,
        rStart: 242,
        rEnd: 376,
        label: "SOUTH MAIN PAVILION CANOPY"
      },
      innerBlocks: [
        // East Stand (Rectangular Linear Lower Blocks along straight boundary - Dark Blue / Navy)
        { id: "blk-vdca-l-e1", name: "EAST STAND LOWER - BLOCK E1", shortName: "E1", blockLetter: "E1", stand: "East Stand", standCode: "E", level: "Level 1 - Lower Stand", startAngle: 40, endAngle: 66, bays: [1, 2, 3, 4, 5], color: "#1d4ed8", price: 1500, gate: "GATE 1 (East Concourse - NH-16)", tier: "lower", stadium: "Dr. Y.S. Rajasekhara Reddy ACA-VDCA Cricket Stadium" },
        { id: "blk-vdca-l-e2", name: "EAST STAND LOWER - BLOCK E2", shortName: "E2", blockLetter: "E2", stand: "East Stand", standCode: "E", level: "Level 1 - Lower Stand", startAngle: 68, endAngle: 94, bays: [1, 2, 3, 4, 5], color: "#1e40af", price: 1800, gate: "GATE 1 (East Concourse - NH-16)", tier: "lower", stadium: "Dr. Y.S. Rajasekhara Reddy ACA-VDCA Cricket Stadium" },
        { id: "blk-vdca-l-e3", name: "EAST STAND LOWER - BLOCK E3", shortName: "E3", blockLetter: "E3", stand: "East Stand", standCode: "E", level: "Level 1 - Lower Stand", startAngle: 96, endAngle: 122, bays: [1, 2, 3, 4, 5], color: "#1d4ed8", price: 1800, gate: "GATE 2 (South-East Concourse)", tier: "lower", stadium: "Dr. Y.S. Rajasekhara Reddy ACA-VDCA Cricket Stadium" },
        { id: "blk-vdca-l-e4", name: "EAST STAND LOWER - BLOCK E4", shortName: "E4", blockLetter: "E4", stand: "East Stand", standCode: "E", level: "Level 1 - Lower Stand", startAngle: 124, endAngle: 150, bays: [1, 2, 3, 4, 5], color: "#1e40af", price: 1500, gate: "GATE 2 (South-East Concourse)", tier: "lower", stadium: "Dr. Y.S. Rajasekhara Reddy ACA-VDCA Cricket Stadium" },
        // South Pavilion (Curved Trapezoidal End - Players Dressing Rooms & VIP Lower)
        { id: "blk-vdca-l-s1", name: "SOUTH STAND LOWER - BLOCK S1", shortName: "S1", blockLetter: "S1", stand: "South Pavilion", standCode: "S", level: "Level 1 - Lower Stand", startAngle: 152, endAngle: 168, bays: [1, 2, 3, 4, 5], color: "#1e3a8a", price: 2200, gate: "GATE 3 (South Concourse)", tier: "lower", stadium: "Dr. Y.S. Rajasekhara Reddy ACA-VDCA Cricket Stadium" },
        { id: "blk-vdca-l-vip", name: "SOUTH MAIN PAVILION & PLAYERS DUG-IN", shortName: "VIP PAVILION", blockLetter: "VIP", stand: "South Pavilion", standCode: "S", level: "Level 1 - VIP Players Lounge", startAngle: 170, endAngle: 190, bays: [1, 2, 3, 4], color: "#0f172a", price: 4500, gate: "GATE 3 (VIP & Players Main Gate)", isVip: true, tier: "premium", stadium: "Dr. Y.S. Rajasekhara Reddy ACA-VDCA Cricket Stadium" },
        { id: "blk-vdca-l-s2", name: "SOUTH STAND LOWER - BLOCK S2", shortName: "S2", blockLetter: "S2", stand: "South Pavilion", standCode: "S", level: "Level 1 - Lower Stand", startAngle: 192, endAngle: 208, bays: [1, 2, 3, 4, 5], color: "#1e3a8a", price: 2200, gate: "GATE 4 (South-West Concourse)", tier: "lower", stadium: "Dr. Y.S. Rajasekhara Reddy ACA-VDCA Cricket Stadium" },
        // West Stand (Rectangular Linear Lower Blocks along straight boundary - Dark Blue / Navy)
        { id: "blk-vdca-l-w1", name: "WEST STAND LOWER - BLOCK W1", shortName: "W1", blockLetter: "W1", stand: "West Stand", standCode: "W", level: "Level 1 - Lower Stand", startAngle: 210, endAngle: 236, bays: [1, 2, 3, 4, 5], color: "#1e40af", price: 1500, gate: "GATE 5 (West Concourse - PM Palem Hills)", tier: "lower", stadium: "Dr. Y.S. Rajasekhara Reddy ACA-VDCA Cricket Stadium" },
        { id: "blk-vdca-l-w2", name: "WEST STAND LOWER - BLOCK W2", shortName: "W2", blockLetter: "W2", stand: "West Stand", standCode: "W", level: "Level 1 - Lower Stand", startAngle: 238, endAngle: 264, bays: [1, 2, 3, 4, 5], color: "#1d4ed8", price: 1800, gate: "GATE 5 (West Concourse - PM Palem Hills)", tier: "lower", stadium: "Dr. Y.S. Rajasekhara Reddy ACA-VDCA Cricket Stadium" },
        { id: "blk-vdca-l-w3", name: "WEST STAND LOWER - BLOCK W3", shortName: "W3", blockLetter: "W3", stand: "West Stand", standCode: "W", level: "Level 1 - Lower Stand", startAngle: 266, endAngle: 292, bays: [1, 2, 3, 4, 5], color: "#1e40af", price: 1800, gate: "GATE 6 (North-West Concourse)", tier: "lower", stadium: "Dr. Y.S. Rajasekhara Reddy ACA-VDCA Cricket Stadium" },
        { id: "blk-vdca-l-w4", name: "WEST STAND LOWER - BLOCK W4", shortName: "W4", blockLetter: "W4", stand: "West Stand", standCode: "W", level: "Level 1 - Lower Stand", startAngle: 294, endAngle: 320, bays: [1, 2, 3, 4, 5], color: "#1d4ed8", price: 1500, gate: "GATE 6 (North-West Concourse)", tier: "lower", stadium: "Dr. Y.S. Rajasekhara Reddy ACA-VDCA Cricket Stadium" },
        // North Pavilion (Curved Trapezoidal End - Dr. YSR Pavilion Lower)
        { id: "blk-vdca-l-n1", name: "NORTH PAVILION LOWER - BLOCK N1", shortName: "N1", blockLetter: "N1", stand: "North Pavilion", standCode: "N", level: "Level 1 - Lower Stand", startAngle: 322, endAngle: 342, bays: [1, 2, 3, 4, 5], color: "#1e40af", price: 2000, gate: "GATE 7 (North Main Entry)", tier: "lower", stadium: "Dr. Y.S. Rajasekhara Reddy ACA-VDCA Cricket Stadium" },
        { id: "blk-vdca-l-n2", name: "DR. YSR NORTH CENTRAL LOWER", shortName: "N2", blockLetter: "N2", stand: "North Pavilion", standCode: "N", level: "Level 1 - Lower Stand", startAngle: 344, endAngle: 16, bays: [1, 2, 3, 4, 5], color: "#1e3a8a", price: 2400, gate: "GATE 7 (North Main Entry)", tier: "lower", stadium: "Dr. Y.S. Rajasekhara Reddy ACA-VDCA Cricket Stadium" },
        { id: "blk-vdca-l-n3", name: "NORTH PAVILION LOWER - BLOCK N3", shortName: "N3", blockLetter: "N3", stand: "North Pavilion", standCode: "N", level: "Level 1 - Lower Stand", startAngle: 18, endAngle: 38, bays: [1, 2, 3, 4, 5], color: "#1e40af", price: 2000, gate: "GATE 7 (North Main Entry)", tier: "lower", stadium: "Dr. Y.S. Rajasekhara Reddy ACA-VDCA Cricket Stadium" }
      ],
      outerBlocks: [
        // East Stand Upper (Rectangular Upper Blocks - Royal Blue / Sky Blue)
        { id: "blk-vdca-u-e1", name: "EAST STAND UPPER - BLOCK E1", shortName: "E1", blockLetter: "E1", stand: "East Stand", standCode: "E", level: "Level 2 - Upper Stand", startAngle: 40, endAngle: 66, bays: [1, 2, 3, 4, 5, 6], color: "#2563eb", price: 900, gate: "GATE 1", tier: "upper", stadium: "Dr. Y.S. Rajasekhara Reddy ACA-VDCA Cricket Stadium" },
        { id: "blk-vdca-u-e2", name: "EAST STAND UPPER - BLOCK E2", shortName: "E2", blockLetter: "E2", stand: "East Stand", standCode: "E", level: "Level 2 - Upper Stand", startAngle: 68, endAngle: 94, bays: [1, 2, 3, 4, 5, 6], color: "#3b82f6", price: 1100, gate: "GATE 1", tier: "upper", stadium: "Dr. Y.S. Rajasekhara Reddy ACA-VDCA Cricket Stadium" },
        { id: "blk-vdca-u-e3", name: "EAST STAND UPPER - BLOCK E3", shortName: "E3", blockLetter: "E3", stand: "East Stand", standCode: "E", level: "Level 2 - Upper Stand", startAngle: 96, endAngle: 122, bays: [1, 2, 3, 4, 5, 6], color: "#2563eb", price: 1100, gate: "GATE 2", tier: "upper", stadium: "Dr. Y.S. Rajasekhara Reddy ACA-VDCA Cricket Stadium" },
        { id: "blk-vdca-u-e4", name: "EAST STAND UPPER - BLOCK E4", shortName: "E4", blockLetter: "E4", stand: "East Stand", standCode: "E", level: "Level 2 - Upper Stand", startAngle: 124, endAngle: 150, bays: [1, 2, 3, 4, 5, 6], color: "#3b82f6", price: 900, gate: "GATE 2", tier: "upper", stadium: "Dr. Y.S. Rajasekhara Reddy ACA-VDCA Cricket Stadium" },
        // South Pavilion Upper & Corporate Boxes
        { id: "blk-vdca-u-s1", name: "SOUTH STAND UPPER - BLOCK S1", shortName: "S1", blockLetter: "S1", stand: "South Pavilion", standCode: "S", level: "Level 2 - Upper Stand", startAngle: 152, endAngle: 168, bays: [1, 2, 3, 4, 5, 6], color: "#1d4ed8", price: 1400, gate: "GATE 3", tier: "upper", stadium: "Dr. Y.S. Rajasekhara Reddy ACA-VDCA Cricket Stadium" },
        { id: "blk-vdca-u-vip", name: "SOUTH PAVILION UPPER & PRESIDENTIAL BOX", shortName: "VIP BOX", blockLetter: "VIP", stand: "South Pavilion", standCode: "S", level: "Level 2 - Presidential Suites", startAngle: 170, endAngle: 190, bays: [1, 2, 3, 4, 5], color: "#1e3a8a", price: 3500, gate: "GATE 3 (VIP)", tier: "upper", stadium: "Dr. Y.S. Rajasekhara Reddy ACA-VDCA Cricket Stadium" },
        { id: "blk-vdca-u-s2", name: "SOUTH STAND UPPER - BLOCK S2", shortName: "S2", blockLetter: "S2", stand: "South Pavilion", standCode: "S", level: "Level 2 - Upper Stand", startAngle: 192, endAngle: 208, bays: [1, 2, 3, 4, 5, 6], color: "#1d4ed8", price: 1400, gate: "GATE 4", tier: "upper", stadium: "Dr. Y.S. Rajasekhara Reddy ACA-VDCA Cricket Stadium" },
        // West Stand Upper (Rectangular Upper Blocks - Royal Blue / Sky Blue)
        { id: "blk-vdca-u-w1", name: "WEST STAND UPPER - BLOCK W1", shortName: "W1", blockLetter: "W1", stand: "West Stand", standCode: "W", level: "Level 2 - Upper Stand", startAngle: 210, endAngle: 236, bays: [1, 2, 3, 4, 5, 6], color: "#3b82f6", price: 900, gate: "GATE 5", tier: "upper", stadium: "Dr. Y.S. Rajasekhara Reddy ACA-VDCA Cricket Stadium" },
        { id: "blk-vdca-u-w2", name: "WEST STAND UPPER - BLOCK W2", shortName: "W2", blockLetter: "W2", stand: "West Stand", standCode: "W", level: "Level 2 - Upper Stand", startAngle: 238, endAngle: 264, bays: [1, 2, 3, 4, 5, 6], color: "#2563eb", price: 1100, gate: "GATE 5", tier: "upper", stadium: "Dr. Y.S. Rajasekhara Reddy ACA-VDCA Cricket Stadium" },
        { id: "blk-vdca-u-w3", name: "WEST STAND UPPER - BLOCK W3", shortName: "W3", blockLetter: "W3", stand: "West Stand", standCode: "W", level: "Level 2 - Upper Stand", startAngle: 266, endAngle: 292, bays: [1, 2, 3, 4, 5, 6], color: "#3b82f6", price: 1100, gate: "GATE 6", tier: "upper", stadium: "Dr. Y.S. Rajasekhara Reddy ACA-VDCA Cricket Stadium" },
        { id: "blk-vdca-u-w4", name: "WEST STAND UPPER - BLOCK W4", shortName: "W4", blockLetter: "W4", stand: "West Stand", standCode: "W", level: "Level 2 - Upper Stand", startAngle: 294, endAngle: 320, bays: [1, 2, 3, 4, 5, 6], color: "#2563eb", price: 900, gate: "GATE 6", tier: "upper", stadium: "Dr. Y.S. Rajasekhara Reddy ACA-VDCA Cricket Stadium" },
        // North Pavilion Upper & Media Deck (Royal Blue & Deep Navy Media)
        { id: "blk-vdca-u-n1", name: "NORTH PAVILION UPPER - BLOCK N1", shortName: "N1", blockLetter: "N1", stand: "North Pavilion", standCode: "N", level: "Level 2 - Upper Stand", startAngle: 322, endAngle: 342, bays: [1, 2, 3, 4, 5, 6], color: "#3b82f6", price: 1200, gate: "GATE 7", tier: "upper", stadium: "Dr. Y.S. Rajasekhara Reddy ACA-VDCA Cricket Stadium" },
        { id: "blk-vdca-u-n2", name: "DR. YSR MEDIA BOX & COMMENTARY CENTER", shortName: "MEDIA DECK", blockLetter: "MEDIA", stand: "North Pavilion", standCode: "N", level: "Level 3 - Media & Commentary", startAngle: 344, endAngle: 16, bays: [1, 2, 3, 4, 5], color: "#1e3a8a", price: 2800, gate: "GATE 7 (Media Entry)", tier: "upper", stadium: "Dr. Y.S. Rajasekhara Reddy ACA-VDCA Cricket Stadium" },
        { id: "blk-vdca-u-n3", name: "NORTH PAVILION UPPER - BLOCK N3", shortName: "N3", blockLetter: "N3", stand: "North Pavilion", standCode: "N", level: "Level 2 - Upper Stand", startAngle: 18, endAngle: 38, bays: [1, 2, 3, 4, 5, 6], color: "#3b82f6", price: 1200, gate: "GATE 7", tier: "upper", stadium: "Dr. Y.S. Rajasekhara Reddy ACA-VDCA Cricket Stadium" }
      ],
      southHospitality: {
        hasGallery: true,
        startAngle: 170,
        endAngle: 190,
        gallery: {
          name: "ACA-VDCA PRESIDENTIAL GALLERY (SOUTH PAVILION)",
          rStart: 248,
          rEnd: 286,
          price: 4500,
          gate: "GATE 3 (VIP & Players)",
          bays: [
            { id: "vdca-1", label: "BAY 1", bg: "#1e3a8a", text: "#ffffff" },
            { id: "vdca-2", label: "BAY 2", bg: "#334155", text: "#ffffff" },
            { id: "vdca-3", label: "BAY 3", bg: "#334155", text: "#ffffff" },
            { id: "vdca-4", label: "BAY 4", bg: "#1e3a8a", text: "#ffffff" }
          ]
        },
        floor4: {
          name: "VDCA CORPORATE HOSPITALITY BOXES (LEVEL 3)",
          rStart: 290,
          rEnd: 330,
          price: 6500,
          gate: "GATE 3 (VIP & Players)",
          suitesCount: 14
        },
        floor5: {
          name: "VIZAG COASTAL SKY LOUNGE (LEVEL 4)",
          rStart: 334,
          rEnd: 374,
          price: 7500,
          gate: "GATE 3 (VIP & Players)",
          suitesCount: 16
        }
      },
      gates: [
        { id: "gate-1", name: "GATE 1", label: "GATE 1 (East Stand & Concourse - NH-16)", angle: 90, gateRadius: 395 },
        { id: "gate-2", name: "GATE 2", label: "GATE 2 (South-East Concourse & Parking P2)", angle: 135, gateRadius: 395 },
        { id: "gate-3", name: "GATE 3", label: "GATE 3 (South Main Pavilion - VIP, Players, Media & Presidential)", angle: 180, gateRadius: 395 },
        { id: "gate-4", name: "GATE 4", label: "GATE 4 (South-West Concourse)", angle: 225, gateRadius: 395 },
        { id: "gate-5", name: "GATE 5", label: "GATE 5 (West Stand & PM Palem Concourse)", angle: 270, gateRadius: 395 },
        { id: "gate-6", name: "GATE 6", label: "GATE 6 (North-West Concourse & Parking P1)", angle: 315, gateRadius: 395 },
        { id: "gate-7", name: "GATE 7", label: "GATE 7 (North Dr. YSR Pavilion & Media Center Main Entry)", angle: 0, gateRadius: 395 }
      ],
      dugouts: [
        { id: "dugout-home", name: "HOME TEAM DUGOUT", angle: 160, radius: 144, color: "#2563eb" },
        { id: "dugout-away", name: "AWAY TEAM DUGOUT", angle: 200, radius: 144, color: "#dc2626" }
      ]
    },

    // 10. ACA International Cricket Stadium, Mangalagiri, Andhra Pradesh
    "mangalagiri-aca": {
      name: "ACA International Cricket Stadium",
      shortName: "Mangalagiri Stadium",
      location: "Mangalagiri, Andhra Pradesh",
      architectureType: "Multi-Level Concrete Spectator Gallery Bowl (34,000 Capacity)",
      layoutType: "concrete-gallery-bowl",
      themeBadge: "Modernised 2026 APL Final Venue • Mangalagiri, Andhra Pradesh",
      highlights: "Broad concrete multi-tier spectator galleries, continuous 360° bowl with Blocks A to N, 6 High-Mast Cricket Floodlight Towers, South VIP Pavilion & Presidential Gallery, Natural Green Turf Pitch",
      roofStyle: "Exposed Architectural Concrete Cantilevers & Tier Slabs",
      totalCapacity: 34000,
      ellipseX: 1.02,
      ellipseY: 0.98,
      rField: 132,
      rInnerStart: 154,
      rInnerEnd: 234,
      rOuterStart: 248,
      rOuterEnd: 362,
      lowerColor: "#1e40af", // Dark Navy / Royal Blue
      upperColor: "#38bdf8", // Light Sky Blue / Blue-Grey
      concreteTheme: true,
      hasFloodlights: true,
      floodlights: [
        { id: "fl-1", name: "FLOODLIGHT TOWER 1 (NE)", angle: 30, radius: 408 },
        { id: "fl-2", name: "FLOODLIGHT TOWER 2 (EAST)", angle: 90, radius: 408 },
        { id: "fl-3", name: "FLOODLIGHT TOWER 3 (SE)", angle: 150, radius: 408 },
        { id: "fl-4", name: "FLOODLIGHT TOWER 4 (SW)", angle: 210, radius: 408 },
        { id: "fl-5", name: "FLOODLIGHT TOWER 5 (WEST)", angle: 270, radius: 408 },
        { id: "fl-6", name: "FLOODLIGHT TOWER 6 (NW)", angle: 330, radius: 408 }
      ],
      innerBlocks: [
        { id: "blk-mgl-l-a", name: "LOWER STAND - BLOCK A", shortName: "A", blockLetter: "A", stand: "Lower Stand", level: "Level 1 - Lower Stand", startAngle: 348, endAngle: 12, bays: [1, 2, 3, 4, 5], color: "#1e40af", price: 1500, gate: "GATE 3 (North Main Entry)", tier: "lower", stadium: "ACA International Cricket Stadium" },
        { id: "blk-mgl-l-b", name: "LOWER STAND - BLOCK B", shortName: "B", blockLetter: "B", stand: "Lower Stand", level: "Level 1 - Lower Stand", startAngle: 14, endAngle: 38, bays: [1, 2, 3, 4, 5], color: "#2563eb", price: 1200, gate: "GATE 2 (North-East Entry)", tier: "lower", stadium: "ACA International Cricket Stadium" },
        { id: "blk-mgl-l-c", name: "LOWER STAND - BLOCK C", shortName: "C", blockLetter: "C", stand: "Lower Stand", level: "Level 1 - Lower Stand", startAngle: 40, endAngle: 64, bays: [1, 2, 3, 4, 5], color: "#1d4ed8", price: 1200, gate: "GATE 2 (North-East Entry)", tier: "lower", stadium: "ACA International Cricket Stadium" },
        { id: "blk-mgl-l-d", name: "LOWER STAND - BLOCK D", shortName: "D", blockLetter: "D", stand: "Lower Stand", level: "Level 1 - Lower Stand", startAngle: 66, endAngle: 90, bays: [1, 2, 3, 4, 5], color: "#2563eb", price: 1400, gate: "GATE 1 (East Main Concourse)", tier: "lower", stadium: "ACA International Cricket Stadium" },
        { id: "blk-mgl-l-e", name: "LOWER STAND - BLOCK E", shortName: "E", blockLetter: "E", stand: "Lower Stand", level: "Level 1 - Lower Stand", startAngle: 92, endAngle: 116, bays: [1, 2, 3, 4, 5], color: "#1d4ed8", price: 1400, gate: "GATE 1 (East Main Concourse)", tier: "lower", stadium: "ACA International Cricket Stadium" },
        { id: "blk-mgl-l-f", name: "LOWER STAND - BLOCK F", shortName: "F", blockLetter: "F", stand: "Lower Stand", level: "Level 1 - Lower Stand", startAngle: 118, endAngle: 142, bays: [1, 2, 3, 4, 5], color: "#2563eb", price: 1500, gate: "GATE 6 (South-East Concourse)", tier: "lower", stadium: "ACA International Cricket Stadium" },
        { id: "blk-mgl-l-g", name: "LOWER STAND - BLOCK G", shortName: "G", blockLetter: "G", stand: "Lower Stand", level: "Level 1 - Lower Stand", startAngle: 144, endAngle: 168, bays: [1, 2, 3, 4, 5], color: "#1d4ed8", price: 1800, gate: "GATE 6 (South-East Concourse)", tier: "lower", stadium: "ACA International Cricket Stadium" },
        { id: "blk-mgl-l-h", name: "SOUTH MAIN PAVILION (VIP & PLAYERS)", shortName: "H (VIP)", blockLetter: "H", stand: "South Pavilion", level: "Level 1 - VIP Pavilion", startAngle: 170, endAngle: 190, bays: [1, 2, 3, 4], color: "#ffffff", price: 3800, gate: "GATE 8 (VIP & Players Entry)", isVip: true, tier: "premium", stadium: "ACA International Cricket Stadium" },
        { id: "blk-mgl-l-i", name: "LOWER STAND - BLOCK I", shortName: "I", blockLetter: "I", stand: "Lower Stand", level: "Level 1 - Lower Stand", startAngle: 192, endAngle: 216, bays: [1, 2, 3, 4, 5], color: "#1d4ed8", price: 1800, gate: "GATE 5 (South-West Concourse)", tier: "lower", stadium: "ACA International Cricket Stadium" },
        { id: "blk-mgl-l-j", name: "LOWER STAND - BLOCK J", shortName: "J", blockLetter: "J", stand: "Lower Stand", level: "Level 1 - Lower Stand", startAngle: 218, endAngle: 242, bays: [1, 2, 3, 4, 5], color: "#2563eb", price: 1500, gate: "GATE 5 (South-West Concourse)", tier: "lower", stadium: "ACA International Cricket Stadium" },
        { id: "blk-mgl-l-k", name: "LOWER STAND - BLOCK K", shortName: "K", blockLetter: "K", stand: "Lower Stand", level: "Level 1 - Lower Stand", startAngle: 244, endAngle: 268, bays: [1, 2, 3, 4, 5], color: "#1d4ed8", price: 1400, gate: "GATE 4 (West Main Concourse)", tier: "lower", stadium: "ACA International Cricket Stadium" },
        { id: "blk-mgl-l-l", name: "LOWER STAND - BLOCK L", shortName: "L", blockLetter: "L", stand: "Lower Stand", level: "Level 1 - Lower Stand", startAngle: 270, endAngle: 294, bays: [1, 2, 3, 4, 5], color: "#2563eb", price: 1400, gate: "GATE 4 (West Main Concourse)", tier: "lower", stadium: "ACA International Cricket Stadium" },
        { id: "blk-mgl-l-m", name: "LOWER STAND - BLOCK M", shortName: "M", blockLetter: "M", stand: "Lower Stand", level: "Level 1 - Lower Stand", startAngle: 296, endAngle: 320, bays: [1, 2, 3, 4, 5], color: "#1d4ed8", price: 1200, gate: "GATE 3 (North-West Entry)", tier: "lower", stadium: "ACA International Cricket Stadium" },
        { id: "blk-mgl-l-n", name: "LOWER STAND - BLOCK N", shortName: "N", blockLetter: "N", stand: "Lower Stand", level: "Level 1 - Lower Stand", startAngle: 322, endAngle: 346, bays: [1, 2, 3, 4, 5], color: "#2563eb", price: 1200, gate: "GATE 3 (North-West Entry)", tier: "lower", stadium: "ACA International Cricket Stadium" }
      ],
      outerBlocks: [
        { id: "blk-mgl-u-a", name: "UPPER STAND - BLOCK A", shortName: "A", blockLetter: "A", stand: "Upper Stand", level: "Level 3 - Upper Stand", startAngle: 348, endAngle: 12, bays: [1, 2, 3, 4, 5, 6], color: "#38bdf8", price: 1000, gate: "GATE 3", tier: "upper", stadium: "ACA International Cricket Stadium" },
        { id: "blk-mgl-u-b", name: "UPPER STAND - BLOCK B", shortName: "B", blockLetter: "B", stand: "Upper Stand", level: "Level 3 - Upper Stand", startAngle: 14, endAngle: 38, bays: [1, 2, 3, 4, 5, 6], color: "#60a5fa", price: 800, gate: "GATE 2", tier: "upper", stadium: "ACA International Cricket Stadium" },
        { id: "blk-mgl-u-c", name: "UPPER STAND - BLOCK C", shortName: "C", blockLetter: "C", stand: "Upper Stand", level: "Level 3 - Upper Stand", startAngle: 40, endAngle: 64, bays: [1, 2, 3, 4, 5, 6], color: "#38bdf8", price: 800, gate: "GATE 2", tier: "upper", stadium: "ACA International Cricket Stadium" },
        { id: "blk-mgl-u-d", name: "UPPER STAND - BLOCK D", shortName: "D", blockLetter: "D", stand: "Upper Stand", level: "Level 3 - Upper Stand", startAngle: 66, endAngle: 90, bays: [1, 2, 3, 4, 5, 6], color: "#60a5fa", price: 900, gate: "GATE 1", tier: "upper", stadium: "ACA International Cricket Stadium" },
        { id: "blk-mgl-u-e", name: "UPPER STAND - BLOCK E", shortName: "E", blockLetter: "E", stand: "Upper Stand", level: "Level 3 - Upper Stand", startAngle: 92, endAngle: 116, bays: [1, 2, 3, 4, 5, 6], color: "#38bdf8", price: 900, gate: "GATE 1", tier: "upper", stadium: "ACA International Cricket Stadium" },
        { id: "blk-mgl-u-f", name: "UPPER STAND - BLOCK F", shortName: "F", blockLetter: "F", stand: "Upper Stand", level: "Level 3 - Upper Stand", startAngle: 118, endAngle: 142, bays: [1, 2, 3, 4, 5, 6], color: "#60a5fa", price: 1000, gate: "GATE 6", tier: "upper", stadium: "ACA International Cricket Stadium" },
        { id: "blk-mgl-u-g", name: "UPPER STAND - BLOCK G", shortName: "G", blockLetter: "G", stand: "Upper Stand", level: "Level 3 - Upper Stand", startAngle: 144, endAngle: 168, bays: [1, 2, 3, 4, 5, 6], color: "#38bdf8", price: 1200, gate: "GATE 6", tier: "upper", stadium: "ACA International Cricket Stadium" },
        { id: "blk-mgl-u-h", name: "SOUTH PAVILION UPPER & TERRACE", shortName: "H (UPPER)", blockLetter: "H", stand: "South Pavilion", level: "Level 3 - Pavilion Terrace", startAngle: 170, endAngle: 190, bays: [1, 2, 3, 4, 5], color: "#38bdf8", price: 2200, gate: "GATE 8 (VIP Entry)", tier: "upper", stadium: "ACA International Cricket Stadium" },
        { id: "blk-mgl-u-i", name: "UPPER STAND - BLOCK I", shortName: "I", blockLetter: "I", stand: "Upper Stand", level: "Level 3 - Upper Stand", startAngle: 192, endAngle: 216, bays: [1, 2, 3, 4, 5, 6], color: "#38bdf8", price: 1200, gate: "GATE 5", tier: "upper", stadium: "ACA International Cricket Stadium" },
        { id: "blk-mgl-u-j", name: "UPPER STAND - BLOCK J", shortName: "J", blockLetter: "J", stand: "Upper Stand", level: "Level 3 - Upper Stand", startAngle: 218, endAngle: 242, bays: [1, 2, 3, 4, 5, 6], color: "#60a5fa", price: 1000, gate: "GATE 5", tier: "upper", stadium: "ACA International Cricket Stadium" },
        { id: "blk-mgl-u-k", name: "UPPER STAND - BLOCK K", shortName: "K", blockLetter: "K", stand: "Upper Stand", level: "Level 3 - Upper Stand", startAngle: 244, endAngle: 268, bays: [1, 2, 3, 4, 5, 6], color: "#38bdf8", price: 900, gate: "GATE 4", tier: "upper", stadium: "ACA International Cricket Stadium" },
        { id: "blk-mgl-u-l", name: "UPPER STAND - BLOCK L", shortName: "L", blockLetter: "L", stand: "Upper Stand", level: "Level 3 - Upper Stand", startAngle: 270, endAngle: 294, bays: [1, 2, 3, 4, 5, 6], color: "#60a5fa", price: 900, gate: "GATE 4", tier: "upper", stadium: "ACA International Cricket Stadium" },
        { id: "blk-mgl-u-m", name: "UPPER STAND - BLOCK M", shortName: "M", blockLetter: "M", stand: "Upper Stand", level: "Level 3 - Upper Stand", startAngle: 296, endAngle: 320, bays: [1, 2, 3, 4, 5, 6], color: "#38bdf8", price: 800, gate: "GATE 3", tier: "upper", stadium: "ACA International Cricket Stadium" },
        { id: "blk-mgl-u-n", name: "UPPER STAND - BLOCK N", shortName: "N", blockLetter: "N", stand: "Upper Stand", level: "Level 3 - Upper Stand", startAngle: 322, endAngle: 346, bays: [1, 2, 3, 4, 5, 6], color: "#60a5fa", price: 800, gate: "GATE 3", tier: "upper", stadium: "ACA International Cricket Stadium" }
      ],
      southHospitality: {
        hasGallery: true,
        startAngle: 170,
        endAngle: 190,
        gallery: {
          name: "ACA PRESIDENTIAL GALLERY (SOUTH PAVILION)",
          rStart: 248,
          rEnd: 286,
          price: 4500,
          gate: "GATE 8 (VIP & Players)",
          bays: [
            { id: "mgl-1", label: "BAY 1", bg: "#fce7f3", text: "#9d174d" },
            { id: "mgl-2", label: "BAY 2", bg: "#f1f5f9", text: "#334155" },
            { id: "mgl-3", label: "BAY 3", bg: "#f1f5f9", text: "#334155" },
            { id: "mgl-4", label: "BAY 4", bg: "#fce7f3", text: "#9d174d" }
          ]
        },
        floor4: {
          name: "ACA CORPORATE HOSPITALITY SUITES (LEVEL 3)",
          rStart: 290,
          rEnd: 330,
          price: 6500,
          gate: "GATE 8 (VIP & Players)",
          suitesCount: 14
        },
        floor5: {
          name: "AMARAVATI EXECUTIVE SKY LOUNGE & MEDIA DECK (LEVEL 4)",
          rStart: 334,
          rEnd: 374,
          price: 7500,
          gate: "GATE 8 (VIP & Players)",
          suitesCount: 16
        }
      },
      gates: [
        { id: "gate-1", name: "GATE 1", label: "GATE 1 (East Stand & Concourse - Vijayawada Rd)", angle: 90, gateRadius: 395 },
        { id: "gate-2", name: "GATE 2", label: "GATE 2 (North-East Entry / Blocks B-C)", angle: 35, gateRadius: 395 },
        { id: "gate-3", name: "GATE 3", label: "GATE 3 (North Main Entry / Krishna River Gate)", angle: 0, gateRadius: 395 },
        { id: "gate-4", name: "GATE 4", label: "GATE 4 (West Stand & Concourse - Guntur Bypass)", angle: 270, gateRadius: 395 },
        { id: "gate-5", name: "GATE 5", label: "GATE 5 (South-West Entry & ACA Academy)", angle: 220, gateRadius: 395 },
        { id: "gate-6", name: "GATE 6", label: "GATE 6 (South-East Concourse / Blocks F-G)", angle: 140, gateRadius: 395 },
        { id: "gate-8", name: "GATE 8", label: "GATE 8 (South Main Pavilion - VIP, Players & Media)", angle: 180, gateRadius: 395 }
      ],
      dugouts: [
        { id: "dugout-home", name: "HOME TEAM DUGOUT", angle: 162, radius: 140, color: "#2563eb" },
        { id: "dugout-away", name: "AWAY TEAM DUGOUT", angle: 198, radius: 140, color: "#dc2626" }
      ]
    },

    // 11. BRSABV Ekana Cricket Stadium, Lucknow
    "lko-ekana": {
      name: "Bharat Ratna Shri Atal Bihari Vajpayee Ekana Cricket Stadium",
      shortName: "Ekana Cricket Stadium",
      location: "Lucknow, Uttar Pradesh, India",
      architectureType: "Elongated Modern Oval Bowl with 360° White/Light-Grey Canopy & Multi-Tier Rectangular Blocks (50,000 Capacity)",
      layoutType: "ekana-modern-oval-canopy",
      themeBadge: "50,000 Cap. Modern International Oval • Amar Shaheed Path, Lucknow",
      highlights: "Large Elongated Oval Form, Continuous 360° White/Light-Grey Canopy with Repeated Structural Ribs, Multi-Tier Rectangular & Trapezoidal Blocks, North & South Pavilions, Corporate Boxes, 6 Floodlight Towers, Natural Green Pitch",
      roofStyle: "Continuous White / Light-Grey Segmented Tensile Canopy with Cantilever Steel Support Frames",
      totalCapacity: 50000,
      ellipseX: 1.10,
      ellipseY: 0.92,
      rField: 130,
      rInnerStart: 152,
      rInnerEnd: 230,
      rOuterStart: 246,
      rOuterEnd: 366,
      lowerColor: "#1d4ed8",
      upperColor: "#3b82f6",
      hasEkanaCanopy: true,
      hasFloodlights: true,
      floodlights: [
        { id: "fl-1", name: "FLOODLIGHT TOWER 1 (NE)", angle: 35, radius: 416 },
        { id: "fl-2", name: "FLOODLIGHT TOWER 2 (EAST)", angle: 90, radius: 424 },
        { id: "fl-3", name: "FLOODLIGHT TOWER 3 (SE)", angle: 145, radius: 416 },
        { id: "fl-4", name: "FLOODLIGHT TOWER 4 (SW)", angle: 215, radius: 416 },
        { id: "fl-5", name: "FLOODLIGHT TOWER 5 (WEST)", angle: 270, radius: 424 },
        { id: "fl-6", name: "FLOODLIGHT TOWER 6 (NW)", angle: 325, radius: 416 }
      ],
      innerBlocks: [
        // East Stand (Long Side Linear Rectangular Blocks - Lower Stand Dark Blue)
        { id: "blk-ekn-l-e1", name: "EAST STAND LOWER - BLOCK E1", shortName: "E1", blockLetter: "E1", stand: "East Stand", standCode: "E", level: "Level 1 - Lower Stand", startAngle: 40, endAngle: 66, bays: [1, 2, 3, 4, 5], color: "#1d4ed8", price: 1500, gate: "GATE 1 (East Concourse - Amar Shaheed Path)", tier: "lower", stadium: "Bharat Ratna Shri Atal Bihari Vajpayee Ekana Cricket Stadium" },
        { id: "blk-ekn-l-e2", name: "EAST STAND LOWER - BLOCK E2", shortName: "E2", blockLetter: "E2", stand: "East Stand", standCode: "E", level: "Level 1 - Lower Stand", startAngle: 68, endAngle: 94, bays: [1, 2, 3, 4, 5], color: "#1e40af", price: 1800, gate: "GATE 1 (East Concourse - Amar Shaheed Path)", tier: "lower", stadium: "Bharat Ratna Shri Atal Bihari Vajpayee Ekana Cricket Stadium" },
        { id: "blk-ekn-l-e3", name: "EAST STAND LOWER - BLOCK E3", shortName: "E3", blockLetter: "E3", stand: "East Stand", standCode: "E", level: "Level 1 - Lower Stand", startAngle: 96, endAngle: 122, bays: [1, 2, 3, 4, 5], color: "#1d4ed8", price: 1800, gate: "GATE 2 (East-South Concourse)", tier: "lower", stadium: "Bharat Ratna Shri Atal Bihari Vajpayee Ekana Cricket Stadium" },
        { id: "blk-ekn-l-e4", name: "EAST STAND LOWER - BLOCK E4", shortName: "E4", blockLetter: "E4", stand: "East Stand", standCode: "E", level: "Level 1 - Lower Stand", startAngle: 124, endAngle: 150, bays: [1, 2, 3, 4, 5], color: "#1e40af", price: 1500, gate: "GATE 2 (East-South Concourse)", tier: "lower", stadium: "Bharat Ratna Shri Atal Bihari Vajpayee Ekana Cricket Stadium" },
        // South Pavilion & VIP (Curved Trapezoidal End - Navy & Deep Slate VIP)
        { id: "blk-ekn-l-s1", name: "SOUTH STAND LOWER - BLOCK S1", shortName: "S1", blockLetter: "S1", stand: "South Pavilion", standCode: "S", level: "Level 1 - Lower Stand", startAngle: 152, endAngle: 168, bays: [1, 2, 3, 4, 5], color: "#1e3a8a", price: 2200, gate: "GATE 3 (South Concourse)", tier: "lower", stadium: "Bharat Ratna Shri Atal Bihari Vajpayee Ekana Cricket Stadium" },
        { id: "blk-ekn-l-vip", name: "SOUTH MAIN PAVILION & PLAYERS DUG-IN", shortName: "VIP PAVILION", blockLetter: "VIP", stand: "South Pavilion", standCode: "S", level: "Level 1 - VIP Players Lounge", startAngle: 170, endAngle: 190, bays: [1, 2, 3, 4], color: "#0f172a", price: 4800, gate: "GATE 4 (VIP / Players / Media Gate)", isVip: true, tier: "premium", stadium: "Bharat Ratna Shri Atal Bihari Vajpayee Ekana Cricket Stadium" },
        { id: "blk-ekn-l-s2", name: "SOUTH STAND LOWER - BLOCK S2", shortName: "S2", blockLetter: "S2", stand: "South Pavilion", standCode: "S", level: "Level 1 - Lower Stand", startAngle: 192, endAngle: 208, bays: [1, 2, 3, 4, 5], color: "#1e3a8a", price: 2200, gate: "GATE 3 (South Concourse)", tier: "lower", stadium: "Bharat Ratna Shri Atal Bihari Vajpayee Ekana Cricket Stadium" },
        // West Stand (Long Side Linear Rectangular Blocks - Lower Stand Dark Blue)
        { id: "blk-ekn-l-w1", name: "WEST STAND LOWER - BLOCK W1", shortName: "W1", blockLetter: "W1", stand: "West Stand", standCode: "W", level: "Level 1 - Lower Stand", startAngle: 210, endAngle: 236, bays: [1, 2, 3, 4, 5], color: "#1e40af", price: 1500, gate: "GATE 5 (West Concourse - Sultanpur Rd)", tier: "lower", stadium: "Bharat Ratna Shri Atal Bihari Vajpayee Ekana Cricket Stadium" },
        { id: "blk-ekn-l-w2", name: "WEST STAND LOWER - BLOCK W2", shortName: "W2", blockLetter: "W2", stand: "West Stand", standCode: "W", level: "Level 1 - Lower Stand", startAngle: 238, endAngle: 264, bays: [1, 2, 3, 4, 5], color: "#1d4ed8", price: 1800, gate: "GATE 5 (West Concourse - Sultanpur Rd)", tier: "lower", stadium: "Bharat Ratna Shri Atal Bihari Vajpayee Ekana Cricket Stadium" },
        { id: "blk-ekn-l-w3", name: "WEST STAND LOWER - BLOCK W3", shortName: "W3", blockLetter: "W3", stand: "West Stand", standCode: "W", level: "Level 1 - Lower Stand", startAngle: 266, endAngle: 292, bays: [1, 2, 3, 4, 5], color: "#1e40af", price: 1800, gate: "GATE 6 (West-North Concourse)", tier: "lower", stadium: "Bharat Ratna Shri Atal Bihari Vajpayee Ekana Cricket Stadium" },
        { id: "blk-ekn-l-w4", name: "WEST STAND LOWER - BLOCK W4", shortName: "W4", blockLetter: "W4", stand: "West Stand", standCode: "W", level: "Level 1 - Lower Stand", startAngle: 294, endAngle: 320, bays: [1, 2, 3, 4, 5], color: "#1d4ed8", price: 1500, gate: "GATE 6 (West-North Concourse)", tier: "lower", stadium: "Bharat Ratna Shri Atal Bihari Vajpayee Ekana Cricket Stadium" },
        // North Pavilion (Curved Trapezoidal End - Lower Stand Dark Blue)
        { id: "blk-ekn-l-n1", name: "NORTH PAVILION LOWER - BLOCK N1", shortName: "N1", blockLetter: "N1", stand: "North Pavilion", standCode: "N", level: "Level 1 - Lower Stand", startAngle: 322, endAngle: 342, bays: [1, 2, 3, 4, 5], color: "#1e40af", price: 2000, gate: "GATE 7 (North Main Entry)", tier: "lower", stadium: "Bharat Ratna Shri Atal Bihari Vajpayee Ekana Cricket Stadium" },
        { id: "blk-ekn-l-n2", name: "NORTH PAVILION CENTRAL LOWER", shortName: "N2", blockLetter: "N2", stand: "North Pavilion", standCode: "N", level: "Level 1 - Lower Stand", startAngle: 344, endAngle: 16, bays: [1, 2, 3, 4, 5], color: "#1e3a8a", price: 2500, gate: "GATE 7 (North Main Entry)", tier: "lower", stadium: "Bharat Ratna Shri Atal Bihari Vajpayee Ekana Cricket Stadium" },
        { id: "blk-ekn-l-n3", name: "NORTH PAVILION LOWER - BLOCK N3", shortName: "N3", blockLetter: "N3", stand: "North Pavilion", standCode: "N", level: "Level 1 - Lower Stand", startAngle: 18, endAngle: 38, bays: [1, 2, 3, 4, 5], color: "#1e40af", price: 2000, gate: "GATE 7 (North Main Entry)", tier: "lower", stadium: "Bharat Ratna Shri Atal Bihari Vajpayee Ekana Cricket Stadium" }
      ],
      outerBlocks: [
        // East Stand Upper (Long Side Rectangular Blocks - Upper Stand Royal Blue / Blue-Grey)
        { id: "blk-ekn-u-e1", name: "EAST STAND UPPER - BLOCK E1", shortName: "E1", blockLetter: "E1", stand: "East Stand", standCode: "E", level: "Level 2 - Upper Stand", startAngle: 40, endAngle: 66, bays: [1, 2, 3, 4, 5, 6], color: "#2563eb", price: 900, gate: "GATE 1", tier: "upper", stadium: "Bharat Ratna Shri Atal Bihari Vajpayee Ekana Cricket Stadium" },
        { id: "blk-ekn-u-e2", name: "EAST STAND UPPER - BLOCK E2", shortName: "E2", blockLetter: "E2", stand: "East Stand", standCode: "E", level: "Level 2 - Upper Stand", startAngle: 68, endAngle: 94, bays: [1, 2, 3, 4, 5, 6], color: "#3b82f6", price: 1100, gate: "GATE 1", tier: "upper", stadium: "Bharat Ratna Shri Atal Bihari Vajpayee Ekana Cricket Stadium" },
        { id: "blk-ekn-u-e3", name: "EAST STAND UPPER - BLOCK E3", shortName: "E3", blockLetter: "E3", stand: "East Stand", standCode: "E", level: "Level 2 - Upper Stand", startAngle: 96, endAngle: 122, bays: [1, 2, 3, 4, 5, 6], color: "#2563eb", price: 1100, gate: "GATE 2", tier: "upper", stadium: "Bharat Ratna Shri Atal Bihari Vajpayee Ekana Cricket Stadium" },
        { id: "blk-ekn-u-e4", name: "EAST STAND UPPER - BLOCK E4", shortName: "E4", blockLetter: "E4", stand: "East Stand", standCode: "E", level: "Level 2 - Upper Stand", startAngle: 124, endAngle: 150, bays: [1, 2, 3, 4, 5, 6], color: "#3b82f6", price: 900, gate: "GATE 2", tier: "upper", stadium: "Bharat Ratna Shri Atal Bihari Vajpayee Ekana Cricket Stadium" },
        // South Pavilion Upper & Corporate Boxes (Deep Navy / Royal Blue)
        { id: "blk-ekn-u-s1", name: "SOUTH STAND UPPER - BLOCK S1", shortName: "S1", blockLetter: "S1", stand: "South Pavilion", standCode: "S", level: "Level 2 - Upper Stand", startAngle: 152, endAngle: 168, bays: [1, 2, 3, 4, 5, 6], color: "#1d4ed8", price: 1400, gate: "GATE 3", tier: "upper", stadium: "Bharat Ratna Shri Atal Bihari Vajpayee Ekana Cricket Stadium" },
        { id: "blk-ekn-u-vip", name: "SOUTH PAVILION UPPER & PRESIDENTIAL BOX", shortName: "VIP BOX", blockLetter: "VIP", stand: "South Pavilion", standCode: "S", level: "Level 2 - Presidential Suites", startAngle: 170, endAngle: 190, bays: [1, 2, 3, 4, 5], color: "#1e3a8a", price: 3500, gate: "GATE 4 (VIP)", tier: "upper", stadium: "Bharat Ratna Shri Atal Bihari Vajpayee Ekana Cricket Stadium" },
        { id: "blk-ekn-u-s2", name: "SOUTH STAND UPPER - BLOCK S2", shortName: "S2", blockLetter: "S2", stand: "South Pavilion", standCode: "S", level: "Level 2 - Upper Stand", startAngle: 192, endAngle: 208, bays: [1, 2, 3, 4, 5, 6], color: "#1d4ed8", price: 1400, gate: "GATE 3", tier: "upper", stadium: "Bharat Ratna Shri Atal Bihari Vajpayee Ekana Cricket Stadium" },
        // West Stand Upper (Long Side Rectangular Blocks - Upper Stand Royal Blue / Blue-Grey)
        { id: "blk-ekn-u-w1", name: "WEST STAND UPPER - BLOCK W1", shortName: "W1", blockLetter: "W1", stand: "West Stand", standCode: "W", level: "Level 2 - Upper Stand", startAngle: 210, endAngle: 236, bays: [1, 2, 3, 4, 5, 6], color: "#3b82f6", price: 900, gate: "GATE 5", tier: "upper", stadium: "Bharat Ratna Shri Atal Bihari Vajpayee Ekana Cricket Stadium" },
        { id: "blk-ekn-u-w2", name: "WEST STAND UPPER - BLOCK W2", shortName: "W2", blockLetter: "W2", stand: "West Stand", standCode: "W", level: "Level 2 - Upper Stand", startAngle: 238, endAngle: 264, bays: [1, 2, 3, 4, 5, 6], color: "#2563eb", price: 1100, gate: "GATE 5", tier: "upper", stadium: "Bharat Ratna Shri Atal Bihari Vajpayee Ekana Cricket Stadium" },
        { id: "blk-ekn-u-w3", name: "WEST STAND UPPER - BLOCK W3", shortName: "W3", blockLetter: "W3", stand: "West Stand", standCode: "W", level: "Level 2 - Upper Stand", startAngle: 266, endAngle: 292, bays: [1, 2, 3, 4, 5, 6], color: "#3b82f6", price: 1100, gate: "GATE 6", tier: "upper", stadium: "Bharat Ratna Shri Atal Bihari Vajpayee Ekana Cricket Stadium" },
        { id: "blk-ekn-u-w4", name: "WEST STAND UPPER - BLOCK W4", shortName: "W4", blockLetter: "W4", stand: "West Stand", standCode: "W", level: "Level 2 - Upper Stand", startAngle: 294, endAngle: 320, bays: [1, 2, 3, 4, 5, 6], color: "#2563eb", price: 900, gate: "GATE 6", tier: "upper", stadium: "Bharat Ratna Shri Atal Bihari Vajpayee Ekana Cricket Stadium" },
        // North Pavilion Upper & Media Deck (Royal Blue & Deep Navy Media)
        { id: "blk-ekn-u-n1", name: "NORTH PAVILION UPPER - BLOCK N1", shortName: "N1", blockLetter: "N1", stand: "North Pavilion", standCode: "N", level: "Level 2 - Upper Stand", startAngle: 322, endAngle: 342, bays: [1, 2, 3, 4, 5, 6], color: "#3b82f6", price: 1200, gate: "GATE 7", tier: "upper", stadium: "Bharat Ratna Shri Atal Bihari Vajpayee Ekana Cricket Stadium" },
        { id: "blk-ekn-u-n2", name: "NORTH MEDIA BOX & COMMENTARY CENTER", shortName: "MEDIA DECK", blockLetter: "MEDIA", stand: "North Pavilion", standCode: "N", level: "Level 3 - Media & Commentary", startAngle: 344, endAngle: 16, bays: [1, 2, 3, 4, 5], color: "#1e3a8a", price: 2800, gate: "GATE 7 (Media Entry)", tier: "upper", stadium: "Bharat Ratna Shri Atal Bihari Vajpayee Ekana Cricket Stadium" },
        { id: "blk-ekn-u-n3", name: "NORTH PAVILION UPPER - BLOCK N3", shortName: "N3", blockLetter: "N3", stand: "North Pavilion", standCode: "N", level: "Level 2 - Upper Stand", startAngle: 18, endAngle: 38, bays: [1, 2, 3, 4, 5, 6], color: "#3b82f6", price: 1200, gate: "GATE 7", tier: "upper", stadium: "Bharat Ratna Shri Atal Bihari Vajpayee Ekana Cricket Stadium" }
      ],
      southHospitality: {
        hasGallery: true,
        startAngle: 170,
        endAngle: 190,
        gallery: {
          name: "EKANA PRESIDENTIAL GALLERY (SOUTH PAVILION)",
          rStart: 248,
          rEnd: 286,
          price: 4800,
          gate: "GATE 4 (VIP & Players)",
          bays: [
            { id: "ekn-1", label: "BAY 1", bg: "#1e3a8a", text: "#ffffff" },
            { id: "ekn-2", label: "BAY 2", bg: "#334155", text: "#ffffff" },
            { id: "ekn-3", label: "BAY 3", bg: "#334155", text: "#ffffff" },
            { id: "ekn-4", label: "BAY 4", bg: "#1e3a8a", text: "#ffffff" }
          ]
        },
        floor4: {
          name: "EKANA CORPORATE HOSPITALITY BOXES (LEVEL 3)",
          rStart: 290,
          rEnd: 330,
          price: 6800,
          gate: "GATE 4 (VIP & Players)",
          suitesCount: 16
        },
        floor5: {
          name: "EKANA ROYAL SKY LOUNGE & DIRECTORS DECK (LEVEL 4)",
          rStart: 334,
          rEnd: 374,
          price: 7800,
          gate: "GATE 4 (VIP & Players)",
          suitesCount: 18
        }
      },
      gates: [
        { id: "gate-1", name: "GATE 1", label: "GATE 1 (East Stand Main Concourse - Amar Shaheed Path)", angle: 90, gateRadius: 395 },
        { id: "gate-2", name: "GATE 2", label: "GATE 2 (South-East Concourse & Parking P2)", angle: 135, gateRadius: 395 },
        { id: "gate-3", name: "GATE 3", label: "GATE 3 (South Concourse / General Entry)", angle: 165, gateRadius: 395 },
        { id: "gate-4", name: "GATE 4", label: "GATE 4 (South Main Pavilion - VIP, Players, Media & Presidential)", angle: 180, gateRadius: 395 },
        { id: "gate-5", name: "GATE 5", label: "GATE 5 (West Stand Main Concourse - Sultanpur Road)", angle: 270, gateRadius: 395 },
        { id: "gate-6", name: "GATE 6", label: "GATE 6 (North-West Concourse & Parking P1)", angle: 305, gateRadius: 395 },
        { id: "gate-7", name: "GATE 7", label: "GATE 7 (North Pavilion & Media Center Main Entry)", angle: 0, gateRadius: 395 }
      ],
      dugouts: [
        { id: "dugout-home", name: "HOME TEAM DUGOUT", angle: 162, radius: 138, color: "#2563eb" },
        { id: "dugout-away", name: "AWAY TEAM DUGOUT", angle: 198, radius: 138, color: "#dc2626" }
      ]
    }
  };

  const selectedConfig = configs[stadiumId] || configs["lko-ekana"];

  const allBlocks = [
    ...(selectedConfig.innerBlocks || []),
    ...(selectedConfig.outerBlocks || [])
  ];

  return {
    id: stadiumId,
    name: selectedConfig.name,
    location: selectedConfig.location,
    architectureType: selectedConfig.architectureType,
    layoutType: selectedConfig.layoutType || (stadiumId === "amd-modi" ? "concentric-double-bowl" : "rectangular-block-architecture"),
    themeBadge: selectedConfig.themeBadge,
    highlights: selectedConfig.highlights,
    roofStyle: selectedConfig.roofStyle,
    totalCapacity: selectedConfig.totalCapacity,
    cx,
    cy,
    ellipseX: selectedConfig.ellipseX || 1.0,
    ellipseY: selectedConfig.ellipseY || 0.96,
    rField: selectedConfig.rField || 132,
    rInnerStart: selectedConfig.rInnerStart || 156,
    rInnerEnd: selectedConfig.rInnerEnd || 236,
    rOuterStart: selectedConfig.rOuterStart || 250,
    rOuterEnd: selectedConfig.rOuterEnd || 362,
    radii: {
      rField: selectedConfig.rField || 132,
      rInnerStart: selectedConfig.rInnerStart || 156,
      rInnerEnd: selectedConfig.rInnerEnd || 236,
      rOuterStart: selectedConfig.rOuterStart || 250,
      rOuterEnd: selectedConfig.rOuterEnd || 362
    },
    innerBlocks: selectedConfig.innerBlocks || [],
    outerBlocks: selectedConfig.outerBlocks || [],
    southHospitality: selectedConfig.southHospitality,
    gates: selectedConfig.gates || [],
    floodlights: selectedConfig.floodlights || [],
    hasFloodlights: selectedConfig.hasFloodlights,
    hasModiCanopy: selectedConfig.hasModiCanopy,
    hasYColumns: selectedConfig.hasYColumns,
    hasCirculationRamps: selectedConfig.hasCirculationRamps,
    hasConcourses: selectedConfig.hasConcourses,
    hasEkanaCanopy: selectedConfig.hasEkanaCanopy,
    hasVdcaCanopies: selectedConfig.hasVdcaCanopies,
    hasUppalCanopies: selectedConfig.hasUppalCanopies,
    northCanopy: selectedConfig.northCanopy,
    southCanopy: selectedConfig.southCanopy,
    dugouts: selectedConfig.dugouts || [],
    blocks: allBlocks,
    columns: allBlocks
  };
}

/**
 * Procedural Seat Generator for a Selected Stadium Block/Stand when viewing zoomed-in seat grid
 * Fully populates all rows (A through V) and all bays within the rectangular block
 */
export function generateBlockRowSeats(block, capacity = 100000, selectedBay = "ALL") {
  if (!block) return [];

  const isHospitality = block.isVip || block.tier === "hospitality" || block.name?.includes("CORPORATE") || block.name?.includes("SUITE");
  const isUpper = block.tier === "upper";

  // Rows A to V (up to 20 rows for rich architectural block matrix)
  const rowLabels = isHospitality
    ? ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]
    : ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "P", "Q", "R", "S", "T", "U", "V"];

  const seatsPerBay = isHospitality ? 10 : 10;
  const numBays = isHospitality ? 3 : 4;
  const totalSeatsPerRow = seatsPerBay * numBays; // 40 seats per row for standard, 30 for hospitality

  return rowLabels.map((rLabel, rIdx) => {
    const rowSeats = [];
    
    for (let i = 1; i <= totalSeatsPerRow; i++) {
      const bayNum = Math.ceil(i / seatsPerBay);
      const bayName = `Bay ${bayNum}`;
      
      // Filter if specific bay is selected
      if (selectedBay !== "ALL" && selectedBay !== bayName && selectedBay !== String(bayNum)) {
        continue;
      }

      const seatId = `${block.id}-${rLabel}${i}`;
      const isFrontRow = rIdx === 0;
      const isVip = isHospitality || (isFrontRow && block.tier !== "upper");
      const isPremium = rIdx === 1 || rIdx === 2;
      const isWheelchair = rIdx === 0 && (i === 1 || i === totalSeatsPerRow);

      // Realistic seeded booking distribution
      const isBooked = ((i * 13 + rIdx * 19 + block.name.length * 7) % 7 === 0) || ((i * 3 + rIdx * 5) % 17 === 0);
      const isBlocked = ((i * 7 + rIdx * 11) % 29 === 0);

      let status = "available";
      if (isBooked) status = "booked";
      else if (isBlocked) status = "blocked";

      // Proximity pricing calculation
      const basePrice = block.price || 2000;
      const tierPremium = isFrontRow ? 800 : isPremium ? 400 : rIdx <= 6 ? 200 : 0;
      const seatPrice = basePrice + tierPremium;

      rowSeats.push({
        id: seatId,
        number: i,
        bay: bayName,
        bayNum,
        row: rLabel,
        price: seatPrice,
        status,
        isVip,
        isPremium,
        isWheelchair,
        color: block.color || (block.tier === "upper" ? "#f97316" : "#ea580c"),
        gate: block.gate || "GATE 1",
        category: block.tier === "upper" ? "Upper Tier" : isHospitality ? "Corporate Suite" : "Lower Tier",
        tier: block.tier || (block.category === "Lower Tier" ? "lower" : "lower"),
        blockName: block.name
      });
    }

    return {
      label: rLabel,
      idx: rIdx,
      seats: rowSeats
    };
  });
}

/**
 * Procedural Seat Generator for Concentric Stadium Overview Map
 * Generates exact (x, y) coordinates for all individual physical seats positioned along the elliptical arcs
 */
export function generateConcentricBlockSeats(block, cx, cy, ellipseX, ellipseY, rStart, rEnd) {
  if (!block) return [];

  const isHospitality = block.tier === "hospitality" || block.name?.includes("CORPORATE");
  const isUpper = block.tier === "upper";
  
  // Rows count & seats per row tailored for realistic dense crowd capacity and fast SVG performance
  const radialSpan = rEnd - rStart;
  const innerPad = radialSpan * 0.12;
  const outerPad = radialSpan * 0.12;
  const effectiveSpan = radialSpan - innerPad - outerPad;

  const rowsCount = isHospitality ? 3 : isUpper ? 5 : 5;
  let angleSpan = block.endAngle - block.startAngle;
  if (angleSpan < 0) angleSpan += 360;
  
  // Calculate balanced dense representative seats per row for macro overview
  const avgRadius = (rStart + rEnd) / 2;
  const circumferenceAtAvg = 2 * Math.PI * avgRadius;
  const blockWidthAtAvg = (angleSpan / 360) * circumferenceAtAvg;
  const seatsPerRow = Math.min(16, Math.max(8, Math.floor(blockWidthAtAvg / 5.5)));

  const rowLetters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V"];
  const seats = [];

  const anglePad = angleSpan * 0.05;
  const effectiveAngleSpan = angleSpan - 2 * anglePad;

  for (let r = 0; r < rowsCount; r++) {
    const rowLabel = rowLetters[r] || `R${r + 1}`;
    const rowRadius = rStart + innerPad + (effectiveSpan / Math.max(1, rowsCount - 1)) * r;
    // Front rows have slight premium
    const rowPrice = (block.price || 1500) + (rowsCount - 1 - r) * 100;

    for (let s = 0; s < seatsPerRow; s++) {
      const seatNum = s + 1;
      const angle = (block.startAngle + anglePad) + (effectiveAngleSpan / Math.max(1, seatsPerRow - 1)) * s;
      const pos = polarToElliptical(cx, cy, rowRadius * ellipseX, rowRadius * ellipseY, angle);

      // Deterministic realistic booking pattern
      const nameCode = (block.name || "A").charCodeAt(0) || 65;
      const hash = ((s * 17) + (r * 37) + (nameCode * 11) + (block.startAngle * 3)) % 100;
      const isBooked = hash < 32; // ~32% booked
      const isBlocked = !isBooked && (hash > 92); // ~8% reserved/VIP
      const isVip = block.isVip || (block.tier === "premium") || (r === 0 && block.tier === "lower");

      let status = "available";
      if (isBooked) status = "booked";
      else if (isBlocked) status = "blocked";

      const blockCode = block.blockLetter || block.shortName || block.name?.split(" ").pop()?.replace(/[^a-zA-Z0-9]/g, "") || "A";
      const cleanBlockId = (block.id || "blk").replace(/[^a-zA-Z0-9_-]/g, "");
      const finalSeatId = `${cleanBlockId}-${rowLabel}${seatNum}`;

      seats.push({
        id: finalSeatId,
        seatId: finalSeatId,
        blockId: block.id,
        blockName: block.name,
        blockLetter: blockCode,
        stand: block.stand || (block.tier === "upper" ? "Upper Stand" : block.isVip ? "South Main Pavilion" : "Lower Stand"),
        level: block.level || (block.tier === "upper" ? "Level 2 - Upper Stand" : block.isVip ? "Level 2 - VIP Hospitality" : "Level 1 - Lower Stand"),
        stadium: block.stadium || "Rajiv Gandhi International Cricket Stadium",
        row: rowLabel,
        rowIdx: r,
        rowNumber: r + 1,
        number: seatNum,
        x: Number(pos.x.toFixed(1)),
        y: Number(pos.y.toFixed(1)),
        angle,
        radius: rowRadius,
        price: rowPrice,
        status,
        isVip,
        tier: block.tier || "lower",
        gate: block.gate || "GATE 1",
        category: block.tier === "upper" ? "Upper Stand" : block.isVip ? "VIP Hospitality" : "Lower Stand",
        seatType: block.isVip ? "VIP / Corporate" : block.tier === "upper" ? "Upper Tier Regular" : "Lower Tier Standard",
        color: block.color || (block.tier === "upper" ? "#f97316" : "#ea580c")
      });
    }
  }

  return seats;
}

