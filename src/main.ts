import { Course, ICourse } from "./models/course.js";

// ===== Referencias al DOM (con aserciones de tipo) =====
const searchInput = document.getElementById("search") as HTMLInputElement;
const levelSelect = document.getElementById("level") as HTMLSelectElement;

// Lista completa de cursos (se llena al cargar el JSON)
let allCourses: Course[] = [];

// ===== Mostrar un mensaje dentro del catálogo =====
function showMessage(text: string, isError: boolean = false): void {
    const catalog = document.getElementById("catalog") as HTMLDivElement | null;
    if (catalog) {
        catalog.innerHTML = `<p class="message${isError ? " error" : ""}">${text}</p>`;
    }
}

// ===== Renderizar el catálogo =====
function renderCatalog(courses: Course[], searchText: string = ""): void {
    try {
        const catalog = document.getElementById("catalog") as HTMLDivElement | null;

        if (!catalog) {
            throw new Error("No se encontró el contenedor #catalog en la página.");
        }

        // Limpiar el contenedor
        catalog.innerHTML = "";

        if (courses.length === 0) {
            showMessage("No se encontraron cursos.");
            return;
        }

        // Renderizar cada curso con su método render()
        let html = "";
        for (const course of courses) {
            html += course.render(searchText);
        }
        catalog.innerHTML = html;
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        console.error("Error al renderizar el catálogo:", message);
    }
}

// ===== Filtrar cursos por nivel y texto =====
function filterCourses(courses: Course[], level: string, searchText: string): Course[] {
    const text = searchText.trim().toLowerCase();

    return courses.filter((course: Course): boolean => {
        const matchesLevel = level === "All" || course.level === level;
        const matchesText = course.title.toLowerCase().includes(text);
        return matchesLevel && matchesText;
    });
}

// ===== Aplicar ambos filtros y volver a renderizar =====
function applyFilters(): void {
    const filtered = filterCourses(allCourses, levelSelect.value, searchInput.value);
    renderCatalog(filtered, searchInput.value);
}

// ===== Cargar los cursos desde el archivo JSON =====
async function loadCourses(): Promise<ICourse[]> {
    const response: Response = await fetch("courses.json");

    if (!response.ok) {
        throw new Error(`No se pudo cargar courses.json (HTTP ${response.status})`);
    }

    return (await response.json()) as ICourse[];
}

// ===== Inicializar la aplicación =====
async function init(): Promise<void> {
    showMessage("Loading courses...");

    try {
        const data: ICourse[] = await loadCourses();

        // Convertir cada objeto del JSON en una instancia de Course
        allCourses = data.map(
            (c: ICourse): Course => new Course(c.title, c.level, c.duration, c.description)
        );

        applyFilters();
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        console.error("Error al cargar los cursos:", message);
        showMessage("No se pudieron cargar los cursos. Inténtalo de nuevo más tarde.", true);
    }
}

// ===== Eventos =====
levelSelect.addEventListener("change", (_event: Event): void => applyFilters());
searchInput.addEventListener("input", (_event: Event): void => applyFilters());

init();
