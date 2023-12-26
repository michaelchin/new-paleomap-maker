import "../styles/global.css";

export const metadata = {
  title: "Reconstruction Tree",
  description: "visualise the reconstruction trees",
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
