import Link from "next/link";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
};

const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  return (
    <nav className="flex items-center gap-1 text-sm pb-2">
      {items.map((item, index) => (
        <div key={item.label} className="flex items-center gap-1">
          {item.href ? (
            <Link href={item.href} className="text-gray-500 hover:text-primary">
              {item.label}
            </Link>
          ) : (
            <span className="text-mainText">{item.label}</span>
          )}

          {index < items.length - 1 && <span className="text-gray-400">/</span>}
        </div>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
