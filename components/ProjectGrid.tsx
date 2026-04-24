import Vignette from "./Vignette";

const projects = [
  {
    title: "TRUELINK",
    description:
      "MVP Application de rencontre.\n\nstack : Frontend, Backend, PyTorch, Auth, Database, Cursor, vibe-coding.",
    accentColor: "#E91F87",
    href: "https://truelink.fit",
  },
  {
    title: "CONCOURS DE DESSIN",
    description:
      "Concours de dessin en ligne.\n\nstack : Oracle VM, Git, Docker Compose, Nginx, PostgreSQL, FastAPI.",
    accentColor: "#7AD98D",
    href: "/martin-dessin",
  },
  {
    title: "FASHION MNIST",
    description:
      "Exploration du dataset Fashion MNIST.\n\nstack : Heroku, Scikit-Learn, Numpy, Joblib, HTML/CSS",
    accentColor: "#7AD3D9",
    href: "/fashion-mnist",
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
