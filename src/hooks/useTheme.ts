import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { colors as baseColors, spacing as baseSpacing } from '../styles/theme';

export const useTheme = () => {
  const mode = useSelector((state: RootState) => state.theme?.mode || 'dark');

  const colors = mode === 'dark' ? baseColors : {
    ...baseColors,
    background: '#FFFFFF',
    cardBackground: '#F5F5F5',
    text: '#111827',
    textSecondary: '#6B7280',
    primary: baseColors.primary,
  };

  return { colors, spacing: baseSpacing, mode };
};
