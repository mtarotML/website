const socials = [
  {
    name: "GitHub",
    href: "https://github.com/mtarotml",
    icon: "/icons/github.svg",
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/in/martintarot",
    icon: "/icons/linkedin.svg",
  },
];

export default function Socials() {
  return (
    <div className="flex w-auto items-center justify-end gap-[5px] md:w-[217px]">
      {socials.map((social) => (
        <a
          key={social.name}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={social.name}
          className="flex h-7 w-7 items-center justify-center transition-opacity hover:opacity-70"
        >
          <img
            src={social.icon}
            alt={social.name}
            width={32}
            height={32}
            className="h-8 w-8"
          />
        </a>
      ))}
    </div>
  );
}
