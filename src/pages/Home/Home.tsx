import { Box, Container } from '@radix-ui/themes';
import { animate, createScope, Scope, stagger } from 'animejs';
import { useEffect, useRef } from 'react';

const DURATION = 3000;
const ITEM_COUNT = 5;

// TODO: make it somewhat interactive, e.g. offset items based on cursor position
export const Home = () => {
  const root = useRef(null);
  const root2 = useRef(null);
  const scope = useRef<Scope | null>(null);
  const scope2 = useRef<Scope | null>(null);

  useEffect(() => {
    scope.current = createScope({ root }).add((self) => {
      animate('.animsquare', {
        x: [
          { from: -100, to: 75, ease: 'in(1.5)', duration: DURATION / 3 },
          { to: 275, ease: 'none', duration: DURATION },
          { to: 450, ease: 'in(1.5)', duration: DURATION / 3 },
          { to: -100, ease: 'none', duration: 0 },
        ],
        loop: true,
        loopDelay: 0,
        delay: stagger(900),
      });
    });

    scope2.current = createScope({ root: root2 }).add((self) => {
      animate('.animsquare', {
        x: [
          { from: -100, to: 75, ease: 'in(1.5)', duration: DURATION / 3 },
          { to: 275, ease: 'none', duration: DURATION },
          { to: 450, ease: 'in(1.5)', duration: DURATION / 3 },
          { to: -100, ease: 'none', duration: 0 },
        ],
        loop: true,
        loopDelay: 0,
        delay: stagger(900, {
          start: 900 * ITEM_COUNT, // Extra delay by number of items so the first loop finishes before the next starts
        }),
      });
    });

    return () => {
      scope.current?.revert();
      scope2.current?.revert();
    };
  }, []);

  return (
    <Container size="3">
      <Box
        mx="auto"
        style={{
          width: 400,
          height: 300,
          border: '2px solid var(--accent-8)',
          position: 'relative',
          // overflow: 'hidden',
        }}
      >
        <Box ref={root}>
          {Array.from({ length: ITEM_COUNT }).map((_, i) => (
            <div
              key={i}
              data-index={i}
              className="animsquare"
              style={{
                position: 'absolute',
                top: (50 + 10) * i,
                // top: 50,
                width: 50,
                height: 50,
                backgroundColor: 'var(--accent-3)',
                border: '2px solid var(--accent-8)',
                transformOrigin: 'center',
                borderRadius: 4,
              }}
            />
          ))}
        </Box>
        <Box ref={root2}>
          {Array.from({ length: ITEM_COUNT }).map((_, i) => (
            <div
              key={i}
              data-index={i}
              className="animsquare"
              style={{
                position: 'absolute',
                top: (50 + 10) * i,
                // top: 50,
                width: 50,
                height: 50,
                backgroundColor: 'var(--accent-3)',
                border: '2px solid var(--accent-8)',
                transformOrigin: 'center',
                borderRadius: 4,
              }}
            />
          ))}
        </Box>
      </Box>
    </Container>
  );
};
