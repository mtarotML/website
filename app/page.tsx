import Header from "@/components/Header";
import ProjectGrid from "@/components/ProjectGrid";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex flex-1 items-center justify-center px-5">
        <ProjectGrid />
      </main>
    </>
  );
}
