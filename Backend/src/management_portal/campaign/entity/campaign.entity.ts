import { Products } from "src/management_portal/products/entity/product.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("campaign")
export class CampaignInfo {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  status_id: number;

  @Column()
  start_date: Date;

  @Column()
  end_date: Date;

  @Column()
  budget: number;

  @OneToMany(() => CampaignDetails, (campaignDetails) => campaignDetails.campaign)
  campaign_details: CampaignDetails[];

  @Column()
  created_date: Date;

  @Column()
  modified_date: Date;

  @Column()
  deleted_date: Date;
}

@Entity("campaign_details")
export class CampaignDetails {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  campaign_id: string;

  @Column()
  product_id: number;

  @OneToOne(() => Products)
  @JoinColumn({ name: "product_id" })
  product: Products;

  @ManyToOne(() => CampaignInfo, (campaign) => campaign.campaign_details)
  @JoinColumn({ name: "campaign_id" })
  campaign: CampaignInfo;

  @Column()
  quantity: number;

  @Column()
  status_id: number;

  @Column()
  deleted_date: Date;
}
