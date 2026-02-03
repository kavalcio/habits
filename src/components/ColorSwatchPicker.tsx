import { Flex, IconButton, useThemeContext } from '@radix-ui/themes';

import { RADIX_ACCENT_COLORS } from '@/constants';

export const ColorSwatchPicker = ({
  value,
  onChange,
}: {
  value?: string;
  onChange: (color: string) => void;
}) => {
  const theme = useThemeContext();
  return (
    <Flex gap="2" wrap="wrap" mb="3">
      {RADIX_ACCENT_COLORS.map((color) => (
        <IconButton
          key={color}
          type="button"
          aria-label={color}
          onClick={() => onChange(color)}
          style={{
            width: 28,
            height: 28,
            border:
              value === color
                ? `2px solid var(--${color}-6)`
                : '2px solid var(--gray-8)',
            background: `var(--${color}-9)`,
            outline:
              value === color
                ? `2px solid var(--${theme.appearance === 'dark' ? 'white' : 'black'}-a10)`
                : 'none',
          }}
        />
      ))}
    </Flex>
  );
};
