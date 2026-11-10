export type Mask = {
  id: string;
  name: string;
  character: string;
  description: string;
  story: string;
  qrValue: string;
  image: string;
  videoUrl: string;
};

export const masks: Mask[] = [
  {
    id: "panji",
    name: "Panji Asmarabangun",
    character: "Bijaksana dan berani",

    description:
      "Panji Asmarabangun merupakan tokoh utama dalam kisah Panji yang dikenal bijaksana, tenang, setia, dan memiliki jiwa kepemimpinan.",

    story:
      "Dalam kisah Panji, Panji Asmarabangun digambarkan sebagai sosok yang setia, berani menghadapi tantangan, dan selalu mengutamakan kebijaksanaan.",

    qrValue: "TOPENG-PANJI",

    image:
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=900",

    videoUrl:
      "https://www.w3schools.com/html/mov_bbb.mp4"
  },

  {
    id: "gunungsari",
    name: "Gunungsari",
    character: "Lembut dan setia",

    description:
      "Gunungsari merupakan tokoh yang memiliki pembawaan lembut, ramah, dan penuh kesetiaan.",

    story:
      "Tokoh Gunungsari hadir dalam cerita Panji dengan karakter yang tenang dan bersahaja.",

    qrValue: "TOPENG-GUNUNGSARI",

    image:
      "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?w=900",

    videoUrl:
      "https://www.w3schools.com/html/mov_bbb.mp4"
  },

  {
    id: "klana",
    name: "Klana Sewandana",
    character: "Tegas dan penuh semangat",

    description:
      "Klana Sewandana digambarkan sebagai tokoh kuat, tegas, dan memiliki semangat besar.",

    story:
      "Karakter Klana mencerminkan keberanian, kekuatan, dan ambisi dalam menghadapi berbagai tantangan.",

    qrValue: "TOPENG-KLANA",

    image:
      "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=900",

    videoUrl:
      "https://www.w3schools.com/html/mov_bbb.mp4"
  },

  {
    id: "pamindo",
    name: "Pamindo",
    character: "Ceria dan kreatif",

    description:
      "Pamindo memiliki karakter yang ceria, dinamis, dan penuh energi.",

    story:
      "Gerak dan ekspresi Pamindo menggambarkan suasana yang hidup serta semangat muda.",

    qrValue: "TOPENG-PAMINDO",

    image:
      "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?w=900",

    videoUrl:
      "https://www.w3schools.com/html/mov_bbb.mp4"
  }
];

export const quizQuestions = [
  {
    question:
      "Saat menghadapi masalah, apa yang biasanya kamu lakukan?",

    options: [
      {
        label: "Berpikir tenang sebelum bertindak",
        value: "bijaksana"
      },
      {
        label: "Langsung mengambil tindakan",
        value: "berani"
      },
      {
        label: "Meminta pendapat orang lain",
        value: "lembut"
      },
      {
        label: "Mencari cara kreatif dan menyenangkan",
        value: "ceria"
      }
    ]
  },

  {
    question:
      "Apa yang paling penting saat bekerja dalam tim?",

    options: [
      {
        label: "Mengambil keputusan yang adil",
        value: "bijaksana"
      },
      {
        label: "Berani menghadapi tantangan",
        value: "berani"
      },
      {
        label: "Menjaga hubungan tetap harmonis",
        value: "lembut"
      },
      {
        label: "Membawa energi positif",
        value: "ceria"
      }
    ]
  },

  {
    question:
      "Bagaimana teman-teman biasanya mengenal dirimu?",

    options: [
      {
        label: "Dewasa dan dapat diandalkan",
        value: "bijaksana"
      },
      {
        label: "Tegas dan percaya diri",
        value: "berani"
      },
      {
        label: "Ramah dan perhatian",
        value: "lembut"
      },
      {
        label: "Aktif dan ceria",
        value: "ceria"
      }
    ]
  },

  {
    question:
      "Ketika harus mengambil keputusan penting, kamu lebih mengandalkan...",

    options: [
      {
        label: "Logika dan pertimbangan",
        value: "bijaksana"
      },
      {
        label: "Keberanian dan insting",
        value: "berani"
      },
      {
        label: "Pengalaman serta perasaan",
        value: "lembut"
      },
      {
        label: "Ide spontan dan kreativitas",
        value: "ceria"
      }
    ]
  },

  {
    question:
      "Pilih hal yang paling menggambarkan dirimu.",

    options: [
      {
        label: "Bijak dalam bersikap",
        value: "bijaksana"
      },
      {
        label: "Kuat menghadapi rintangan",
        value: "berani"
      },
      {
        label: "Setia kepada orang terdekat",
        value: "lembut"
      },
      {
        label: "Selalu membawa keceriaan",
        value: "ceria"
      }
    ]
  }
];

export const characterResults: Record<
  string,
  {
    name: string;
    tagline: string;
    description: string;
    maskId: string;
  }
> = {
  bijaksana: {
    name: "Panji Asmarabangun",
    tagline: "Bijaksana dan dapat diandalkan",

    description:
      "Kamu merupakan seseorang yang tenang, bijaksana, mampu mempertimbangkan banyak hal, dan dapat menjadi tempat orang lain meminta pendapat.",

    maskId: "panji"
  },

  berani: {
    name: "Klana Sewandana",
    tagline: "Tegas dan penuh semangat",

    description:
      "Kamu merupakan seseorang yang berani mengambil langkah, percaya pada kemampuan diri, dan tidak mudah menyerah saat menghadapi tantangan.",

    maskId: "klana"
  },

  lembut: {
    name: "Gunungsari",
    tagline: "Lembut dan penuh kesetiaan",

    description:
      "Kamu merupakan seseorang yang perhatian, menghargai hubungan, dan selalu berusaha menjaga suasana tetap nyaman bagi orang di sekitarmu.",

    maskId: "gunungsari"
  },

  ceria: {
    name: "Pamindo",
    tagline: "Ceria dan kreatif",

    description:
      "Kamu merupakan seseorang yang membawa energi positif, mudah menemukan ide, dan senang membuat suasana menjadi lebih hidup.",

    maskId: "pamindo"
  }
};