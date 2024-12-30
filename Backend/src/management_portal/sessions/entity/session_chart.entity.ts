import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn, PrimaryColumn, Index } from "typeorm";

//BrowserChart
@Entity("session_details")
@Index("idx_user_agent", ["user_agent"]) // Adding index to optimize queries by user_agent
export class BrowsersChart {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  user_agent: string;

  @Column()
  start_time: Date;

  @Column()
  stop_time: Date;
}

//Data Usage Chart
@Entity("session_catalog")
@Index("idx_session_catalog_id", ["id"])
export class DataUsageSessionCatalog {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;
}

@Entity("session_details")
@Index("idx_index_column", ["index_column"]) // Index for start_time filtering
export class DataUsageChart {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => DataUsageSessionCatalog)
  @JoinColumn({ name: "session_catalog_id" })
  session_catalog: DataUsageSessionCatalog;

  @Column()
  user_agent: string;

  @Column()
  data_usage_mb: number;

  @Column()
  start_time: Date;

  @Column()
  stop_time: Date;

  @Column()
  index_column: number; // Ensure this column is being indexed if used in queries
}

//User Device chart
@Entity("sessions")
export class UserDeviceChart {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  user_device: string;

  @Column()
  created_date: Date;
}

//Data Usage Pax  Chart
@Entity("session_catalog")
@Index("idx_session_catalog_id", ["id"])
export class PaxDateServiceSessionCatalog {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;
}

@Entity("session_details")
@Index("idx_index_column", ["index_column"]) // Index for start_time filtering
export class DataUsagePaxDateServiceChart {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => PaxDateServiceSessionCatalog)
  @JoinColumn({ name: "session_catalog_id" })
  session_catalog: PaxDateServiceSessionCatalog;

  @Column()
  user_agent: string;

  @Column()
  data_usage_mb: number;

  @Column()
  start_time: Date;

  @Column()
  stop_time: Date;

  @Column()
  index_column: number; // Ensure this column is being indexed if used in queries
}

//chartDataUsageDate
@Entity("session_details")
@Index("idx_index_column", ["index_column"]) // Index for start_time filtering
export class DataUsageDateChart {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  start_time: Date;

  @Column()
  stop_time: Date;

  @Column()
  index_column: number; // Ensure this column is being indexed if used in queries
}

//chartPaxSessionAveragePerDay
@Entity("session_details")
@Index("idx_index_column", ["index_column"]) // Index for start_time filtering
export class PaxSessionAveragePerDayChart {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  start_time: Date;

  @Column()
  stop_time: Date;

  @Column()
  index_column: number; // Ensure this column is being indexed if used in queries
}
