import { container } from "@/ui/classes";
export default function CatalogueLayout({ children, className = "" }) {
  return (
    <div className={`${container} py-8 sm:py-12 ${className}`}>{children}</div>
  );
}
