/* eslint-disable @typescript-eslint/no-explicit-any */

import { AxiosService } from "@/apis/axios.base";
import { FilterQueryStringTypeItem } from "@/apis/ddd/repository.port";
import { UserResponseGetItem } from "@/dtos/auth/auth.response.dto";

class WorkingScheduleServicesBase extends AxiosService {
  protected readonly basePath = "/v1/business";

  async getWorkingSchedule(
    searchFilter: FilterQueryStringTypeItem[] = [],
    params?: any
  ): Promise<UserResponseGetItem> {
    return this.getWithFilter(
      `${this.basePath}/lich-lam`,
      searchFilter,
      params
    );
  }
}

const WorkingScheduleServices = new WorkingScheduleServicesBase();
export default WorkingScheduleServices;
