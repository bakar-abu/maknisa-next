"use client";

import { EnvironmentVideoSection } from "@/components/home/EnvironmentVideoSection";
import type { EnvironmentVideoContent } from "@/lib/cms/home-page";
import { getVideoUrlIssue } from "@/lib/video-url";

type EnvironmentVideoEditorProps = {
  content: EnvironmentVideoContent;
  onChange: (value: EnvironmentVideoContent) => void;
};

export function EnvironmentVideoEditor({
  content,
  onChange,
}: EnvironmentVideoEditorProps) {
  return (
    <div className="admin-cms-editor admin-cms-editor--launch">
      <div className="admin-cms-editor-pane admin-cms-editor-pane--preview">
        <div className="admin-cms-editor-pane__head">
          <div>
            <span className="admin-cms-editor-pane__badge">Live preview</span>
            <h4>Environment video</h4>
          </div>
        </div>
        <div className="admin-cms-preview admin-cms-preview--launch">
          <div className="home-2025 admin-cms-preview__site">
            <EnvironmentVideoSection content={content} />
          </div>
        </div>
      </div>

      <div className="admin-cms-editor-pane admin-cms-editor-pane--form">
        <div className="admin-cms-editor-pane__head">
          <div>
            <span className="admin-cms-editor-pane__badge admin-cms-editor-pane__badge--muted">
              Editor
            </span>
            <h4>Video & copy</h4>
          </div>
        </div>

        <label className="admin-cms-field">
          <span>Desktop video URL</span>
          <input
            type="text"
            value={content.desktopVideo}
            placeholder="https://…/video.mp4"
            onChange={(event) =>
              onChange({ ...content, desktopVideo: event.target.value })
            }
          />
          {getVideoUrlIssue(content.desktopVideo) ? (
            <p className="admin-cms-error">{getVideoUrlIssue(content.desktopVideo)}</p>
          ) : null}
        </label>
        <label className="admin-cms-field">
          <span>Mobile video URL</span>
          <input
            type="text"
            value={content.mobileVideo}
            placeholder="https://…/video-mobile.mp4"
            onChange={(event) =>
              onChange({ ...content, mobileVideo: event.target.value })
            }
          />
          {getVideoUrlIssue(content.mobileVideo) ? (
            <p className="admin-cms-error">{getVideoUrlIssue(content.mobileVideo)}</p>
          ) : null}
        </label>
        <label className="admin-cms-field">
          <span>Title</span>
          <input
            type="text"
            value={content.title}
            onChange={(event) => onChange({ ...content, title: event.target.value })}
          />
        </label>
        <label className="admin-cms-field">
          <span>Subtitle</span>
          <input
            type="text"
            value={content.subtitle}
            onChange={(event) => onChange({ ...content, subtitle: event.target.value })}
          />
        </label>
        <label className="admin-cms-field">
          <span>CTA link</span>
          <input
            type="text"
            value={content.cta.href}
            onChange={(event) =>
              onChange({ ...content, cta: { ...content.cta, href: event.target.value } })
            }
          />
        </label>
        <label className="admin-cms-field">
          <span>CTA label</span>
          <input
            type="text"
            value={content.cta.label}
            onChange={(event) =>
              onChange({ ...content, cta: { ...content.cta, label: event.target.value } })
            }
          />
        </label>

        <div className="admin-cms-video-form__group">
          <h4>Key phrases</h4>
          {content.keyPhrases.map((phrase, index) => (
            <label key={phrase.className} className="admin-cms-field">
              <span>{phrase.className}</span>
              <input
                type="text"
                value={phrase.text}
                onChange={(event) =>
                  onChange({
                    ...content,
                    keyPhrases: content.keyPhrases.map((entry, entryIndex) =>
                      entryIndex === index
                        ? { ...entry, text: event.target.value }
                        : entry,
                    ),
                  })
                }
              />
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
