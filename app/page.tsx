import Header from "@/components/Header";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import AuthButton from "../components/AuthButton";
import CardJob from "@/components/CardJob";

export default async function Index() {
  const cookieStore = cookies();

  const canInitSupabaseClient = () => {
    try {
      createClient(cookieStore);
      return true;
    } catch (e) {
      return false;
    }
  };

  const isSupabaseConnected = canInitSupabaseClient();

  return (
    <div className="flex flex-col items-center flex-1 w-full gap-20">
      <nav className="flex justify-center w-full h-16 border-b border-b-foreground/10">
        <div className="flex items-center justify-between w-full max-w-4xl p-3 text-sm">
          {isSupabaseConnected && <AuthButton />}
        </div>
      </nav>

      <div className="flex flex-col flex-1 max-w-4xl gap-20 px-3 opacity-0 animate-in">
        <Header />
        <CardJob />
      </div>

      <footer className="flex justify-center w-full p-8 text-xs text-center border-t border-t-foreground/10">
        <p>Built For Web Project PBP</p>
      </footer>
    </div>
  );
}
