export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

type GenericRecord = Record<string, any>

type GenericTable = {
  Row: GenericRecord
  Insert: GenericRecord
  Update: GenericRecord
}

export type Database = {
  public: {
    Tables: Record<string, GenericTable>
    Views: Record<string, GenericTable>
    Functions: Record<string, { Args: GenericRecord; Returns: any }>
    Enums: Record<string, string>
  }
  cp: {
    Tables: Record<string, GenericTable>
    Views: Record<string, GenericTable>
    Functions: Record<string, { Args: GenericRecord; Returns: any }>
    Enums: Record<string, string>
  }
  billing: {
    Tables: Record<string, GenericTable>
    Views: Record<string, GenericTable>
    Functions: Record<string, { Args: GenericRecord; Returns: any }>
    Enums: Record<string, string>
  }
}

export default Database
