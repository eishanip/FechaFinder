import { useEffect, useState } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Calendar } from "./components/ui/calendar";
import { Volume2, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import dayjs from "dayjs";

const availableAudioWords = [
  "abril",
  "agosto",
  "calor",
  "catorce",
  "centígrados",
  "Cero",
  "Cinco",
  "Cincuenta",
  "Cuarenta",
  "Cuatro",
  "de",
  "diciembre",
  "diecinueve",
  "dieciocho",
  "diecisiete",
  "dieciséis",
  "Diez",
  "doce",
  "Domingo",
  "Dos",
  "el",
  "enero",
  "es",
  "Estacion",
  "febrero",
  "fresco",
  "frío",
  "grados",
  "hace",
  "hoy",
  "Invierno",
  "Jueves",
  "julio",
  "junio",
  "la",
  "Lunes",
  "Martes",
  "marzo",
  "mayo",
  "Miercoles",
  "Monzon",
  "Noventa",
  "noviembre",
  "Nueve",
  "Ochenta",
  "Ocho",
  "octubre",
  "once",
  "Primavera",
  "quince",
  "Seis",
  "septiembre",
  "Sesenta",
  "Setenta",
  "Siete",
  "sol",
  "sábado",
  "temperatura",
  "tiempo",
  "trece",
  "Treinta",
  "Tres",
  "Uno",
  "veinte",
  "veinticinco",
  "veinticuatro",
  "veintidós",
  "veintinueve",
  "veintiocho",
  "veintisiete",
  "veintiséis",
  "veintitrés",
  "veintiuno",
  "Verano",
  "viento",
  "Viernes",
  "y",
  "2025",
  "mil",
  "dos",
  "cien",
  "cuatrocientos",
  "doscientos",
  "Estación",
  "fecca",
  "novecientos",
  "ochocientos",
  "quinientos",
  "seiscientos",
  "seleccionada",
  "setecientos",
  "trescientos",
  "fecha",
];

const wordAudios = Object.fromEntries(
  availableAudioWords.map((word) => [word.toLowerCase(), `/audio/${word}.mp3`])
);

const getSeason = (month) => {
  if ([12, 1, 2].includes(month)) return "invierno";
  if ([3, 4, 5].includes(month)) return "primavera";
  if ([6, 7, 8].includes(month)) return "verano";
  return "otono";
};

const playAudio = (words) => {
  const playSequentially = (index) => {
    if (index >= words.length) return;
    const word = words[index]?.toLowerCase();
    const audioSrc = wordAudios[word];
    if (!audioSrc) {
      playSequentially(index + 1);
      return;
    }
    const audio = new Audio(audioSrc);
    audio.play();
    audio.onended = () => playSequentially(index + 1);
  };
  playSequentially(0);
};

const playSingleAudio = (filename) => {
  const audio = new Audio(`/audio/${filename}`);
  audio.play();
};

const numberToWords = (num) => {
  const base = {
    0: "cero",
    1: "uno",
    2: "dos",
    3: "tres",
    4: "cuatro",
    5: "cinco",
    6: "seis",
    7: "siete",
    8: "ocho",
    9: "nueve",
    10: "diez",
    11: "once",
    12: "doce",
    13: "trece",
    14: "catorce",
    15: "quince",
    16: "dieciséis",
    17: "diecisiete",
    18: "dieciocho",
    19: "diecinueve",
    20: "veinte",
    21: "veintiuno",
    22: "veintidós",
    23: "veintitrés",
    24: "veinticuatro",
    25: "veinticinco",
    26: "veintiséis",
    27: "veintisiete",
    28: "veintiocho",
    29: "veintinueve",
    30: "treinta",
    40: "cuarenta",
    50: "cincuenta",
    60: "sesenta",
    70: "setenta",
    80: "ochenta",
    90: "noventa",
  };

  if (num <= 29) {
    return [base[num]];
  } else if (num < 100) {
    const tens = Math.floor(num / 10) * 10;
    const units = num % 10;
    return units === 0 ? [base[tens]] : [base[tens], "y", base[units]];
  } else if (num < 1000) {
    if (num === 100) return ["cien"];
    const hundreds = Math.floor(num / 100);
    const remainder = num % 100;
    let hundredsWord = "";
    switch (hundreds) {
      case 1:
        hundredsWord = remainder === 0 ? "cien" : "ciento";
        break;
      case 2:
        hundredsWord = "doscientos";
        break;
      case 3:
        hundredsWord = "trescientos";
        break;
      case 4:
        hundredsWord = "cuatrocientos";
        break;
      case 5:
        hundredsWord = "quinientos";
        break;
      case 6:
        hundredsWord = "seiscientos";
        break;
      case 7:
        hundredsWord = "setecientos";
        break;
      case 8:
        hundredsWord = "ochocientos";
        break;
      case 9:
        hundredsWord = "novecientos";
        break;
      default:
        hundredsWord = "";
    }
    const remainderWords = remainder === 0 ? [] : numberToWords(remainder);
    return [hundredsWord, ...remainderWords];
  } else if (num < 10000) {
    const thousands = Math.floor(num / 1000);
    const remainder = num % 1000;
    const thousandsWord =
      thousands === 1 ? ["mil"] : [...numberToWords(thousands), "mil"];
    const remainderWords = remainder === 0 ? [] : numberToWords(remainder);
    return [...thousandsWord, ...remainderWords];
  } else {
    return [num.toString()];
  }
};

const Slideshow = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 5;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-full">
      <div className="relative h-96 overflow-hidden rounded-xl">
        {[1, 2, 3, 4, 5].map((num, index) => (
          <motion.div
            key={num}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{
              opacity: currentSlide === index ? 1 : 0,
              zIndex: currentSlide === index ? 10 : 0,
            }}
            transition={{ duration: 0.5 }}
          >
            <img
              src={`/images/p${num}.jpg`}
              alt={`Slide ${num}`}
              className="h-full w-full object-cover"
            />
          </motion.div>
        ))}
      </div>

      <div className="absolute bottom-2 inset-x-0 flex justify-center gap-2">
        {[...Array(totalSlides)].map((_, index) => (
          <button
            key={index}
            className={`h-2 w-2 rounded-full ${
              currentSlide === index ? "bg-white" : "bg-white/50"
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white rounded-full p-1 hover:bg-black/50 transition-colors"
      >
        <ChevronLeft size={20} />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white rounded-full p-1 hover:bg-black/50 transition-colors"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

export default function SpanishProjectSite() {
  const [date, setDate] = useState(new Date());
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      const res = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
      );
      setWeather(res.data.current_weather);
    });
  }, []);

  const spanishDays = {
    Monday: "lunes",
    Tuesday: "martes",
    Wednesday: "miércoles",
    Thursday: "jueves",
    Friday: "viernes",
    Saturday: "sábado",
    Sunday: "domingo",
  };

  const spanishMonths = {
    January: "enero",
    February: "febrero",
    March: "marzo",
    April: "abril",
    May: "mayo",
    June: "junio",
    July: "julio",
    August: "agosto",
    September: "septiembre",
    October: "octubre",
    November: "noviembre",
    December: "diciembre",
  };

  const englishToday = dayjs().format("dddd, MMMM D, YYYY");

  const currentDate = new Date();
  const currentDayOfWeek = dayjs(currentDate).format("dddd");
  const currentMonthOfYear = dayjs(currentDate).format("MMMM");
  const currentDayNumber = parseInt(dayjs(currentDate).format("D"));
  const currentYearNumber = parseInt(dayjs(currentDate).format("YYYY"));

  const translatedCurrentDayOfWeek =
    spanishDays[currentDayOfWeek] || currentDayOfWeek;
  const translatedCurrentMonthOfYear =
    spanishMonths[currentMonthOfYear] || currentMonthOfYear;
  const translatedCurrentDayNumber = numberToWords(currentDayNumber);
  const translatedCurrentYearNumber = numberToWords(currentYearNumber);

  const translatedActualDate = [
    "hoy",
    "es",
    "el",
    translatedCurrentDayOfWeek,
    ...translatedCurrentDayNumber,
    "de",
    translatedCurrentMonthOfYear,
    "de",
    ...translatedCurrentYearNumber,
  ];

  const temperatureText = weather?.temperature?.toFixed(0);
  const temperatureWords = numberToWords(parseInt(temperatureText || "0"));
  const translatedWeather = [
    "la",
    "temperatura",
    "es",
    ...temperatureWords,
    "grados",
    "centígrados",
  ];

  const selectedDayOfWeek = dayjs(date).format("dddd");
  const selectedMonthOfYear = dayjs(date).format("MMMM");
  const selectedDayNumber = parseInt(dayjs(date).format("D"));
  const selectedYearNumber = parseInt(dayjs(date).format("YYYY"));

  const translatedDayOfWeek =
    spanishDays[selectedDayOfWeek] || selectedDayOfWeek;
  const translatedMonthOfYear =
    spanishMonths[selectedMonthOfYear] || selectedMonthOfYear;
  const translatedDayNumber = numberToWords(selectedDayNumber);
  const translatedYearNumber = numberToWords(selectedYearNumber);

  const translatedSelectedDate = [
    "La",
    "fecha",
    "seleccionada",
    "es",
    ...translatedDayNumber,
    "de",
    translatedMonthOfYear,
    "de",
    ...translatedYearNumber,
  ];

  const season = getSeason(dayjs(date).month() + 1);

  const handleHeadingClick = () => {};

  return (
    <div className="relative min-h-screen font-sans">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{
          backgroundImage: "url('https://source.unsplash.com/1600x900/?spain')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-red-500 via-orange-400 to-yellow-400 opacity-60" />

      <div className="relative z-10 p-10">
        <motion.h1
          className="text-4xl font-bold text-center mb-10 text-purple-800 cursor-pointer"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={handleHeadingClick}
        >
          Proyecto en Español: Fecha, Clima y Estación
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="shadow-xl bg-white/80 backdrop-blur rounded-2xl">
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold text-purple-700">
                  Fecha Actual
                </h2>
                <p className="text-lg mt-2">{englishToday}</p>
                <p className="text-lg italic text-pink-700 mt-2">
                  {translatedActualDate.map((word, i) => (
                    <span key={i} className="mr-1">
                      {word}
                    </span>
                  ))}
                </p>
                <Button
                  onClick={() => playAudio(translatedActualDate)}
                  className="mt-3 bg-pink-500 hover:bg-pink-600"
                >
                  <Volume2 className="mr-2" /> Escuchar
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="shadow-xl bg-white/80 backdrop-blur rounded-2xl">
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold text-purple-700">
                  Clima Actual
                </h2>
                {weather ? (
                  <>
                    <p className="text-lg mt-2">{weather.temperature} °C</p>
                    <p className="text-lg italic text-pink-700 mt-2">
                      {translatedWeather.map((word, i) => (
                        <span key={i} className="mr-1">
                          {word}
                        </span>
                      ))}
                    </p>
                    <Button
                      onClick={() => playAudio(translatedWeather)}
                      className="mt-3 bg-pink-500 hover:bg-pink-600"
                    >
                      <Volume2 className="mr-2" /> Escuchar
                    </Button>
                  </>
                ) : (
                  <p className="text-gray-500">Obteniendo clima...</p>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            className="md:col-span-2"
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="shadow-xl bg-white/80 backdrop-blur rounded-2xl">
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold text-purple-700 mb-4">
                  Selecciona una Fecha
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex justify-center">
                      <Calendar
                        value={date}
                        onChange={setDate}
                        className="bg-white rounded-xl shadow-inner"
                      />
                    </div>
                    <div className="mt-6">
                      <p className="text-lg italic text-pink-700">
                        {translatedSelectedDate.map((word, i) => (
                          <span key={i} className="mr-1">
                            {word}
                          </span>
                        ))}
                      </p>
                      <Button
                        onClick={() => playAudio(translatedSelectedDate)}
                        className="mt-3 bg-pink-500 hover:bg-pink-600"
                      >
                        <Volume2 className="mr-2" /> Escuchar
                      </Button>
                      <p className="mt-4 text-lg text-purple-700">
                        Estación:{" "}
                        <span className="italic text-pink-700">
                          {[
                            "la",
                            "estación",
                            "es",
                            season == "primavera" ? "la" : "el",
                            season,
                          ].map((word, i) => (
                            <span key={i} className="mr-1">
                              {word}
                            </span>
                          ))}
                        </span>
                      </p>
                      <Button
                        onClick={() =>
                          playAudio([
                            "la",
                            "estación",
                            "es",
                            season == "primavera" ? "la" : "el",
                            season,
                          ])
                        }
                        className="mt-2 bg-pink-500 hover:bg-pink-600"
                      >
                        <Volume2 className="mr-2" /> Escuchar Estación
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-center">
                    <div className="w-full h-96">
                      <Slideshow />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            className="md:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="shadow-xl bg-white/80 backdrop-blur rounded-2xl">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-purple-800 mb-4 text-center">
                  Project Team
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    {
                      name: "Tanish Maheshwari",
                      id: "22BIT0013",
                      role: "Tech Lead",
                    },
                    {
                      name: "Adheesh Dubey",
                      id: "22BIT0035",
                      role: "Tech Lead",
                    },
                    {
                      name: "Yagya Mohan",
                      id: "22BIT0133",
                      role: "Language specialization",
                    },
                    {
                      name: "Eishani Purohit",
                      id: "22BIT0362",
                      role: "Language specialization",
                    },
                  ].map((member, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      className="bg-gradient-to-br from-red-100 to-yellow-100 rounded-lg p-4 text-center shadow-md"
                    >
                      <p className="font-bold text-lg text-purple-700">
                        {member.name}
                      </p>
                      <p className="text-gray-600">{member.id}</p>
                      <p className="mt-2 text-pink-600 font-medium">
                        {member.role}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
