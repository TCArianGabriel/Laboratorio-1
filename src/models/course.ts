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
    render(): string {
        return `
            <article class="course-card">
                <h2>${escapeHtml(this.title)}</h2>
                <p class="level ${this.level.toLowerCase()}">${this.level}</p>
                <p class="duration">Duración: ${this.duration} horas</p>
                <p class="description">${escapeHtml(this.description)}</p>
            </article>
        `;
    }
}
