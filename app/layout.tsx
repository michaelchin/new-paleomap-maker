import "./styles/global.css";

export const metadata = {
  title: "Paleomap Maker",
  description: "the new paleomap maker",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
