import { StyleSheet, Platform } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2EDE7',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 18,
  },
  greeting: {
    fontSize: 13,
    color: '#7A8D9C',
    fontWeight: '500',
  },
  username: {
    fontSize: 17,
    fontWeight: '800',
    color: '#2C3E50',
  },
  logoutButton: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: 'rgba(217, 83, 79, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleSection: {
    marginTop: 14,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#2C3E50',
  },
  headerAccent: {
    color: '#5B8EA6',
  },
  // Search Bar
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginVertical: 12,
    paddingHorizontal: 16,
    height: 48,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(181, 208, 219, 0.4)',
    ...Platform.select({
      ios: {
        shadowColor: '#5B8EA6',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: '#2C3E50',
  },
  // Stats Row
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(181, 208, 219, 0.3)',
    ...Platform.select({
      ios: {
        shadowColor: '#5B8EA6',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: '#2C3E50',
  },
  statLabel: {
    fontSize: 11,
    color: '#7A8D9C',
    fontWeight: '600',
  },
  // Categories Scroll
  categoriesContainer: {
    paddingLeft: 20,
    paddingRight: 10,
    marginBottom: 16,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(181, 208, 219, 0.4)',
  },
  categoryChipActive: {
    backgroundColor: '#5B8EA6',
    borderColor: '#5B8EA6',
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#7A8D9C',
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
  },
  // Section Headers
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#2C3E50',
  },
  sectionBadge: {
    fontSize: 12,
    color: '#5B8EA6',
    fontWeight: '700',
  },
  // Pinned Notes Horizontal List
  pinnedList: {
    paddingLeft: 20,
    paddingRight: 10,
    marginBottom: 16,
  },
  pinnedCard: {
    width: 220,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginRight: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(91, 142, 166, 0.3)',
    ...Platform.select({
      ios: {
        shadowColor: '#5B8EA6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 10,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  pinnedCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  pinBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(91, 142, 166, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  pinBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#5B8EA6',
  },
  pinnedTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 6,
  },
  pinnedContent: {
    fontSize: 13,
    color: '#7A8D9C',
    lineHeight: 18,
    marginBottom: 10,
  },
  pinnedDate: {
    fontSize: 10,
    color: '#A0B0BC',
    fontWeight: '500',
  },
  // Notes List
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 110,
  },
  noteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(181, 208, 219, 0.3)',
    ...Platform.select({
      ios: {
        shadowColor: '#5B8EA6',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  noteTitleContainer: {
    flex: 1,
    marginRight: 10,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2C3E50',
  },
  noteCategoryPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#F7F4F0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 4,
  },
  noteCategoryText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#5B8EA6',
  },
  noteActions: {
    flexDirection: 'row',
    gap: 6,
  },
  actionButton: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinActionButton: {
    backgroundColor: 'rgba(91, 142, 166, 0.08)',
  },
  deleteActionButton: {
    backgroundColor: 'rgba(217, 83, 79, 0.08)',
  },
  noteContent: {
    fontSize: 14,
    color: '#7A8D9C',
    marginTop: 8,
    lineHeight: 20,
  },
  noteFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F7F4F0',
  },
  noteDate: {
    fontSize: 11,
    color: '#A0B0BC',
    fontWeight: '500',
  },
  // Empty State
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyIcon: {
    marginBottom: 14,
    opacity: 0.4,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 13,
    color: '#7A8D9C',
    textAlign: 'center',
  },
  // FAB
  fab: {
    position: 'absolute',
    bottom: 28,
    right: 22,
    width: 60,
    height: 60,
    borderRadius: 20,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#5B8EA6',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 14,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  fabGradient: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(44, 62, 80, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 22,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 22,
    ...Platform.select({
      ios: {
        shadowColor: '#5B8EA6',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
      },
      android: {
        elevation: 15,
      },
    }),
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 16,
  },
  modalInput: {
    height: 48,
    backgroundColor: '#F7F4F0',
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#2C3E50',
    borderWidth: 1,
    borderColor: '#E8E2DA',
    marginBottom: 12,
  },
  modalContentInput: {
    height: 110,
    backgroundColor: '#F7F4F0',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingTop: 12,
    fontSize: 15,
    color: '#2C3E50',
    borderWidth: 1,
    borderColor: '#E8E2DA',
    marginBottom: 14,
    textAlignVertical: 'top',
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#7A8D9C',
    marginBottom: 6,
  },
  modalCategoryContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  modalCategoryOption: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#F7F4F0',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8E2DA',
  },
  modalCategoryOptionActive: {
    backgroundColor: '#5B8EA6',
    borderColor: '#5B8EA6',
  },
  modalCategoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7A8D9C',
  },
  modalCategoryTextActive: {
    color: '#FFFFFF',
  },
  pinToggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F7F4F0',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#E8E2DA',
  },
  pinToggleText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2C3E50',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  modalCancelButton: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F4F0',
    borderWidth: 1,
    borderColor: '#E8E2DA',
  },
  modalCancelText: {
    color: '#7A8D9C',
    fontWeight: '600',
    fontSize: 14,
  },
  modalSaveButton: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    overflow: 'hidden',
  },
  modalSaveGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalSaveText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});

export default styles;
