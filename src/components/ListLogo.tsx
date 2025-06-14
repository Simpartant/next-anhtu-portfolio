import Image from "next/image";
import Group1 from "@/assets/Group/Group 1.svg";
import Group2 from "@/assets/Group/Group 2.svg";
import Group3 from "@/assets/Group/Group 3.svg";
import Group4 from "@/assets/Group/Group 4.svg";
import Group5 from "@/assets/Group/Group 5.svg";

const logos = [
  { src: Group1, alt: "capital" },
  { src: Group2, alt: "gamuda-land" },
  { src: Group3, alt: "sun-group" },
  { src: Group4, alt: "masterise" },
  { src: Group5, alt: "angia" },
];

export default function ListLogo() {
  return (
    <div className="flex flex-wrap md:flex-nowrap justify-between items-center py-4 max-sm:px-6 md:py-20">
      {logos.map((logo, idx) => (
        <Image
          key={logo.alt}
          src={logo.src}
          alt={logo.alt}
          className={`h-auto object-contain w-30 lg:w-40${
            idx >= 3 ? " max-sm:mt-3" : ""
          }`}
        />
      ))}
    </div>
  );
}
