import { encodeId } from "@/utils/hash";
import { useTranslations } from "next-intl";
import Image from "next/image";

interface ProductCardProps {
  _id: string;
  name: string;
  area: string;
  investor: string;
  defaultImage: string;
  slug: string;
}

export default function ProductCard({
  _id,
  name,
  area,
  investor,
  defaultImage,
}: ProductCardProps) {
  const t = useTranslations("ProductPage");
  const hashedId = encodeId(_id as string);

  return (
    <div className="bg-primary-2 w-full max-w-[100%] lg:max-w-lg shadow-sm hover:shadow-lg transition rounded-[30px] flex flex-col h-full rounded-t-lg mx-auto">
      <figure>
        <Image
          src={defaultImage}
          alt={name}
          width={400}
          height={250}
          className="w-full h-[180px] sm:h-[200px] md:h-[220px] lg:h-[250px] object-cover"
        />
      </figure>
      <div className="p-6 flex flex-col gap-4 flex-1">
        <h2 className="card-title text-2xl line-clamp-2">{name}</h2>
        <p className="text-base line-clamp-3">{area}</p>
        <p className="text-base mt-auto">
          Nhà đầu tư: <span className="font-bold">{investor}</span>
        </p>
        <button
          className="btn bg-white text-md lg:text-xl text-black py-8 rounded-[30px] mt-4"
          onClick={() => {
            window.location.href = `/products/${hashedId}`;
          }}
        >
          {t("productDetails")}
        </button>
      </div>
    </div>
  );
}
