import { useState, useEffect } from "react";
import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import dayjs from "dayjs";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

function Calculator() {
  const [cenaPaliwa, setCenaPaliwa] = useState(7.13); // cena paliwa w złotych za litr
  const [kategoriaCenowa, setKategoriaCenowa] = useState("Basic"); // kategoria cenowa samochodu
  const [lokalizacja, setLokalizacja] = useState("Warszawa"); // lokalizacja wypożyczalni
  const [bazowaCena, setBazowaCena] = useState(100.0); // bazowa cena wypożyczenia samochodu na dobę
  const [srednieSpalanie, setSrednieSpalanie] = useState(7.5); // średnie spalanie samochodu na 100km
  const [iloscModeli, setIloscModeli] = useState(10); // ilość dostępnych modeli danego samochodu w wypożyczalni

  const [dataPoczatkowa, setDataPoczatkowa] = useState(""); // data rozpoczęcia wypożyczenia
  const [dataKoncowa, setDataKoncowa] = useState(""); // data zakończenia wypożyczenia
  const [lataDoswiadczenia, setLataDoswiadczenia] = useState(0); // lata doswiadczenia kierowcy za kółkiem

  const [kilometry, setKilometry] = useState(0);
  const [kosztPaliwa, setKosztPaliwa] = useState(0);

  const [centredModal, setCentredModal] = useState(false);

  const toggleShow = () => setCentredModal(!centredModal);

  const obliczIloscDni = () => {
    const msWJedenDzien = 86400000; // liczba milisekund w jednym dniu
    const dataPoczatkowaMs = new Date(dataPoczatkowa).getTime(); // czas w milisekundach dla daty rozpoczęcia
    const dataKoncowaMs = new Date(dataKoncowa).getTime(); // czas w milisekundach dla daty zakończenia
    const roznicaCzasu = Math.abs(dataKoncowaMs - dataPoczatkowaMs); // różnica czasu w milisekundach
    const iloscDni = Math.ceil(roznicaCzasu / msWJedenDzien); // ilość dni wypożyczenia
    return iloscDni;
  };

  let mnoznik = 1;
  switch (kategoriaCenowa) {
    case "Basic":
      mnoznik = 1;
      break;
    case "Standard":
      mnoznik = 1.3;
      break;
    case "Medium":
      mnoznik = 1.6;
      break;
    case "Premium":
      mnoznik = 2;
      break;
    default:
      mnoznik = 1;
  }

  let cenaCalkowita = obliczIloscDni() * bazowaCena * mnoznik;

  let mnoznikPrawka = 1;

  if (2023 - lataDoswiadczenia < 5) {
    mnoznikPrawka = 1.2;
  }

  cenaCalkowita = cenaCalkowita * mnoznikPrawka;

  if (iloscModeli < 3) {
    cenaCalkowita *= 1.15;
  }

  const handleKilometersChange = (event) => {
    setKilometry(event.target.value);
  };

  useEffect(() => {
    const kosztPaliwa = (kilometry * srednieSpalanie * cenaPaliwa) / 100;
    setKosztPaliwa(kosztPaliwa);
  }, [kilometry, kosztPaliwa, srednieSpalanie]);

  cenaCalkowita = cenaCalkowita + kosztPaliwa;

  let cenaBrutto = cenaCalkowita * 1.23;
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  return (
    <div className="main_container">
      <h1 className="title">Kalkulator Wynajmu</h1>

      <div className="cal_container">
        <div className="row1">
          <label htmlFor="distance">Liczba kilometrów: </label>
          <Slider
            defaultValue={50}
            aria-label="Default"
            valueLabelDisplay="auto"
            step={100}
            marks
            min={0}
            max={1000}
            onChange={handleKilometersChange}
          />
        </div>

        <div className="row2">
          <TextField
            id="outlined-number"
            label="Rok uzyskania prawa jazdy"
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{ min: 1910 }}
            onChange={(e) => setLataDoswiadczenia(e.target.value)}
          />
        </div>
        <div className="row3">
          <label htmlFor="rental_start">
            Termin wypożyczenia samochodu (od):{" "}
          </label>
          <input
            type="date"
            id="rental_start"
            name="rental_start"
            onChange={(e) => setDataPoczatkowa(e.target.value)}
          />
          <br />
        </div>
        <div className="row4">
          <label htmlFor="rental_end">
            Termin wypożyczenia samochodu (do):{" "}
          </label>
          <input
            type="date"
            id="rental_end"
            name="rental_end"
            onChange={(e) => setDataKoncowa(e.target.value)}
          />
          <br />
        </div>
        <div className="row5">
          {/* <label htmlFor="lokalizacja">Wybierz lokalizację: </label> */}
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="demo-simple-select-helper-label">Miasto</InputLabel>
            <Select
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select-helper"
              value={lokalizacja}
              label="Miasto"
              onChange={(e) => setLokalizacja(e.target.value)}
            >
              <MenuItem value="Warszawa">Warszawa</MenuItem>
              <MenuItem value="Rzeszów">Rzeszów</MenuItem>
              <MenuItem value="Kraków">Kraków</MenuItem>
              <MenuItem value="Poznań">Poznań</MenuItem>
            </Select>
          </FormControl>
        </div>

        <div className="row6">
          {/* <label htmlFor="kategoriaCenowa">Wybierz kategorię cenową samochodu: </label> */}
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="demo-simple-select-helper-label">
              Kategoria
            </InputLabel>
            <Select
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select-helper"
              value={kategoriaCenowa}
              label="kategoria"
              onChange={(e) => setKategoriaCenowa(e.target.value)}
            >
              <MenuItem value="Basic">Basic</MenuItem>
              <MenuItem value="Standard">Standard</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="Premium">Premium</MenuItem>
            </Select>
          </FormControl>
        </div>

        {dataPoczatkowa && dataKoncowa && (
          <div>
            <p>Bazowa cena za dobę: {bazowaCena}</p>
            <p>
              Cena całkowita netto za {obliczIloscDni()} dni:{" "}
              {cenaCalkowita.toFixed(2)} zł
            </p>
            <p>
              Cena całkowita brutto za {obliczIloscDni()} dni:{" "}
              {cenaBrutto.toFixed(2)} zł
            </p>
            <p>Koszt paliwa: {kosztPaliwa.toFixed(2)} zł</p>
            <p>Lokalizacja: {lokalizacja}</p>
          </div>
        )}
        {kategoriaCenowa == "Premium" && 2023 - lataDoswiadczenia < 3 ? (
          <Alert severity="warning">
            "Niestety nie możesz wypożyczyć samochodu z kategorii Premium,
            ponieważ posiadasz prawo jazdy krócej niż 3 lata."
          </Alert>
        ) : (
          <p></p>
        )}
      </div>
    </div>
  );
}
export default Calculator;
