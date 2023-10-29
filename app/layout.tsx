import "./globals.css";

export const metadata = {
  title: "Risen Job Seeker",
  description: "The fastest way to apply your dream jobs through the World!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground">
        <main className="flex flex-col items-center min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
