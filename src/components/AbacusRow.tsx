import { animate, createScope, JSAnimation, Scope } from 'animejs';
import { useEffect, useRef } from 'react';

const DURATION = 4000;
const ITEM_COUNT = 6;

// TODO: make it somewhat interactive, e.g. offset items based on cursor position
export const AbacusRow = ({
  id,
  reversed = false,
  setScopes,
}: {
  id: number;
  reversed?: boolean;
  setScopes: React.Dispatch<React.SetStateAction<Record<number, Scope>>>;
}) => {
  const root = useRef<HTMLDivElement>(null);
  const scope = useRef<Scope | null>(null);

  useEffect(() => {
    const animations: JSAnimation[] = [];

    scope.current = createScope({ root }).add(() => {
      const targets = root.current?.querySelectorAll('.animsquare') || [];

      targets.forEach((target, i) => {
        const animation = animate(target, {
          x: [
            { from: -100, to: 75, ease: 'in(1.5)', duration: DURATION / 3 },
            { to: 275, ease: 'none', duration: DURATION },
            { to: 450, ease: 'in(1.5)', duration: DURATION / 3 },
            { to: -100, ease: 'none', duration: 0 },
          ],
          // opacity: [
          //   { from: 0, to: 1, ease: 'in', duration: DURATION / 3 },
          //   { to: 1, ease: 'none', duration: DURATION },
          //   { to: 0, ease: 'in', duration: DURATION / 3 },
          // ],
          loop: true,
          loopDelay: 0,
          reversed,
        }).seek(i * 1115);

        animations.push(animation);
      });

      setScopes((prev) => ({ ...prev, [id]: scope.current! }));
    });

    return () => {
      scope.current?.revert();
    };
  }, [setScopes, id, reversed]);

  return (
    <div
      ref={root}
      style={{
        position: 'relative',
        height: 44,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          width: '100%',
          height: 2,
          backgroundColor: 'var(--accent-8)',
        }}
      />
      {Array.from({ length: ITEM_COUNT }).map((_, i) => (
        <div
          key={i}
          data-index={i}
          className="animsquare"
          style={{
            position: 'absolute',
            width: 44,
            height: 44,
            backgroundColor: 'var(--accent-3)',
            border: '2px solid var(--accent-8)',
            transformOrigin: 'center',
            borderRadius: 4,
          }}
        />
      ))}
    </div>
  );
};
