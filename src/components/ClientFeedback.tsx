"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const feedbacks = [
  {
    name: "Chị Minh Hằng",
    title: "Quận 7, TP.HCM",
    message:
      "Anh Tú đã tư vấn cho tôi rất kỹ lưỡng, từ pháp lý đến tiềm năng sinh lời. Nhờ anh, tôi đã chọn được một sản phẩm đầu tư đúng thời điểm.",
  },
  {
    name: "Anh Đức Minh",
    title: "nhà đầu tư cá nhân",
    message:
      "Quy trình làm việc rõ ràng, nhanh chóng và rất chuyên nghiệp. Tôi cảm thấy an tâm tuyệt đối khi đầu tư qua anh Tú.",
  },
  {
    name: "Anh Hoàng Long",
    title: "doanh nhân",
    message:
      "Tôi đánh giá cao sự tận tâm và kiến thức thị trường của anh Tú. Anh không chỉ bán bất động sản mà còn đồng hành cùng khách hàng sau khi mua.",
  },
];

function useFeedbackDisplayCount() {
  const [count, setCount] = useState(1);

  useEffect(() => {
    const updateCount = () => {
      setCount(window.innerWidth < 1024 ? 1 : 3);
    };
    updateCount();
    window.addEventListener("resize", updateCount);
    return () => window.removeEventListener("resize", updateCount);
  }, []);

  return count;
}

export default function ClientFeedback() {
  const [index, setIndex] = useState(0);
  const t = useTranslations("ClientFeedback");
  const displayCount = useFeedbackDisplayCount();

  const prev = () => {
    setIndex((prev) => (prev === 0 ? feedbacks.length - 1 : prev - 1));
  };

  const next = () => {
    setIndex((prev) => (prev === feedbacks.length - 1 ? 0 : prev + 1));
  };

  const getFeedbackIndices = () => {
    return Array.from(
      { length: displayCount },
      (_, offset) => (index + offset) % feedbacks.length
    );
  };

  return (
    <section className="text-white py-12 px-6 lg:px-0">
      <div>
        <h2 className="text-4xl mb-12">{t("title")}</h2>
        <div className="rounded-4xl bg-primary-2 border border-neutral-600 p-4 md:p-8 flex flex-col items-center justify-between gap-4 relative">
          {/* Arrow buttons */}
          <button
            className="absolute left-2 md:left-6 lg:left-12 top-1/2 btn btn-circle btn-xs md:btn-sm bg-neutral-content text-neutral z-10"
            onClick={prev}
            aria-label="Previous feedback"
          >
            <FaChevronLeft />
          </button>
          <button
            className="absolute right-2 md:right-6 lg:right-12 top-1/2 btn btn-circle btn-xs md:btn-sm bg-neutral-content text-neutral z-10"
            onClick={next}
            aria-label="Next feedback"
          >
            <FaChevronRight />
          </button>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full max-w-7xl mx-auto pt-8 pb-2">
            {getFeedbackIndices().map((current) => {
              const f = feedbacks[current];
              return (
                <div
                  key={current}
                  className="bg-primary-2 border border-neutral-600 p-4 md:p-6 rounded-2xl shadow min-h-[180px] flex flex-col justify-between"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gray-300" />
                    <div>
                      <p className="font-semibold">{f.name}</p>
                      <p className="text-sm text-gray-400">{f.title}</p>
                    </div>
                  </div>
                  <p className="text-sm italic text-gray-200">
                    &quot;{f.message}&quot;
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
