"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import ProductCard from "@/components/Products/ProductCard";

interface ProductProps {
  _id: string;
  name: string;
  area: string;
  investor: string;
  defaultImage: string;
  slug: string;
}

function ProductsPageContent() {
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [apartmentTypes, setApartmentTypes] = useState<string[]>([]);
  const [areas, setAreas] = useState<string[]>([]);
  const [investors, setInvestors] = useState<string[]>([]);
  const [projects, setProjects] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [selectedInvestors, setSelectedInvestors] = useState<string[]>([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtersInitialized, setFiltersInitialized] = useState(false);

  // Dropdown states for mobile
  const [areaDropdownOpen, setAreaDropdownOpen] = useState(false);
  const [investorDropdownOpen, setInvestorDropdownOpen] = useState(false);
  const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);

  const searchParams = useSearchParams();
  const t = useTranslations("ProductPage");

  // Function to update URL without reload
  const updateURL = (params: URLSearchParams) => {
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, "", newUrl);
  };

  // Initialize filters from URL params
  const initializeFiltersFromParams = () => {
    const urlAreas = searchParams.getAll("area");
    const urlInvestors = searchParams.getAll("investor");
    const urlApartmentType = searchParams.get("apartmentType");
    const urlProject = searchParams.get("project");

    setSelectedAreas(urlAreas);
    setSelectedInvestors(urlInvestors);
    setSelectedType(urlApartmentType);
    setSelectedProject(urlProject);
    setFiltersInitialized(true);

    return {
      areas: urlAreas,
      investors: urlInvestors,
      apartmentType: urlApartmentType,
      project: urlProject,
    };
  };

  const fetchProducts = async (
    apartmentType?: string,
    areas?: string[],
    investors?: string[],
    project?: string
  ) => {
    try {
      setLoading(true);
      let url = "/api/products";
      const params = new URLSearchParams();

      if (apartmentType) {
        params.append("apartmentType", apartmentType);
      }

      if (areas && areas.length > 0) {
        areas.forEach((area) => params.append("area", area));
      }

      if (investors && investors.length > 0) {
        investors.forEach((investor) => params.append("investor", investor));
      }

      if (project) {
        params.append("project", project);
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const res = await fetch(url);

      if (!res.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleAreaChange = (area: string, checked: boolean) => {
    let newSelectedAreas: string[];
    if (checked) {
      newSelectedAreas = [...selectedAreas, area];
    } else {
      newSelectedAreas = selectedAreas.filter((a) => a !== area);
    }
    setSelectedAreas(newSelectedAreas);
    // Update URL with new area filters
    const params = new URLSearchParams();
    newSelectedAreas.forEach((a) => params.append("area", a));
    if (selectedType) {
      params.set("apartmentType", selectedType);
    }
    selectedInvestors.forEach((investor) => params.append("investor", investor));
    if (selectedProject) {
      params.set("project", selectedProject);
    }
    updateURL(params);
  };

  const handleInvestorChange = (investor: string, checked: boolean) => {
    let newSelectedInvestors: string[];
    if (checked) {
      newSelectedInvestors = [...selectedInvestors, investor];
    } else {
      newSelectedInvestors = selectedInvestors.filter((i) => i !== investor);
    }
    setSelectedInvestors(newSelectedInvestors);
    // Update URL with new investor filters
    const params = new URLSearchParams();
    newSelectedInvestors.forEach((i) => params.append("investor", i));
    if (selectedType) {
      params.set("apartmentType", selectedType);
    }
    selectedAreas.forEach((area) => params.append("area", area));
    if (selectedProject) {
      params.set("project", selectedProject);
    }
    updateURL(params);
  };

  const handleProjectChange = (project: string | null) => {
    setSelectedProject(project);
    const params = new URLSearchParams();
    if (project !== null) {
      params.set("project", project);
    }
    if (selectedType) {
      params.set("apartmentType", selectedType);
    }
    selectedAreas.forEach((area) => params.append("area", area));
    selectedInvestors.forEach((investor) => params.append("investor", investor));
    updateURL(params);
  };

  const handleApartmentTypeChange = (type: string | null) => {
    setSelectedType(type);
    const params = new URLSearchParams();
    if (type !== null) {
      params.set("apartmentType", type);
    }
    selectedAreas.forEach((area) => params.append("area", area));
    selectedInvestors.forEach((investor) => params.append("investor", investor));
    if (selectedProject) {
      params.set("project", selectedProject);
    }
    updateURL(params);
  };

  useEffect(() => {
    const fetchApartmentTypes = async () => {
      try {
        const res = await fetch("/api/products/apartment-type");
        const data = await res.json();
        setApartmentTypes(data.apartmentTypes || []);
      } catch (error) {
        console.error("Failed to fetch apartment types:", error);
      }
    };

    const fetchAreas = async () => {
      try {
        const res = await fetch("/api/products/areas");
        const data = await res.json();
        setAreas(data.areas || []);
      } catch (error) {
        console.error("Failed to fetch areas:", error);
      }
    };

    const fetchInvestors = async () => {
      try {
        const res = await fetch("/api/products/investors");
        const data = await res.json();
        setInvestors(data.investors || []);
      } catch (error) {
        console.error("Failed to fetch investors:", error);
      }
    };

    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/products/projects");
        const data = await res.json();
        setProjects(data.projects || []);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      }
    };

    const initialize = async () => {
      // Fetch filter options first
      await Promise.all([
        fetchApartmentTypes(),
        fetchAreas(),
        fetchInvestors(),
        fetchProjects(),
      ]);

      // Initialize filters from URL params
      const params = initializeFiltersFromParams();

      // Fetch products with initialized filters
      fetchProducts(
        params.apartmentType || undefined,
        params.areas,
        params.investors,
        params.project || undefined
      );
    };

    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // useEffect để fetch products khi filter thay đổi
  useEffect(() => {
    if (filtersInitialized) {
      fetchProducts(
        selectedType || undefined,
        selectedAreas,
        selectedInvestors,
        selectedProject || undefined
      );
    }
  }, [selectedType, selectedAreas, selectedInvestors, selectedProject, filtersInitialized]);

  const AreaFilter = () => (
    <div>
      <h3 className="text-lg font-semibold mb-4">{t("filter.area")}</h3>
      {/* Desktop version */}
      <div className="hidden lg:block space-y-3">
        {areas.map((area) => (
          <div key={area} className="flex items-center gap-3">
            <label
              htmlFor={`area-${area}`}
              className="text-sm cursor-pointer flex-1"
            >
              {area}
            </label>
            <input
              type="checkbox"
              id={`area-${area}`}
              className="checkbox checkbox-primary flex-shrink-0"
              checked={selectedAreas.includes(area)}
              onChange={(e) => handleAreaChange(area, e.target.checked)}
            />
          </div>
        ))}
      </div>

      {/* Mobile dropdown version */}
      <div className="lg:hidden">
        <div
          className={`dropdown ${
            areaDropdownOpen ? "dropdown-open" : ""
          } w-full`}
        >
          <div
            tabIndex={0}
            role="button"
            className="btn btn-outline w-full justify-between"
            onClick={() => setAreaDropdownOpen(!areaDropdownOpen)}
          >
            <span>
              {selectedAreas.length > 0
                ? `${selectedAreas.length} area(s) selected`
                : "Select Areas"}
            </span>
            <svg
              className={`w-4 h-4 transition-transform ${
                areaDropdownOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
          <div className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-full max-h-60 overflow-y-auto">
            {areas.map((area) => (
              <label
                key={area}
                className="flex items-center gap-3 p-2 hover:bg-base-200 cursor-pointer"
              >
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary"
                  checked={selectedAreas.includes(area)}
                  onChange={(e) => {
                    handleAreaChange(area, e.target.checked);
                    // Don't close dropdown to allow multiple selections
                  }}
                />
                <span className="text-sm">{area}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const InvestorFilter = () => (
    <div>
      <h3 className="text-lg font-semibold mb-4">{t("filter.investor")}</h3>
      {/* Desktop version */}
      <div className="hidden lg:block space-y-3">
        {investors.map((investor) => (
          <div key={investor} className="flex items-center gap-3">
            <label
              htmlFor={`investor-${investor}`}
              className="text-sm cursor-pointer flex-1"
            >
              {investor}
            </label>
            <input
              type="checkbox"
              id={`investor-${investor}`}
              className="checkbox checkbox-primary flex-shrink-0"
              checked={selectedInvestors.includes(investor)}
              onChange={(e) => handleInvestorChange(investor, e.target.checked)}
            />
          </div>
        ))}
      </div>

      {/* Mobile dropdown version */}
      <div className="lg:hidden">
        <div
          className={`dropdown ${
            investorDropdownOpen ? "dropdown-open" : ""
          } w-full`}
        >
          <div
            tabIndex={0}
            role="button"
            className="btn btn-outline w-full justify-between"
            onClick={() => setInvestorDropdownOpen(!investorDropdownOpen)}
          >
            <span>
              {selectedInvestors.length > 0
                ? `${selectedInvestors.length} investor(s) selected`
                : "Select Investors"}
            </span>
            <svg
              className={`w-4 h-4 transition-transform ${
                investorDropdownOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
          <div className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-full max-h-60 overflow-y-auto">
            {investors.map((investor) => (
              <label
                key={investor}
                className="flex items-center gap-3 p-2 hover:bg-base-200 cursor-pointer"
              >
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary"
                  checked={selectedInvestors.includes(investor)}
                  onChange={(e) => {
                    handleInvestorChange(investor, e.target.checked);
                    // Don't close dropdown to allow multiple selections
                  }}
                />
                <span className="text-sm">{investor}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const ProjectFilter = () => (
    <div>
      <h3 className="text-lg font-semibold mb-4">{t("filter.project")}</h3>
      {/* Desktop version */}
      <div className="hidden lg:block space-y-3">
        <div className="flex items-center gap-3">
          <label
            htmlFor="project-all"
            className="text-sm cursor-pointer flex-1"
          >
            {t("filter.allProjects")}
          </label>
          <input
            type="radio"
            id="project-all"
            name="project"
            className="radio radio-primary flex-shrink-0"
            checked={selectedProject === null}
            onChange={() => handleProjectChange(null)}
          />
        </div>
        {projects.map((project) => (
          <div key={project} className="flex items-center gap-3">
            <label
              htmlFor={`project-${project}`}
              className="text-sm cursor-pointer flex-1"
            >
              {project}
            </label>
            <input
              type="radio"
              id={`project-${project}`}
              name="project"
              className="radio radio-primary flex-shrink-0"
              checked={selectedProject === project}
              onChange={() => handleProjectChange(project)}
            />
          </div>
        ))}
      </div>

      {/* Mobile dropdown version */}
      <div className="lg:hidden">
        <div
          className={`dropdown ${
            projectDropdownOpen ? "dropdown-open" : ""
          } w-full`}
        >
          <div
            tabIndex={0}
            role="button"
            className="btn btn-outline w-full justify-between"
            onClick={() => setProjectDropdownOpen(!projectDropdownOpen)}
          >
            <span>{selectedProject ? selectedProject : "All Projects"}</span>
            <svg
              className={`w-4 h-4 transition-transform ${
                projectDropdownOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
          <div className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-full max-h-60 overflow-y-auto">
            <button
              className={`text-left p-2 hover:bg-base-200 ${
                selectedProject === null ? "bg-base-200 font-semibold" : ""
              }`}
              onClick={() => {
                handleProjectChange(null);
                setProjectDropdownOpen(false);
              }}
            >
              All Projects
            </button>
            {projects.map((project) => (
              <button
                key={project}
                className={`text-left p-2 hover:bg-base-200 ${
                  selectedProject === project ? "bg-base-200 font-semibold" : ""
                }`}
                onClick={() => {
                  handleProjectChange(project);
                  setProjectDropdownOpen(false);
                }}
              >
                {project}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const handleClearFilters = () => {
    // Reset all filter states
    setSelectedType(null);
    setSelectedAreas([]);
    setSelectedInvestors([]);
    setSelectedProject(null);

    // Close all dropdowns
    setAreaDropdownOpen(false);
    setInvestorDropdownOpen(false);
    setProjectDropdownOpen(false);

    // Update URL to remove all filters without reload
    window.history.replaceState(null, "", window.location.pathname);

    // Fetch all products without filters
    fetchProducts();
  };

  // Check if any filters are active
  const hasActiveFilters =
    selectedType !== null ||
    selectedAreas.length > 0 ||
    selectedInvestors.length > 0 ||
    selectedProject !== null;

  if (loading) {
    return (
      <div className="container mx-auto py-20 px-6 lg:px-0">
        <div className="text-4xl mb-16">{t("title")}</div>
        <div className="flex justify-center items-center h-64">
          <div className="loading loading-spinner loading-lg"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-20 px-6 lg:px-0">
        <div className="text-4xl mb-16">{t("title")}</div>
        <div className="alert alert-error">
          <span>Error: {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-20 px-6 lg:px-0">
      <div className="text-4xl mb-16">{t("title")}</div>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <div className="mb-6">
          <button
            onClick={handleClearFilters}
            className="btn btn-outline btn-error rounded-xl gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            {t("filter.clearAllFilters")}
          </button>
        </div>
      )}

      {/* Main Content with Left Content and Right Products + Filter */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Content Section - Areas, Investors and Projects Filter */}
        <div className="lg:w-1/6">
          <div className="h-full space-y-8">
            {/* Areas Filter */}
            <AreaFilter />

            {/* Investors Filter */}
            {investors.length > 0 && <InvestorFilter />}

            {/* Projects Filter */}
            {projects.length > 0 && <ProjectFilter />}
          </div>
        </div>

        {/* Divider */}
        <div className="hidden lg:block w-px"></div>

        {/* Right Section: Filter + Products */}
        <div className="lg:w-2/3">
          {/* Filter Section */}
          {apartmentTypes.length > 0 && (
            <div className="mb-8 flex flex-wrap gap-2">
              <button
                className={`btn btn-primary-2 text-white border-none shadow-none
 rounded-xl ${
   selectedType === null ? "font-bold border-2 border-solid border-gray-600" : "font-normal"
 }`}
                onClick={() => handleApartmentTypeChange(null)}
              >
                {t("filter.all")}
              </button>
              {apartmentTypes.map((type) => (
                <button
                  key={type}
                  className={`btn btn-primary-2 text-white border-none shadow-none
 rounded-xl ${
   selectedType === type ? "font-bold border-2 border-solid border-gray-600" : "font-normal"
 }`}
                  onClick={() => handleApartmentTypeChange(type)}
                >
                  {type}
                </button>
              ))}
            </div>
          )}

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {products.map((product) => (
              <ProductCard key={product.name} {...product} />
            ))}
          </div>

          {products.length === 0 && !loading && (
            <div className="text-center py-16">
              <p className="text-lg text-gray-500">{t("noProductFound")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ProductsPageLoading() {
  return (
    <div className="container mx-auto py-20">
      <div className="text-4xl mb-16">Products</div>
      <div className="flex justify-center items-center h-64">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsPageLoading />}>
      <ProductsPageContent />
    </Suspense>
  );
}
