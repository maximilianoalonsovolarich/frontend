export interface Table {
  name: string;
  description?: string;
  // Agrega aquí otras propiedades que pueda tener una tabla
}

export interface TablesResponse {
  tables: (string | Table)[];
} 