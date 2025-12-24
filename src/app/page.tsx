import RetroHeader from "@/components/RetroHeader";
import Image from "next/image";
import { getAboutSection, getMiniPosts, getSocials } from "@/lib/content";

const SOCIAL_META: Record<
  string,
  { icon: string; hover: string }
> = {
  Discord: { icon: "/assets/socials/discord.png", hover: "hover:text-indigo-400" },
  Steam: { icon: "/assets/socials/steam.png", hover: "hover:text-sky-400" },
  Twitter: { icon: "/assets/socials/twitter.png", hover: "hover:text-cyan-400" },
  Roblox: { icon: "/assets/socials/roblox.png", hover: "hover:text-red-300" },
  NameMC: { icon: "/assets/socials/namemc.png", hover: "hover:text-emerald-300" },
};

function accentToTitleClass(accent: string) {
  switch (accent) {
    case "pink":
      return "text-pink-300";
    case "emerald":
      return "text-emerald-300";
    case "sky":
      return "text-sky-300";
    case "indigo":
      return "text-indigo-300";
    case "cyan":
    default:
      return "text-cyan-300";
  }
}

function formatDateLabel(iso: string) {
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(d);
}

export default async function Home() {
  const [about, socials, posts] = await Promise.all([
    getAboutSection(),
    getSocials(),
    getMiniPosts(),
  ]);

  const aboutHeader = about.header ?? "about me XD";
  const socialsHeader = socials.header ?? "find me here!1!";

  return (
    <div className="min-h-screen relative overflow-hidden font-sans text-white selection:bg-pink-500 selection:text-white">
      <div className="fixed inset-0 -z-10">
        <Image
          src="/assets/bg.png"
          fill
          alt="Background"
          className="object-cover"
          priority
          quality={100}
        />
      </div>

      <main className="min-h-screen flex items-center justify-center p-4 py-8 relative z-10">
        <div className="relative w-full max-w-5xl aspect-[4/3] md:aspect-[16/10] flex items-center justify-center">
          <div className="absolute inset-0 pointer-events-none select-none">
            <Image
              src="/assets/frame.png"
              alt="Content Frame"
              fill
              className="object-fill"
              priority
            />
          </div>

          <div className="pointer-events-none select-none">
            {/* SONIC */}
            <div className="absolute z-30 hidden md:block -top-10 -right-10 w-24 h-24 lg:w-32 lg:h-32">
              <Image
                src="/assets/sonic_decoration.gif"
                alt="Sonic Decoration"
                fill
                className="object-contain"
                unoptimized
              />
            </div>

            {/* ANGEL */}
            <div className="absolute z-30 hidden md:block -bottom-12 -right-20 w-56 h-56 lg:w-72 lg:h-72">
              <Image
                src="/assets/angel_decoration.gif"
                alt="Angel Decoration"
                fill
                className="object-contain"
                unoptimized
              />
            </div>

            {/* MOBILE/TABLET */}
            <div className="absolute z-30 md:hidden top-2 right-2 w-16 h-16">
              <Image
                src="/assets/sonic_decoration.gif"
                alt="Sonic Decoration"
                fill
                className="object-contain"
                unoptimized
              />
            </div>

            <div className="absolute z-30 md:hidden bottom-2 right-2 w-40 h-40">
              <Image
                src="/assets/angel_decoration.gif"
                alt="Angel Decoration"
                fill
                className="object-contain"
                unoptimized
              />
            </div>
          </div>

          <div className="absolute left-0 -top-9 md:-top-12 z-40 w-40 h-14 md:w-56 md:h-[72px] hover:scale-105 transition-transform duration-300 pointer-events-none select-none">
            <Image
              src="/assets/noirediego.png"
              alt="noirediego"
              fill
              className="object-contain object-left"
              priority
            />
          </div>

          <div className="relative w-full h-full p-10 md:p-16 lg:p-20">
            <div className="grid h-full grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 md:grid-rows-[1fr,1fr]">
              {/* ABOUT */}
              <section className="flex flex-col min-h-0 group">
                <RetroHeader text={aboutHeader} size="md" />
                <div className="retro-scroll min-h-0 flex-1 -mt-1 md:-mt-2 bg-black/40 backdrop-blur-sm px-5 py-4 text-sm md:text-base overflow-y-auto rounded-none border-2 border-black ring-1 ring-inset ring-blue-600 shadow-lg">
                  <h2 className="sr-only">About Me</h2>
                  <div
                    className="md-content leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: about.html }}
                  />
                </div>
              </section>

              {/* SOCIALS */}
              <section className="flex flex-col min-h-0 group">
                <RetroHeader text={socialsHeader} size="md" />
                <div className="retro-scroll min-h-0 flex-1 -mt-1 md:-mt-2 bg-black/40 backdrop-blur-sm px-5 py-4 text-sm md:text-base overflow-y-auto rounded-none border-2 border-black ring-1 ring-inset ring-blue-600 shadow-lg">
                  <h2 className="sr-only">Find Me</h2>
                  <ul className="space-y-3">
                    {socials.items.map((s) => {
                      const meta = SOCIAL_META[s.label] ?? {
                        icon: "/assets/socials/discord.png",
                        hover: "hover:text-cyan-300",
                      };

                      return (
                        <li key={s.label}>
                          <a
                            href={s.href}
                            target="_blank"
                            rel="noreferrer"
                            className={`flex items-center gap-3 transition-colors ${meta.hover}`}
                          >
                            <span className="relative w-5 h-5 shrink-0">
                              <Image
                                src={meta.icon}
                                alt={`${s.label} icon`}
                                fill
                                className="object-contain"
                                sizes="20px"
                              />
                            </span>
                            <span>{s.label}</span>
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </section>

              {/* MINI BLOG */}
              <section className="md:col-span-2 min-h-0 group">
                <div className="min-h-0 flex h-full flex-col w-[92%] md:w-[68%] lg:w-[62%]">
                  <RetroHeader text="mini blog :3" size="md" />
                  <div className="retro-scroll min-h-0 flex-1 -mt-1 md:-mt-2 bg-black/40 backdrop-blur-sm px-5 py-4 text-sm md:text-base overflow-y-auto rounded-none border-2 border-black ring-1 ring-inset ring-blue-600 shadow-lg">
                    <h2 className="sr-only">Mini Blog</h2>

                    <div className="space-y-6">
                      {posts.map((p) => (
                        <article
                          key={`${p.date}-${p.title}`}
                          className="border-b border-white/10 pb-4 last:border-0 last:pb-0"
                        >
                          <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                            <span>{formatDateLabel(p.date)}</span>
                            <span>•</span>
                            <span>{p.type}</span>
                          </div>

                          <h3 className={`font-bold text-lg mb-2 ${accentToTitleClass(p.accent)}`}>
                            {p.title}
                          </h3>

                          <div
                            className="md-content text-gray-200 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: p.bodyHtml }}
                          />
                        </article>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
