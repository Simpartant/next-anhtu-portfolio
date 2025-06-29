import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

interface BlogCardProps {
  title: string;
  slug: string;
  imageUrl: string;
  description: string;
  createdAt: string;
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
}

export default function BlogCard({
  title,
  slug,
  imageUrl,
  description,
  createdAt,
}: BlogCardProps) {
  const t = useTranslations("BlogPage");

  return (
    <Link href={`/blogs/${slug}`} className="block">
      <div className="bg-primary-2 w-full max-w-[100%] lg:max-w-lg xl:max-w-xl shadow-sm hover:shadow-lg transition rounded-[30px] rounded-t-lg flex flex-col h-full mx-auto">
        <figure>
          <Image
            src={imageUrl}
            alt={title}
            width={400}
            height={250}
            draggable={false}
            className="w-full h-[180px] sm:h-[200px] md:h-[220px] lg:h-[250px] object-cover"
          />
        </figure>
        <div className="p-4 sm:p-6 flex flex-col gap-3 sm:gap-4 flex-1">
          <h2 className="card-title text-lg sm:text-xl md:text-2xl line-clamp-2">
            {title}
          </h2>
          <p className="text-gray-300 text-sm sm:text-base line-clamp-3">
            {description}
          </p>
          <p className="text-gray-300 text-xs sm:text-sm mt-auto">
            {t("dateCreated")}: {formatDate(createdAt)}
          </p>
        </div>
      </div>
    </Link>
  );
}
