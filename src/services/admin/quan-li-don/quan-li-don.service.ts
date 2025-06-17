/* eslint-disable @typescript-eslint/no-explicit-any */
import { ValidateBaseClass } from "@/apis/ddd/validate.class.base";

import { AxiosService } from "@/apis/axios.base";
import { FilterQueryStringTypeItem } from "@/apis/ddd/repository.port";
import {
  UpdateFormStatusRequest,
  UpdateFormStatusSchema,
} from "@/dtos/quan-li-don/quan-li-don.request.dto";
import { FormResponseGetItem } from "@/dtos/quan-li-don/quan-li-don.response.dto";
import dayjs from "dayjs";

export interface FromSearchParams {
  quickSearch?: string;
  fromDate: dayjs.Dayjs;
  toDate: dayjs.Dayjs;
  formId?: string;
  [key: string]: string | dayjs.Dayjs | undefined;
}

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
    searchFilter: FilterQueryStringTypeItem[] = [],
    params?: FromSearchParams
  ): Promise<FormResponseGetItem> {
    return this.getWithFilter(
      `${this.basePath}/filter`,
      searchFilter,
      params as Record<string, string>
    );
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
