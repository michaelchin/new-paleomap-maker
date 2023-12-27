import "./styles/global.css";

import ReactGA from "react-ga4";
ReactGA.initialize("G-VVJ6Y1B96E");

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
