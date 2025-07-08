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
  const truncate = (str: string, max = 24) =>
    str.length > max ? str.slice(0, max) + "..." : str;

  return (
    <div className="breadcrumbs text-base font-extralight lg:text-4xl">
      <ul>
        {prevPage.map((page, index) => (
          <li key={index}>
            <a href={page.href ?? "/"} title={page.name}>
              {truncate(page.name)}
            </a>
          </li>
        ))}
        <li title={currentPage}>{truncate(currentPage)}</li>
      </ul>
    </div>
  );
}
