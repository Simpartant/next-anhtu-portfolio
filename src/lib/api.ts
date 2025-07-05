export interface ApiItem {
  id: string;
  name: string;
  slug?: string;
}

export type ApartmentType = ApiItem;
export type Project = ApiItem;
export type Area = ApiItem;

export async function fetchProjects(): Promise<Project[]> {
  try {
    const response = await fetch("/api/products/projects");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    // Xử lý format mới: { projects: [...] }
    const projectsArray = data.projects || [];
    return projectsArray.map((projectName: string, index: number) => ({
      id: (index + 1).toString(),
      name: projectName,
      slug: projectName.toLowerCase().replace(/\s+/g, "-"),
    }));
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}

export async function fetchAreas(): Promise<Area[]> {
  try {
    const response = await fetch("/api/products/areas");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    // Xử lý format tương tự
    const areasArray = data.areas || [];
    return areasArray.map((areaName: string, index: number) => ({
      id: (index + 1).toString(),
      name: areaName,
      slug: areaName.toLowerCase().replace(/\s+/g, "-"),
    }));
  } catch (error) {
    console.error("Error fetching areas:", error);
    return [];
  }
}

export async function fetchApartmentTypes(): Promise<ApartmentType[]> {
  try {
    const response = await fetch("/api/products/apartment-type");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    // Xử lý format tương tự
    const apartmentTypesArray = data.apartmentTypes || [];
    return apartmentTypesArray.map((typeName: string, index: number) => ({
      id: (index + 1).toString(),
      name: typeName,
      slug: typeName.toLowerCase().replace(/\s+/g, "-"),
    }));
  } catch (error) {
    console.error("Error fetching apartment types:", error);
    return [];
  }
}
