import { useRef, useEffect } from "react";
import { Github, Twitter, Linkedin } from "lucide-react";

export default function Person({ id, image, alt, links, openId, setOpenId }) {
  const ref = useRef(null);
  const isOpen = openId === id;

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        if (isOpen) setOpenId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, setOpenId]);

  return (
    <div ref={ref} className="relative h-12">
      {/* Avatar */}
      <button
        onClick={() => setOpenId(isOpen ? null : id)}
        className="focus:outline-none"
      >
        <img
          src={image}
          alt={alt}
          className="w-12 h-12 rounded-full border-2 border-gray-300 dark:border-zinc-700 cursor-pointer"
        />
      </button>

      {/* Tooltip */}
      {isOpen && <PersonTooltip links={links} />}
    </div>
  );
}

function PersonTooltip({ links }) {
  return (
    <div className="absolute left-1/2 -top-11  -translate-x-1/2 flex z-10 gap-2">
      {links.github && (
        <a
          href={links.github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white dark:text-zinc-950 bg-zinc-950 dark:bg-zinc-100 p-2 rounded-full hover:scale-115 transition-all duration-300"
        >
          <Github className="w-5 h-5" />
        </a>
      )}
      {links.twitter && (
        <a
          href={links.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white dark:text-zinc-950 bg-zinc-950 dark:bg-zinc-100 p-2 rounded-full hover:scale-115 transition-all duration-300"
        >
          <Twitter className="w-5 h-5" />
        </a>
      )}
      {links.linkedin && (
        <a
          href={links.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white dark:text-zinc-950 bg-zinc-950 dark:bg-zinc-100 p-2 rounded-full hover:scale-115 transition-all duration-300"
        >
          <Linkedin className="w-5 h-5" />
        </a>
      )}
    </div>
  );
}
