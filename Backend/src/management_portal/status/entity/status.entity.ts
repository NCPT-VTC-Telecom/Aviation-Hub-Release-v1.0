import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity("status")
export class Status {
  @PrimaryColumn()
  id: number;

  @Column()
  code: number;

  @Column()
  description: string;
}

@Entity("status")
export class StatusDescription {
  @PrimaryColumn()
  id: number;

  @Column()
  description: string;
}
