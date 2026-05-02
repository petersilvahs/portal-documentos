import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { DocumentoProvider } from "@/context/DocumentoContext";

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Portal de Documentos | Docket",
  description: "Sistema de solicitação de documentos cartorários",
  icons: {
    icon: '/logo 4k.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={openSans.className}>
      <body className="min-h-screen flex flex-col antialiased" style={{ backgroundColor: '#EBF0F5' }}>
        <DocumentoProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </DocumentoProvider>
      </body>
    </html>
  );
}
