/* eslint-disable @typescript-eslint/no-explicit-any */
import { ValidateBaseClass } from "@/apis/ddd/validate.class.base";

import { AxiosService } from "@/apis/axios.base";
import { FilterQueryStringTypeItem } from "@/apis/ddd/repository.port";
import {
  UpdateFormStatusRequest,
  UpdateFormStatusSchema
} from "@/dtos/quan-li-don/quan-li-don.request.dto";
import { FormResponseGetItem } from "@/dtos/quan-li-don/quan-li-don.response.dto";

class DanhMucDonServicesBase extends AxiosService {
  protected readonly basePath = "/v1/form-description";

  async getDanhMucDon(
    searchFilter: FilterQueryStringTypeItem[] = [],
    params?: any
  ): Promise<FormResponseGetItem> {
    if (params && Object.keys(params).length > 0) {
      const queryParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
      
      return this.getWithParams(`${this.basePath}`, queryParams);
    }
    
    return this.getWithFilter(`${this.basePath}`, searchFilter);
  }
  
  async filterDanhMucDon(
    params?: Record<string, string | number>
  ): Promise<FormResponseGetItem> {
    if (params && Object.keys(params).length > 0) {
      const queryParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
      
      return this.getWithParams(`${this.basePath}/filter`, queryParams);
    }
    
    return this.get(`${this.basePath}/filter`);
  }

  async updateFormStatus(
    id: string | undefined,
    formData: UpdateFormStatusRequest
  ): Promise<any> {
    await ValidateBaseClass.validate(formData, UpdateFormStatusSchema);
    return this.put(`${this.basePath}/${id}`, formData);
  }
}

const DanhMucDonServices = new DanhMucDonServicesBase();
export default DanhMucDonServices; 