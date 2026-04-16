import type { RepairIconKey } from "./repairLucideIcons";

export type RepairTaxonomyNode = {
  id: string;
  label: string;
  icon: RepairIconKey;
  children?: RepairTaxonomyNode[];
};

/** Leaf selections that need a free-text description before continuing. */
export function requiresManualIssueDetail(node: RepairTaxonomyNode): boolean {
  if (node.children?.length) return false;
  if (node.id.endsWith("-other")) return true;
  if (node.id === "not-listed" || node.id === "multiple") return true;
  return false;
}

/**
 * Leaf ids where at least one photo is required on submit.
 * Keep in sync with backend/src/constants/repairPhotoRules.js
 */
export const REPAIR_LEAVES_REQUIRING_PHOTOS = new Set<string>([
  "tap-leak",
  "drain",
  "seal",
  "ceiling-leak",
  "pipe",
  "damp",
  "kitchen-odour",
  "glass",
  "condensation",
  "tiles",
  "walls",
  "ceilings",
  "roofline",
  "drains",
  "fence",
  "sockets",
  "fuse",
  "condensation-air",
  "rodents",
  "insects",
  "birds",
  "camera",
  "alarm-kit",
  "gas-smell",
  "flood",
  "electrical-burn",
  "glass-hazard",
  "lift-broken",
  "lift-door",
  "not-listed",
  "multiple",
]);

export function requiresRepairPhotos(node: RepairTaxonomyNode): boolean {
  if (node.children?.length) return false;
  return REPAIR_LEAVES_REQUIRING_PHOTOS.has(node.id);
}

