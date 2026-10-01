// ===== Materie (esclusi religione ed educazione fisica) =====
// from/to = classi in cui la materia compare (0 = 1ª elementare ... 7 = 3ª media)
const SUBJECTS = [
  { id: "italiano",   name: "Italiano",        icon: "📖", color: "#FF5C8A", from: 0, to: 7 },
  { id: "matematica", name: "Matematica",      icon: "🔢", color: "#3D7BFF", from: 0, to: 7 },
  { id: "inglese",    name: "Inglese",         icon: "🌍", color: "#FFA41B", from: 0, to: 7 },
  { id: "storia",     name: "Storia",          icon: "🏰", color: "#A06BFF", from: 0, to: 7 },
  { id: "geografia",  name: "Geografia",       icon: "🗺️", color: "#2FB8B0", from: 0, to: 7 },
  { id: "scienze",    name: "Scienze",         icon: "🔬", color: "#34a847", from: 0, to: 7 },
  { id: "tecnologia", name: "Tecnologia",      icon: "💡", color: "#F2C200", from: 0, to: 7 },
  { id: "arte",       name: "Arte",            icon: "🎨", color: "#FF6B3D", from: 0, to: 7 },
  { id: "musica",     name: "Musica",          icon: "🎵", color: "#E04CC8", from: 0, to: 7 },
  { id: "civica",     name: "Educazione civica", icon: "🤝", color: "#4C9BE8", from: 0, to: 7 },
  { id: "lingua2",    name: "Seconda lingua",  icon: "🗣️", color: "#7A8CFF", from: 5, to: 7 },
  { id: "latino",     name: "Latino",          icon: "🏛️", color: "#C98B4B", from: 6, to: 7 }
];

// Materie che hanno già domande pronte (le altre arrivano nelle ondate successive)
const READY_SUBJECTS = ["matematica", "italiano", "inglese", "storia", "geografia"];

function subjectsForClass(classId) {
  return SUBJECTS.filter(s => classId >= s.from && classId <= s.to);
}
