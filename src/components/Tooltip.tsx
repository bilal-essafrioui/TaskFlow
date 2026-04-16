import { useEffect, useLayoutEffect, useRef, useState } from "react";

interface Position {
  top: number;
  left: number;
}

const hiddenPosition: Position = { top: -9999, left: -9999 };

export default function Tooltip() {
  const [position, setPosition] = useState<Position>(hiddenPosition);
  const [isOpen, setIsOpen] = useState(false);
  const [useLayout, setUseLayout] = useState(true);
  const triggerRef = useRef<HTMLButtonElement>(null);

  function updatePosition() {
    if (!triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    setPosition({
      top: rect.bottom + 10,
      left: rect.left + rect.width / 2,
    });
  }

  useEffect(() => {
    if (!isOpen || useLayout) return;
    updatePosition();
  }, [isOpen, useLayout]);

  useLayoutEffect(() => {
    if (!isOpen || !useLayout) return;
    updatePosition();
  }, [isOpen, useLayout]);

  useEffect(() => {
    if (!isOpen) {
      setPosition(hiddenPosition);
    }
  }, [isOpen]);

  return (
    <section
      style={{
        margin: "1.5rem 2rem 0",
        padding: "1rem 1.25rem",
        border: "1px solid #dbe3ef",
        borderRadius: "14px",
        background: "#f8fbff",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "1rem",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <div>
          <strong>Partie 7: useLayoutEffect</strong>
          <p style={{ margin: "0.35rem 0 0", color: "#516076" }}>
            Ouvre l&apos;info-bulle puis bascule entre les deux modes pour voir
            la difference de rendu.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setUseLayout((prev) => !prev)}
          style={{
            border: "none",
            borderRadius: "999px",
            padding: "0.65rem 1rem",
            background: useLayout ? "#0f172a" : "#475569",
            color: "#fff",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Mode: {useLayout ? "useLayoutEffect" : "useEffect"}
        </button>
      </div>

      <div style={{ marginTop: "1rem", position: "relative" }}>
        <button
          ref={triggerRef}
          type="button"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setIsOpen(false)}
          style={{
            border: "1px solid #0f172a",
            borderRadius: "10px",
            padding: "0.75rem 1rem",
            background: "#fff",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Survole ou focus ici
        </button>

        {isOpen && (
          <div
            style={{
              position: "fixed",
              top: position.top,
              left: position.left,
              transform: "translateX(-50%)",
              background: "#0f172a",
              color: "#fff",
              padding: "0.65rem 0.9rem",
              borderRadius: "10px",
              boxShadow: "0 12px 30px rgba(15, 23, 42, 0.18)",
              whiteSpace: "nowrap",
              zIndex: 20,
            }}
          >
            {useLayout
              ? "Position calculee avant peinture"
              : "Position calculee apres peinture"}
          </div>
        )}
      </div>
    </section>
  );
}
