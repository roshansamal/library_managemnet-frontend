export type ServicingMasterType = {
  id:number;
  machine_brand:string;
  product_type:string;
  machine_model:string;
  machine_serial:string;
  service_date:string;
  service_by:string;
  service_at_hmr:string;
  service_type:number; //` mediumint(9) DEFAULT NULL,
  record_writer:string;
  record_date:string;
  remarks:string;
  status:string;
  machine_id:number;
};
