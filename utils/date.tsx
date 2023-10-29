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

export { formatRupiah, formatDate };
