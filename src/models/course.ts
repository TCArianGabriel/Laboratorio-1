// Niveles de dificultad permitidos
export type CourseLevel = "Beginner" | "Intermediate" | "Advanced";

// Interfaz con la forma de los datos de un curso
export interface ICourse {
    title: string;
    level: CourseLevel;
    duration: number;
    description: string;
}

// Escapa caracteres especiales para insertar texto de forma segura en HTML
function escapeHtml(text: string): string {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

// Escapa los caracteres especiales de expresiones regulares (por ejemplo "C++")
function escapeRegExp(text: string): string {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Devuelve el texto con las coincidencias de "search" envueltas en <strong>
function highlightText(text: string, search: string): string {
    const term = search.trim();
    if (term === "") {
        return escapeHtml(text);
    }

    const regex = new RegExp(`(${escapeRegExp(term)})`, "gi");

    // Al usar un grupo ( ) en split, las coincidencias quedan en las posiciones impares
    return text
        .split(regex)
        .map((part: string, index: number): string =>
            index % 2 === 1 ? `<strong>${escapeHtml(part)}</strong>` : escapeHtml(part)
        )
        .join("");
}


// Clase Course que implementa la interfaz ICourse
export class Course implements ICourse {
    title: string;
    level: CourseLevel;
    duration: number;
    description: string;

    constructor(title: string, level: CourseLevel, duration: number, description: string) {
        this.title = title;
        this.level = level;
        this.duration = duration;
        this.description = description;
    }

    // Devuelve el HTML de la tarjeta del curso como string
    render(searchText: string = ""): string {
        return `
            <article class="course-card">
                <h2>${highlightText(this.title, searchText)}</h2>
                <p class="level ${this.level.toLowerCase()}">${this.level}</p>
                <p class="duration">Duración: ${this.duration} horas</p>
                <p class="description">${escapeHtml(this.description)}</p>
            </article>
        `;
    }
}