/** Top-level categories with 4–5 sub-options. Kitchen → Sink has a third level. */
export const REPAIRS_TAXONOMY: RepairTaxonomyNode[] = [
  {
    id: "bathroom",
    label: "Bathroom & toilet",
    icon: "Bath",
    children: [
      { id: "basin", label: "Basin & taps", icon: "Droplets" },
      { id: "bath", label: "Bath & shower tray", icon: "Bath" },
      { id: "shower", label: "Shower enclosure / door", icon: "Droplets" },
      { id: "wc", label: "WC & flush", icon: "CircleDot" },
      { id: "fan", label: "Extractor fan", icon: "Fan" },
      { id: "mirror", label: "Mirror & cabinet", icon: "Square" },
      { id: "bath-other", label: "Other (bathroom)", icon: "HelpCircle" },
    ],
  },
  {
    id: "kitchen",
    label: "Kitchen",
    icon: "UtensilsCrossed",
    children: [
      {
        id: "sink",
        label: "Sink & plumbing",
        icon: "Droplets",
        children: [
          { id: "tap-leak", label: "Leaking tap", icon: "Droplet" },
          { id: "drain", label: "Blocked drain", icon: "CircleSlash" },
          { id: "seal", label: "Seal & mould", icon: "ShieldAlert" },
          { id: "sink-other", label: "Other (sink)", icon: "HelpCircle" },
        ],
      },
      { id: "appliances", label: "Large appliances", icon: "Microwave" },
      { id: "worktops", label: "Cupboards & worktops", icon: "LayoutGrid" },
      { id: "kitchen-odour", label: "Odour / smell", icon: "Wind" },
      { id: "kitchen-small", label: "Small appliances (kettle, etc.)", icon: "Zap" },
      { id: "kitchen-other", label: "Other (kitchen)", icon: "HelpCircle" },
    ],
  },
  {
    id: "heating",
    label: "Heating & boiler",
    icon: "Flame",
    children: [
      { id: "radiator", label: "Radiator", icon: "Thermometer" },
      { id: "boiler", label: "Boiler", icon: "Flame" },
      { id: "controls", label: "Thermostat & controls", icon: "Gauge" },
      { id: "no-heat", label: "No heating / cold", icon: "Thermometer" },
      { id: "trv", label: "TRVs & valves", icon: "Droplet" },
      { id: "heat-other", label: "Other (heating)", icon: "HelpCircle" },
    ],
  },
  {
    id: "hot-water",
    label: "Hot water",
    icon: "Thermometer",
    children: [
      { id: "hw-none", label: "No hot water", icon: "Droplet" },
      { id: "hw-temp", label: "Temperature / scalding", icon: "Thermometer" },
      { id: "hw-cylinder", label: "Cylinder / tank", icon: "Home" },
      { id: "hw-shower", label: "Electric / power shower", icon: "Zap" },
      { id: "hw-other", label: "Other (hot water)", icon: "HelpCircle" },
    ],
  },
  {
    id: "water",
    label: "Water & leaks",
    icon: "Droplets",
    children: [
      { id: "ceiling-leak", label: "Ceiling / upstairs leak", icon: "CloudRain" },
      { id: "pipe", label: "Pipe leak", icon: "Minus" },
      { id: "damp", label: "Damp & mould", icon: "Waves" },
      { id: "pressure", label: "Low water pressure", icon: "Gauge" },
      { id: "water-other", label: "Other (water)", icon: "HelpCircle" },
    ],
  },
  {
    id: "doors",
    label: "Doors, locks & security",
    icon: "DoorOpen",
    children: [
      { id: "front-door", label: "Front / external door", icon: "DoorClosed" },
      { id: "internal-door", label: "Internal door", icon: "DoorOpen" },
      { id: "locks", label: "Locks & keys", icon: "KeyRound" },
      { id: "intercom", label: "Intercom / entry system", icon: "BellElectric" },
      { id: "garage", label: "Garage door", icon: "Home" },
      { id: "doors-other", label: "Other (doors)", icon: "HelpCircle" },
    ],
  },
  {
    id: "surfaces",
    label: "Walls, floors & ceilings",
    icon: "PaintRoller",
    children: [
      { id: "walls", label: "Walls & plaster", icon: "Square" },
      { id: "floors", label: "Flooring", icon: "Layers" },
      { id: "ceilings", label: "Ceiling", icon: "ArrowUpFromLine" },
      { id: "tiles", label: "Tiles & grout", icon: "LayoutGrid" },
      { id: "surfaces-other", label: "Other (surfaces)", icon: "HelpCircle" },
    ],
  },
  {
    id: "lighting",
    label: "Lighting",
    icon: "Lightbulb",
    children: [
      { id: "fittings", label: "Light fittings", icon: "Lightbulb" },
      { id: "switches", label: "Switches", icon: "ToggleLeft" },
      { id: "external-light", label: "External lighting", icon: "Sun" },
      { id: "emergency-exit", label: "Emergency lighting", icon: "ShieldAlert" },
      { id: "light-other", label: "Other (lighting)", icon: "HelpCircle" },
    ],
  },
  {
    id: "windows",
    label: "Windows",
    icon: "AppWindow",
    children: [
      { id: "glass", label: "Glass & seals", icon: "Square" },
      { id: "frames", label: "Frames & hinges", icon: "Frame" },
      { id: "handles", label: "Handles & locks", icon: "GripHorizontal" },
      { id: "condensation", label: "Condensation", icon: "CloudRain" },
      { id: "windows-other", label: "Other (windows)", icon: "HelpCircle" },
    ],
  },
  {
    id: "exterior",
    label: "Exterior & garden",
    icon: "TreePine",
    children: [
      { id: "roofline", label: "Roofline & gutters", icon: "Home" },
      { id: "garden", label: "Garden & paths", icon: "Trees" },
      { id: "drains", label: "External drains", icon: "CloudRain" },
      { id: "fence", label: "Fencing & gates", icon: "DoorClosed" },
      { id: "exterior-other", label: "Other (exterior)", icon: "HelpCircle" },
    ],
  },
  {
    id: "electric",
    label: "Electricity",
    icon: "Zap",
    children: [
      { id: "sockets", label: "Sockets & tripping", icon: "Plug" },
      { id: "lights-elec", label: "Lights not working", icon: "LightbulbOff" },
      { id: "alarms", label: "Smoke / heat alarms", icon: "BellElectric" },
      { id: "fuse", label: "Fuse board / consumer unit", icon: "Zap" },
      { id: "elec-other", label: "Other (electric)", icon: "HelpCircle" },
    ],
  },
  {
    id: "ventilation",
    label: "Ventilation & air",
    icon: "Wind",
    children: [
      { id: "vents", label: "Air vents & grilles", icon: "Wind" },
      { id: "extract", label: "Extract fans (non-bathroom)", icon: "Fan" },
      { id: "condensation-air", label: "Condensation / airflow", icon: "CloudRain" },
      { id: "vent-other", label: "Other (ventilation)", icon: "HelpCircle" },
    ],
  },
  {
    id: "pests",
    label: "Pests & vermin",
    icon: "Bug",
    children: [
      { id: "rodents", label: "Rodents", icon: "Bug" },
      { id: "insects", label: "Insects", icon: "Bug" },
      { id: "birds", label: "Birds / nesting", icon: "Trees" },
      { id: "pests-other", label: "Other (pests)", icon: "HelpCircle" },
    ],
  },
  {
    id: "internet",
    label: "Internet & TV",
    icon: "Wifi",
    children: [
      { id: "wifi", label: "Wi‑Fi / broadband", icon: "Wifi" },
      { id: "tv", label: "TV / aerial / satellite", icon: "AppWindow" },
      { id: "phone", label: "Phone line / socket", icon: "Plug" },
      { id: "internet-other", label: "Other (connectivity)", icon: "HelpCircle" },
    ],
  },
  {
    id: "noise",
    label: "Noise & disturbance",
    icon: "Volume2",
    children: [
      { id: "neighbour", label: "Neighbour / adjoining", icon: "Volume2" },
      { id: "building", label: "Building / structure noise", icon: "Home" },
      { id: "communal-noise", label: "Communal areas", icon: "Building2" },
      { id: "noise-other", label: "Other (noise)", icon: "HelpCircle" },
    ],
  },
  {
    id: "communal",
    label: "Communal / shared",
    icon: "Building2",
    children: [
      { id: "hall", label: "Hallways & stairs", icon: "Layers" },
      { id: "laundry", label: "Laundry / bike store", icon: "Home" },
      { id: "parking", label: "Parking & barriers", icon: "Square" },
      { id: "communal-other", label: "Other (communal)", icon: "HelpCircle" },
    ],
  },
  {
    id: "lift",
    label: "Lift & access",
    icon: "ArrowUpDown",
    children: [
      { id: "lift-broken", label: "Lift not working", icon: "ArrowUpDown" },
      { id: "lift-door", label: "Lift doors", icon: "DoorClosed" },
      { id: "ramp", label: "Ramp / accessibility", icon: "ArrowUpFromLine" },
      { id: "lift-other", label: "Other (access)", icon: "HelpCircle" },
    ],
  },
  {
    id: "cctv",
    label: "CCTV & security kit",
    icon: "Camera",
    children: [
      { id: "camera", label: "Camera / doorbell cam", icon: "Camera" },
      { id: "alarm-kit", label: "Alarm panel / sensors", icon: "BellElectric" },
      { id: "cctv-other", label: "Other (security kit)", icon: "HelpCircle" },
    ],
  },
  {
    id: "safety",
    label: "Safety & emergency",
    icon: "ShieldAlert",
    children: [
      { id: "gas-smell", label: "Smell gas / suspected leak", icon: "Flame" },
      { id: "flood", label: "Flooding / major leak", icon: "Waves" },
      { id: "electrical-burn", label: "Burning smell / sparks", icon: "Zap" },
      { id: "glass-hazard", label: "Broken glass hazard", icon: "Square" },
      { id: "safety-other", label: "Other (safety)", icon: "HelpCircle" },
    ],
  },
  {
    id: "general",
    label: "General & other",
    icon: "HelpCircle",
    children: [
      { id: "not-listed", label: "Issue not listed", icon: "HelpCircle" },
      { id: "multiple", label: "Multiple issues", icon: "LayoutGrid" },
      { id: "inspection", label: "Inspection follow-up", icon: "Square" },
      { id: "general-other", label: "General enquiry", icon: "CircleDot" },
    ],
  },
];
