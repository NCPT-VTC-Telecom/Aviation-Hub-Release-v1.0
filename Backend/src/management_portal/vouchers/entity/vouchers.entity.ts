import { UserInformation } from "src/management_portal/user/entity/user.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { CampaignInfo } from "../../campaign/entity/campaign.entity";
import { Products } from "../../products/entity/product.entity";

@Entity("voucher_systems")
export class VoucherSystemInfo {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;
}

@Entity("vouchers")
export class Vouchers {
  @PrimaryColumn()
  id: string;

  @Column()
  campaign_id: string;

  @OneToOne(() => CampaignInfo)
  @JoinColumn({ name: "campaign_id" })
  item_campaign: CampaignInfo;

  @Column()
  voucher_code: string;

  @Column()
  created_by: number;

  @Column()
  from_date: Date;

  @Column()
  end_date: Date;

  @Column()
  type: number;

  @Column()
  user_id: string;

  @OneToOne(() => UserInformation)
  @JoinColumn({ name: "user_id" })
  user: UserInformation;

  @Column()
  product_id: number;

  @OneToOne(() => Products)
  @JoinColumn({ name: "product_id" })
  item_product: Products;

  @Column()
  status_id: number;

  @Column()
  created_date: Date;

  @Column()
  modified_date: Date;

  @Column()
  deleted_date: Date;
}
