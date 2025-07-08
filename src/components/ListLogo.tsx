"use client";
import Image from "next/image";
import Group1 from "@/assets/Group/Group 1.svg";
import Group2 from "@/assets/Group/Group 2.svg";
import Group3 from "@/assets/Group/Group 3.svg";
import Group4 from "@/assets/Group/Group 4.svg";
import Group5 from "@/assets/Group/Group 5.svg";
import { useLoading } from "@/contexts/LoadingContext";

export default function ListLogo() {
  const { loading } = useLoading();

  if (loading) {
    return (
      <div className="flex flex-wrap md:flex-nowrap justify-between items-center py-4 px-6 xl:px-0 md:py-20">
        {Array.from({ length: 5 }).map((_, idx) => (
          <div
            key={idx}
            className="skeleton w-24 lg:w-40 h-16 rounded-xl mx-2"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap md:flex-nowrap justify-between items-center py-4 px-6 xl:px-0 md:py-20">
      <Image
        src={Group1}
        alt="capital"
        className="h-auto object-contain w-24 lg:w-40"
      />
      <Image
        src={Group2}
        alt="gamuda-land"
        className="h-auto object-contain w-24 lg:w-40"
      />
      <Image
        src={Group3}
        alt="sun-group"
        className="h-auto object-contain w-24 lg:w-40"
      />
      <Image
        src={Group4}
        alt="masterise"
        className="h-auto object-contain w-24 lg:w-40 max-sm:mt-3"
      />
      <Image
        src={Group5}
        alt="angia"
        className="h-auto object-contain w-24 lg:w-40 max-sm:mt-3"
      />
    </div>
  );
}
