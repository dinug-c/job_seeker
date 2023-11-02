import { format } from "date-fns";
import { id } from "date-fns/locale";

const formatRupiah = (angka: number) => {
  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  });
  return formatter.format(angka);
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return format(date, "d MMMM yyyy", { locale: id }); // Menggunakan bahasa Indonesia
};

function calculateAge(birthdate: string) {
  // Ubah string tanggal lahir menjadi objek Date
  const birthdateDate = new Date(birthdate);

  // Dapatkan tanggal hari ini
  const today = new Date();

  // Hitung selisih tahun
  let age = today.getFullYear() - birthdateDate.getFullYear();

  // Periksa apakah ulang tahun sudah terjadi atau belum
  const birthdateThisYear = new Date(
    today.getFullYear(),
    birthdateDate.getMonth(),
    birthdateDate.getDate()
  );
  if (today < birthdateThisYear) {
    age--;
  }

  return age;
}

export { formatRupiah, formatDate, calculateAge };
