/**
 * Accessibility helper functions for marketing site
 */

/**
 * Generates an accessible label for status badges
 */
export function getStatusAriaLabel(status: string, description?: string): string {
  const baseLabel = `Status: ${status}`
  return description ? `${baseLabel}. ${description}` : baseLabel
}

/**
 * Generates an accessible label for navigation items
 */
export function getNavAriaLabel(itemName: string, isActive?: boolean): string {
  const activeIndicator = isActive ? " (trenutno aktivno)" : ""
  return `${itemName}${activeIndicator}`
}

/**
 * Generates an accessible label for sort controls
 */
export function getSortAriaLabel(column: string, direction?: "asc" | "desc" | null): string {
  if (!direction) {
    return `Sortiraj po ${column}`
  }
  const directionLabel = direction === "asc" ? "uzlazno" : "silazno"
  return `Sortirano po ${column} ${directionLabel}. Kliknite za promjenu smjera.`
}

/**
 * Generates an accessible label for pagination controls
 */
export function getPaginationAriaLabel(
  currentPage: number,
  totalPages: number,
  itemsPerPage: number
): string {
  return `Stranica ${currentPage} od ${totalPages}. Prikazuje se ${itemsPerPage} stavki po stranici.`
}
