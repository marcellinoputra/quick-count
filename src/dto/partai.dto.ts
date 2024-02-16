export interface PartaiForm {
  id?: number;
  singkatan_partai: string;
  nama_partai: string;
  logo_partai: string;
  createdAt: Date;
  updatedAt?: Date | null;
}
