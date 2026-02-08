import { Box, Container } from '@radix-ui/themes';
import { JSAnimation, Scope } from 'animejs';
import { useEffect, useRef, useState } from 'react';

import { AbacusRow } from './AbacusRow';

const ABACUS_ROWS = [
  { id: 1, reversed: false },
  { id: 2, reversed: true },
  { id: 3, reversed: false },
];

export const AbacusAnimation = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scopes, setScopes] = useState<Record<number, Scope>>([]);

  useEffect(() => {
    const animations: { animation: JSAnimation; reversed: boolean }[] = [];
    Object.values(ABACUS_ROWS).forEach(({ id, reversed }) => {
      const scope = scopes[id];
      if (scope) {
        const scopeAnimations = scope.revertibles as JSAnimation[];
        scopeAnimations.forEach((animation) => {
          animations.push({ animation, reversed });
        });
      }
    });

    // Play animations on root hover
    const handleMouseEnter = () => {
      animations.forEach(({ animation }) => {
        animation.speed = 0.2;
      });
    };
    const handleMouseLeave = () => {
      animations.forEach(({ animation }) => (animation.speed = 1.0));
    };
    const element = containerRef.current;
    element?.addEventListener('mouseenter', handleMouseEnter);
    element?.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element?.removeEventListener('mouseenter', handleMouseEnter);
      element?.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [scopes]);

  return (
    <Container size="3">
      <Box
        ref={containerRef}
        mx="auto"
        style={{
          width: 400,
          height: 300,
          maxWidth: '100%',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {ABACUS_ROWS.map(({ id, reversed }, index) => (
          <div
            key={id}
            style={{
              position: 'absolute',
              top: index * 55,
              width: '100%',
            }}
          >
            <AbacusRow id={id} setScopes={setScopes} reversed={reversed} />
          </div>
        ))}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: 150,
            height: '100%',
            background:
              'linear-gradient(to left, transparent 0%, color(display-p3 0.067 0.07 0.063) 100%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            width: 150,
            height: '100%',
            background:
              'linear-gradient(to right, transparent 0%, color(display-p3 0.067 0.07 0.063) 100%)',
          }}
        />
      </Box>
    </Container>
  );
};
