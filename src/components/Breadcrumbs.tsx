interface BreadcrumbsProps {
  prevPage: BreadcrumbsItem[];
  currentPage: string;
}

interface BreadcrumbsItem {
  name: string;
  href?: string;
}

export default function Breadcrumbs({
  prevPage,
  currentPage,
}: BreadcrumbsProps) {
  return (
    <div className="breadcrumbs text-base font-extralight lg:text-4xl">
      <ul>
        {prevPage.map((page, index) => (
          <li key={index}>
            <a href={page.href ?? "/"}>{page.name}</a>
          </li>
        ))}
        <li>{currentPage}</li>
      </ul>
    </div>
  );
}
