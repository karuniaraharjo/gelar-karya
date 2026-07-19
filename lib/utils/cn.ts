/**
 * Utility for conditionally joining CSS class names.
 * Filters out falsy values (false, undefined, null, "") and joins the rest.
 *
 * @example
 * cn("base", isActive && "active", className)
 */
export function cn(
  ...inputs: (string | boolean | undefined | null)[]
): string {
  return inputs.filter(Boolean).join(" ");
}
