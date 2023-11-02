import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function DetailHistory() {
  const [historyApply, setHistoryApply] = useState<Record<string, any>[]>([]);
  const supabase = createClientComponentClient();
  useEffect(() => {
    async function fetchUserData() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { email } = user;

        const { data: penggunaData, error } = await supabase
          .from("pencaker")
          .select("*")
          .eq("email", email);

        if (penggunaData && penggunaData.length > 0) {
          if (penggunaData[0]) {
            const { data, error } = await supabase
              .from("tahapan_apply")
              .select(
                `
                        apply_loker: idapply ( loker: idloker (nama), noktp ),
                        tahapan: idtahapan ( idtahapan, nama ),
                        nilai
                        `
              )
              .eq("noktp", penggunaData[0].noktp);
            console.log(data);
            if (error) {
              console.log(error);
              return;
            }

            setHistoryApply(data || []);
          }
        }
      }
    }
    fetchUserData();
  }, []);
  return (
    <>
      <h2 className="mb-4 text-lg font-medium text-gray-900 dark:text-gray-100">
        Pekerjaan yang anda sukai
      </h2>
      <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg dark:bg-gray-800">
        <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300"
              >
                No
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300"
              >
                Nama
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300"
              >
                Tahapan
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300"
              >
                Ket
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
            {historyApply.map((history, index) => (
              <tr key={history.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-gray-100">
                    {index + 1}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-gray-100">
                    {history.history.apply_loker.loker.nama}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap"></td>
                <td className="px-6 py-4 whitespace-nowrap"></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
