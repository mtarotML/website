import Vignette from "./Vignette";

const projects = [
  {
    title: "CONCOURS DE DESSIN",
    description:
      "Concours de dessin en ligne.\n\nstack : Oracle VM, Git, Docker Compose, Nginx, PostgreSQL, FastAPI.",
    accentColor: "#7AD98D",
    href: "https://martintarot.com/martin-dessin",
  },
  {
    title: "FASHION MNIST",
    description:
      "Exploration du dataset Fashion MNIST.\n\nstack : Heroku, Scikit-Learn, Numpy, Joblib, HTML/CSS",
    accentColor: "#7AD3D9",
    href: "fashionmnist",
  },
];

export default function ProjectGrid() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-[50px]">
      {projects.map((project) => (
          <Vignette
            key={project.title}
            title={project.title}
            description={project.description}
            accentColor={project.accentColor}
            href={project.href}
          />
      ))}
    </div>
  );
}
