import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('client_forms')
export class ClientForm {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'nama_lengkap' })
  namaLengkap: string;

  @Column({ name: 'nomor_hp' })
  nomorHP: string;

  @Column()
  email: string;

  @Column({ name: 'jumlah_entitas' })
  jumlahEntitas: number;

  @Column('text', { name: 'jasa_yang_dibutuhkan' })
  jasaYangDibutuhkan: string; // JSON string

  @Column('text')
  companies: string; // JSON string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
