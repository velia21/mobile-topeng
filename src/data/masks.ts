
export const quizQuestions = [
  {
    question:
      "Saat menghadapi masalah, apa yang biasanya kamu lakukan?",
    options: [
      { label: "Berpikir tenang sebelum bertindak", value: "bijaksana" },
      { label: "Langsung mengambil tindakan", value: "berani" },
      { label: "Meminta pendapat orang lain", value: "lembut" },
      { label: "Mencari cara kreatif dan menyenangkan", value: "ceria" },
    ],
  },
  {
    question:
      "Apa yang paling penting saat bekerja dalam tim?",
    options: [
      { label: "Mengambil keputusan yang adil", value: "bijaksana" },
      { label: "Berani menghadapi tantangan", value: "berani" },
      { label: "Menjaga hubungan tetap harmonis", value: "lembut" },
      { label: "Membawa energi positif", value: "ceria" },
    ],
  },
  {
    question:
      "Bagaimana teman-teman biasanya mengenal dirimu?",
    options: [
      { label: "Dewasa dan dapat diandalkan", value: "bijaksana" },
      { label: "Tegas dan percaya diri", value: "berani" },
      { label: "Ramah dan perhatian", value: "lembut" },
      { label: "Aktif dan ceria", value: "ceria" },
    ],
  },
  {
    question:
      "Ketika harus mengambil keputusan penting, kamu lebih mengandalkan...",
    options: [
      { label: "Logika dan pertimbangan", value: "bijaksana" },
      { label: "Keberanian dan insting", value: "berani" },
      { label: "Pengalaman serta perasaan", value: "lembut" },
      { label: "Ide spontan dan kreativitas", value: "ceria" },
    ],
  },
  {
    question:
      "Pilih hal yang paling menggambarkan dirimu.",
    options: [
      { label: "Bijak dalam bersikap", value: "bijaksana" },
      { label: "Kuat menghadapi rintangan", value: "berani" },
      { label: "Setia kepada orang terdekat", value: "lembut" },
      { label: "Selalu membawa keceriaan", value: "ceria" },
    ],
  },
];

// Pemetaan hasil kuis.
// Nama topeng dan gambar tetap diambil dari API.
export const characterResults = {
  bijaksana: {
    name: "Panji Asmarabangun",
    tagline: "Bijaksana dan dapat diandalkan",
    description:
      "Kamu merupakan seseorang yang tenang, bijaksana, mampu mempertimbangkan banyak hal, dan dapat menjadi tempat orang lain meminta pendapat.",
    keyword: "panji",
  },

  berani: {
    name: "Klana Sewandana",
    tagline: "Tegas dan penuh semangat",
    description:
      "Kamu merupakan seseorang yang berani mengambil langkah, percaya pada kemampuan diri, dan tidak mudah menyerah saat menghadapi tantangan.",
    keyword: "klana",
  },

  lembut: {
    name: "Gunungsari",
    tagline: "Lembut dan penuh kesetiaan",
    description:
      "Kamu merupakan seseorang yang perhatian, menghargai hubungan, dan selalu berusaha menjaga suasana tetap nyaman bagi orang di sekitarmu.",
    keyword: "gunungsari",
  },

  ceria: {
    name: "Pamindo",
    tagline: "Ceria dan kreatif",
    description:
      "Kamu merupakan seseorang yang membawa energi positif, mudah menemukan ide, dan senang membuat suasana menjadi lebih hidup.",
    keyword: "pamindo",
  },
};

export type QuizType = keyof typeof characterResults;
