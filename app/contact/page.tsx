import Header from "@/components/Header";

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="flex flex-1 items-center justify-center px-5">
        <a
          href="mailto:martintarot@berkeley.edu"
          className="font-mono text-2xl font-bold text-foreground underline underline-offset-4 transition-opacity hover:opacity-70"
        >
          martintarot@berkeley.edu
        </a>
      </main>
    </>
  );
}
