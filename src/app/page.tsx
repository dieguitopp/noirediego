import RetroHeader from "@/components/RetroHeader";
import Image from "next/image";
import { getAboutSection, getMiniPosts, getSocials } from "@/lib/content";
import StickersLayer from "@/components/StickersLayer";

const SOCIAL_META: Record<string, { icon: string; hover: string }> = {
  Discord: { icon: "/assets/socials/discord.png", hover: "hover:text-white" },
  Steam: { icon: "/assets/socials/steam.png", hover: "hover:text-white" },
  Twitter: { icon: "/assets/socials/twitter.png", hover: "hover:text-white" },
  Roblox: { icon: "/assets/socials/roblox.png", hover: "hover:text-white" },
  NameMC: { icon: "/assets/socials/namemc.png", hover: "hover:text-white" },
};

function accentToTitleClass(accent: string) {
  switch (accent) {
    case "indigo":
      return "text-white/85";
    case "sky":
    case "emerald":
      return "text-white/90";
    case "pink":
    case "cyan":
    default:
      return "text-white";
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

const CARD_CLASS =
  "retro-scroll min-h-[220px] sm:min-h-[240px] md:min-h-0 flex-1 -mt-1 md:-mt-2 " +
  "bg-black/55 backdrop-blur-md " +
  "px-5 py-4 text-sm md:text-base overflow-y-auto " +
  "border border-white/15 " +
  "ring-1 ring-inset ring-white/10 " +
  "shadow-[0_0_0_1px_rgba(0,0,0,0.6),0_18px_30px_rgba(0,0,0,0.55)]";

const FRAME_SAFE_TOP = "pt-[100px] sm:pt-[100px] md:pt-[40px] lg:pt-[48px]";

export default async function Home() {
  const [about, socials, posts] = await Promise.all([
    getAboutSection(),
    getSocials(),
    getMiniPosts(),
  ]);

  const aboutHeader = about.header ?? "about me XD";
  const socialsHeader = socials.header ?? "find me here!1!";

  return (
    <div className="min-h-screen relative overflow-hidden font-sans text-white selection:bg-white selection:text-black">
      {/* BG */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/assets/background.png"
          fill
          alt="Background"
          className="object-cover"
          priority
          quality={100}
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* NAME + SUBTITLE (igual que tu version) */}
      <div className="absolute top-6 md:top-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none">
        <div className="relative w-[260px] md:w-[360px] lg:w-[420px]">
          <Image
            src="/assets/name.png"
            alt="Name"
            width={420}
            height={120}
            priority
            className="w-full h-auto select-none"
          />
        </div>

        <div className="relative w-[220px] md:w-[300px] lg:w-[340px]">
          <Image
            src="/assets/subtitle.png"
            alt="Subtitle"
            width={340}
            height={60}
            className="w-full h-auto opacity-90 select-none"
          />
        </div>
      </div>

      <main className="min-h-screen flex items-center justify-center p-4 relative z-10">
        <div
          className="
            relative w-full max-w-5xl
            flex items-stretch justify-center
            min-h-[82vh] sm:min-h-[78vh]
            md:aspect-[16/10] md:min-h-0
          "
        >
          <StickersLayer />

          <div
            className={`relative w-full h-full p-6 sm:p-8 md:p-14 lg:p-16 ${FRAME_SAFE_TOP}`}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8 md:h-full md:grid-rows-[1fr,1fr] auto-rows-auto">
              {/* ABOUT */}
              <section className="flex flex-col min-h-0 group md:h-full">
                <RetroHeader text={aboutHeader} size="sm" />
                <div className={CARD_CLASS}>
                  <h2 className="sr-only">About Me</h2>
                  <div
                    className="md-content leading-relaxed text-white/90"
                    dangerouslySetInnerHTML={{ __html: about.html }}
                  />
                </div>
              </section>

              {/* SOCIALS */}
              <section className="flex flex-col min-h-0 group md:h-full">
                <RetroHeader text={socialsHeader} size="sm" />
                <div className={CARD_CLASS}>
                  <h2 className="sr-only">Find Me</h2>
                  <ul className="space-y-3">
                    {socials.items.map((s) => {
                      const meta = SOCIAL_META[s.label] ?? {
                        icon: "/assets/socials/discord.png",
                        hover: "hover:text-white",
                      };

                      return (
                        <li key={s.label}>
                          <a
                            href={s.href}
                            target="_blank"
                            rel="noreferrer"
                            className={`flex items-center gap-3 text-white/80 transition-colors ${meta.hover}`}
                          >
                            <span className="relative w-5 h-5 shrink-0 opacity-90">
                              <Image
                                src={meta.icon}
                                alt={`${s.label} icon`}
                                fill
                                className="object-contain"
                                sizes="20px"
                              />
                            </span>
                            <span className="tracking-wide">{s.label}</span>
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </section>

              {/* MINI BLOG */}
              <section className="md:col-span-2 min-h-0 group md:h-full">
                <div className="min-h-0 flex flex-col w-full md:w-[70%] lg:w-[64%] mx-auto md:h-full">
                  <RetroHeader text="mini blog :3" size="sm" />
                  <div className={CARD_CLASS}>
                    <h2 className="sr-only">Mini Blog</h2>

                    <div className="space-y-6">
                      {posts.map((p) => (
                        <article
                          key={`${p.date}-${p.title}`}
                          className="border-b border-white/10 pb-4 last:border-0 last:pb-0"
                        >
                          <div className="flex items-center gap-2 text-xs text-white/55 mb-2">
                            <span>{formatDateLabel(p.date)}</span>
                            <span>•</span>
                            <span className="uppercase tracking-wider">
                              {p.type}
                            </span>
                          </div>

                          <h3
                            className={`font-bold text-lg md:text-xl mb-2 ${accentToTitleClass(
                              p.accent
                            )}`}
                          >
                            {p.title}
                          </h3>

                          <div
                            className="md-content text-white/85 leading-relaxed"
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
