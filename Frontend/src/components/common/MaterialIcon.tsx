// Frontend/src/components/common/MaterialIcon.tsx
import { cn } from '../../lib/utils';

interface MaterialIconProps {
  name: string;
  className?: string;
  filled?: boolean;
  size?: number;
}

export const MaterialIcon = ({
  name,
  className,
  filled = false,
  size = 24,
}: MaterialIconProps) => (
  <span
    className={cn('material-symbols-outlined inline-block align-middle leading-none', className)}
    style={{
      fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' ${size}`,
      fontSize: size,
    }}
  >
    {name}
  </span>
);
