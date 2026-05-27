export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type LegacyRow = Record<string, any>;

export interface Database {
  public: {
    Tables: {
      [key: string]: {
        Row: LegacyRow;
        Insert: LegacyRow;
        Update: LegacyRow;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      [key: string]: string;
    };
  };
}

export default Database;
