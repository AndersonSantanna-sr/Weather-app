import type { AppTheme } from '@/shared/constants/theme';

export const createStyles = (theme: AppTheme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.card,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
  },
  itemContainer: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.card,
    marginBottom: theme.spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemDescription: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.sm,
  },
  itemText: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});
