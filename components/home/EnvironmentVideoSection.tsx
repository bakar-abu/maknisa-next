import { GrowButton } from "@/components/home/shared/GrowButton";
import { environmentVideoSection } from "@/lib/homeSections";
import { mediaUrl } from "@/lib/media";

export function EnvironmentVideoSection() {
  return (
    <section className="sn_video">
      <video
        className="desktop"
        src={mediaUrl(environmentVideoSection.desktopVideo)}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
      />
      <video
        className="mobile"
        src={mediaUrl(environmentVideoSection.mobileVideo)}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
      />
      <div className="claim">
        <h2 className="title h2">{environmentVideoSection.title}</h2>
        <div className="txt">{environmentVideoSection.subtitle}</div>
        <GrowButton
          href={environmentVideoSection.cta.href}
          label={environmentVideoSection.cta.label}
          className="sn_btn_grow _text_light"
        />
      </div>
      {environmentVideoSection.keyPhrases.map((phrase) => (
        <div key={phrase.className} className={`key-phrase ${phrase.className}`}>
          {phrase.text}
        </div>
      ))}
    </section>
  );
}
